import * as yaml from 'js-yaml'
import type { OpenAPISpec, Server, SecurityScheme, Tag, Endpoint, Parameter, Response, Schema, SchemaProperty } from '../models/openapi'

function uid(): string {
  return Math.random().toString(36).slice(2, 10)
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

function parseSecurity(data: any): SecurityScheme[] {
  if (!Array.isArray(data)) return []
  return data.map((s: any) => {
    const name = Object.keys(s)[0] || ''
    const sec: SecurityScheme = {
      id: uid(),
      name,
      type: 'http',
      scheme: 'bearer',
    }
    return sec
  })
}

function parseParameters(params: any[]): Parameter[] {
  if (!Array.isArray(params)) return []
  return params.map((p: any) => ({
    id: uid(),
    name: p.name || '',
    in: p.in || 'query',
    description: p.description || '',
    required: p.required || false,
    type: p.schema?.type || 'string',
    format: p.schema?.format,
    defaultValue: p.schema?.default,
    enum: p.schema?.enum,
  }))
}

function parseResponses(responses: any): Response[] {
  if (!responses || typeof responses !== 'object') return []
  return Object.entries(responses).map(([statusCode, res]: [string, any]) => ({
    statusCode,
    description: res?.description || '',
    content: res?.content,
  }))
}

function parseEndpoints(data: any): Endpoint[] {
  const endpoints: Endpoint[] = []
  if (!data || typeof data !== 'object') return endpoints

  for (const [path, methods] of Object.entries(data)) {
    if (typeof methods !== 'object' || methods === null) continue
    for (const [method, details] of Object.entries(methods)) {
      if (typeof details !== 'object' || details === null) continue
      const ep = details as any
      endpoints.push({
        id: uid(),
        method: method.toUpperCase(),
        path,
        summary: ep.summary || '',
        description: ep.description || '',
        operationId: ep.operationId || '',
        deprecated: ep.deprecated || false,
        tags: ep.tags || [],
        parameters: parseParameters(ep.parameters),
        requestBody: ep.requestBody
          ? { ...ep.requestBody, content: ep.requestBody.content || {} }
          : undefined,
        responses: parseResponses(ep.responses),
      })
    }
  }
  return endpoints
}

function parseSchemas(data: any): Schema[] {
  if (!data || typeof data !== 'object') return []
  return Object.entries(data).map(([name, schema]: [string, any]) => {
    const properties: SchemaProperty[] = []
    if (schema.properties && typeof schema.properties === 'object') {
      for (const [propName, propDef] of Object.entries(schema.properties)) {
        const prop = propDef as any
        properties.push({
          id: uid(),
          name: propName,
          type: prop.type || 'string',
          format: prop.format,
          description: prop.description || '',
          required: schema.required?.includes(propName) || false,
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
    security: parseSecurity(data.security),
    endpoints: parseEndpoints(data.paths),
    schemas: parseSchemas(data.components?.schemas),
  }
}
