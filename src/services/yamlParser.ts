import * as yaml from 'js-yaml'
import type { OpenAPISpec, Server, SecurityScheme, Tag, Endpoint, Parameter, Response, Schema, SchemaProperty, ReusableResponse, ReusableParameter, ReusableRequestBody } from '../models/openapi'

function uid(): string {
  return Math.random().toString(36).slice(2, 10)
}

function resolveRef(ref: string, root: any): any {
  if (!ref || !ref.startsWith('#/')) return undefined
  const parts = ref.replace('#/', '').split('/')
  let current = root
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part]
    } else {
      return undefined
    }
  }
  return current
}

function parseServers(data: any): Server[] {
  if (!Array.isArray(data)) return []
  return data.map((s: any) => ({
    id: uid(),
    url: s.url || '',
    description: s.description || '',
  }))
}

function parseTags(data: any): Tag[] {
  if (!Array.isArray(data)) return []
  return data.map((t: any) => ({
    id: uid(),
    name: t.name || '',
    description: t.description || '',
  }))
}

function parseSecuritySchemes(data: any): SecurityScheme[] {
  if (!data || typeof data !== 'object') return []
  return Object.entries(data).map(([name, scheme]: [string, any]) => {
    const sec: SecurityScheme = {
      id: uid(),
      name,
      type: scheme.type || 'http',
    }
    if (scheme.type === 'http') {
      sec.scheme = scheme.scheme || 'bearer'
      if (scheme.bearerFormat) sec.bearerFormat = scheme.bearerFormat
    }
    if (scheme.type === 'apiKey') {
      sec.in = scheme.in || 'header'
    }
    return sec
  })
}

function safeString(val: any): string | undefined {
  if (val === undefined || val === null) return undefined
  if (typeof val === 'string') return val
  return undefined
}

function parseParameters(params: any[], root: any): Parameter[] {
  if (!Array.isArray(params)) return []
  return params.map((p: any) => {
    const resolved = p.$ref ? resolveRef(p.$ref, root) : p
    if (!resolved) {
      return {
        id: uid(),
        name: p.$ref ? p.$ref.split('/').pop() : '',
        in: 'query',
        description: '',
        required: false,
        type: 'string',
      }
    }
    return {
      id: uid(),
      name: resolved.name || '',
      in: resolved.in || 'query',
      description: resolved.description || '',
      required: resolved.required || false,
      type: safeString(resolved.schema?.type) || 'string',
      format: safeString(resolved.schema?.format),
      defaultValue: resolved.schema?.default,
      enum: resolved.schema?.enum,
    }
  })
}

function parseResponses(responses: any): Response[] {
  if (!responses || typeof responses !== 'object') return []
  return Object.entries(responses).map(([statusCode, res]: [string, any]) => ({
    statusCode,
    description: res?.description || '',
    content: res?.content,
  }))
}

const HTTP_METHODS = new Set(['get', 'post', 'put', 'patch', 'delete', 'options', 'head', 'trace'])
const OPERATION_KEYS = new Set(['summary', 'description', 'operationId', 'operationID', 'tags', 'parameters', 'requestBody', 'responses', 'deprecated', 'security', 'servers', 'externalDocs'])

function parseEndpoints(data: any, root: any): Endpoint[] {
  const endpoints: Endpoint[] = []
  if (!data || typeof data !== 'object') return endpoints

  for (const [path, pathItem] of Object.entries(data)) {
    if (typeof pathItem !== 'object' || pathItem === null) continue

    const pi = pathItem as any
    const methods: Record<string, any> = {}
    const orphans: Record<string, any> = {}

    for (const [key, val] of Object.entries(pi)) {
      if (HTTP_METHODS.has(key)) {
        methods[key] = val
      } else if (OPERATION_KEYS.has(key)) {
        orphans[key] = val
      }
    }

    const methodKeys = Object.keys(methods)

    if (methodKeys.length === 0 && Object.keys(orphans).length > 0) {
      methods['get'] = orphans
    } else if (methodKeys.length > 0 && Object.keys(orphans).length > 0) {
      const lastMethod = methods[methodKeys[methodKeys.length - 1]]
      if (typeof lastMethod === 'object' && lastMethod !== null) {
        for (const [key, val] of Object.entries(orphans)) {
          if (!(key in lastMethod)) {
            lastMethod[key] = val
          }
        }
      }
    }

    for (const [method, details] of Object.entries(methods)) {
      if (typeof details !== 'object' || details === null) continue
      const ep = details as any
      endpoints.push({
        id: uid(),
        method: method.toUpperCase(),
        path,
        summary: ep.summary || '',
        description: ep.description || '',
        operationId: ep.operationId || ep.operationID || '',
        deprecated: ep.deprecated || false,
        tags: Array.isArray(ep.tags) ? ep.tags : [],
        parameters: parseParameters(ep.parameters, root),
        requestBody: ep.requestBody
          ? { ...ep.requestBody, content: ep.requestBody.content || {} }
          : undefined,
        responses: parseResponses(ep.responses),
      })
    }
  }
  return endpoints
}

function flattenAllOf(allOf: any[], root: any): any[] {
  const props: Record<string, any> = {}
  const requiredSet = new Set<string>()

  for (const item of allOf) {
    const resolved = item.$ref ? resolveRef(item.$ref, root) : item
    if (!resolved) continue

    if (resolved.properties) {
      for (const [k, v] of Object.entries(resolved.properties)) {
        props[k] = v
      }
    }
    if (Array.isArray(resolved.required)) {
      for (const r of resolved.required) {
        requiredSet.add(r)
      }
    }
  }

  return Object.entries(props).map(([name, def]) => ({
    name,
    def,
    required: requiredSet.has(name),
  }))
}

function parseSchemas(data: any, root: any): Schema[] {
  if (!data || typeof data !== 'object') return []
  return Object.entries(data).map(([name, schema]: [string, any]) => {
    const properties: SchemaProperty[] = []

    if (schema.allOf && Array.isArray(schema.allOf)) {
      const flatProps = flattenAllOf(schema.allOf, root)
      for (const { name: propName, def, required } of flatProps) {
        const prop = def as any
        properties.push({
          id: uid(),
          name: propName,
          type: safeString(prop.type) || 'object',
          format: safeString(prop.format),
          description: prop.description || '',
          required,
          nullable: prop.nullable || false,
          defaultValue: prop.default,
          enum: prop.enum,
        })
      }
      if (schema.properties && typeof schema.properties === 'object') {
        for (const [propName, propDef] of Object.entries(schema.properties)) {
          const prop = propDef as any
          properties.push({
            id: uid(),
            name: propName,
            type: safeString(prop.type) || 'string',
            format: safeString(prop.format),
            description: prop.description || '',
            required: schema.required?.includes(propName) || false,
            nullable: prop.nullable || false,
            defaultValue: prop.default,
            enum: prop.enum,
          })
        }
      }
    } else if (schema.properties && typeof schema.properties === 'object') {
      for (const [propName, propDef] of Object.entries(schema.properties)) {
        const prop = propDef as any
        properties.push({
          id: uid(),
          name: propName,
          type: safeString(prop.type) || 'string',
          format: safeString(prop.format),
          description: prop.description || '',
          required: schema.required?.includes(propName) || false,
          nullable: prop.nullable || false,
          defaultValue: prop.default,
          enum: prop.enum,
        })
      }
    }

    return {
      id: uid(),
      name,
      description: schema.description || '',
      properties,
    }
  })
}

function parseReusableResponses(data: any): ReusableResponse[] {
  if (!data || typeof data !== 'object') return []
  return Object.entries(data).map(([name, res]: [string, any]) => ({
    id: uid(),
    name,
    description: res?.description || '',
    content: res?.content,
  }))
}

function parseReusableParameters(data: any): ReusableParameter[] {
  if (!data || typeof data !== 'object') return []
  return Object.entries(data).map(([name, param]: [string, any]) => ({
    id: uid(),
    name: param.name || name,
    in: param.in || 'query',
    description: param.description || '',
    required: param.required || false,
    type: safeString(param.schema?.type) || 'string',
    format: safeString(param.schema?.format),
    defaultValue: param.schema?.default,
    enum: param.schema?.enum,
  }))
}

function parseReusableRequestBodies(data: any): ReusableRequestBody[] {
  if (!data || typeof data !== 'object') return []
  return Object.entries(data).map(([name, body]: [string, any]) => ({
    id: uid(),
    name,
    description: body?.description || '',
    required: body?.required || false,
    content: body?.content || {},
  }))
}

export function parseYamlToSpec(yamlContent: string): OpenAPISpec {
  let data: any
  try {
    data = yaml.load(yamlContent)
  } catch {
    throw new Error('Invalid YAML format')
  }

  if (!data || typeof data !== 'object') {
    throw new Error('Invalid OpenAPI spec')
  }

  const info = {
    title: data.info?.title || '',
    description: data.info?.description || '',
    version: data.info?.version || '1.0.0',
    contact: {
      name: data.info?.contact?.name || '',
      email: data.info?.contact?.email || '',
      url: data.info?.contact?.url || '',
    },
    license: {
      name: data.info?.license?.name || '',
      url: data.info?.license?.url || '',
    },
  }

  return {
    info,
    servers: parseServers(data.servers),
    tags: parseTags(data.tags),
    security: parseSecuritySchemes(data.components?.securitySchemes),
    endpoints: parseEndpoints(data.paths, data),
    schemas: parseSchemas(data.components?.schemas, data),
    responses: parseReusableResponses(data.components?.responses),
    parameters: parseReusableParameters(data.components?.parameters),
    requestBodies: parseReusableRequestBodies(data.components?.requestBodies),
  }
}
