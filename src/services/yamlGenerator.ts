import type { OpenAPISpec } from '../models/openapi'

function indent(level: number): string {
  return '  '.repeat(level)
}

function yamlValue(val: string): string {
  if (/[:{}\[\],&*?|>!%@`#'"\n]/.test(val) || val === '' || /^\d/.test(val)) {
    return `"${val.replace(/"/g, '\\"')}"`
  }
  return val
}

function generateInfo(info: OpenAPISpec['info']): string {
  const lines: string[] = []
  lines.push('openapi: "3.0.3"')
  lines.push('info:')
  lines.push(`${indent(1)}title: ${yamlValue(info.title)}`)
  if (info.description) lines.push(`${indent(1)}description: ${yamlValue(info.description)}`)
  lines.push(`${indent(1)}version: ${yamlValue(info.version)}`)
  if (info.contact.name || info.contact.email || info.contact.url) {
    lines.push(`${indent(1)}contact:`)
    if (info.contact.name) lines.push(`${indent(2)}name: ${yamlValue(info.contact.name)}`)
    if (info.contact.email) lines.push(`${indent(2)}email: ${yamlValue(info.contact.email)}`)
    if (info.contact.url) lines.push(`${indent(2)}url: ${yamlValue(info.contact.url)}`)
  }
  if (info.license.name) {
    lines.push(`${indent(1)}license:`)
    lines.push(`${indent(2)}name: ${yamlValue(info.license.name)}`)
    if (info.license.url) lines.push(`${indent(2)}url: ${yamlValue(info.license.url)}`)
  }
  return lines.join('\n')
}

function generateServers(servers: OpenAPISpec['servers']): string {
  if (servers.length === 0) return ''
  const lines: string[] = []
  lines.push('')
  lines.push('servers:')
  for (const server of servers) {
    lines.push(`${indent(1)}- url: ${yamlValue(server.url)}`)
    if (server.description) lines.push(`${indent(2)}description: ${yamlValue(server.description)}`)
  }
  return lines.join('\n')
}

function generateTags(tags: OpenAPISpec['tags']): string {
  if (tags.length === 0) return ''
  const lines: string[] = []
  lines.push('')
  lines.push('tags:')
  for (const tag of tags) {
    lines.push(`${indent(1)}- name: ${yamlValue(tag.name)}`)
    if (tag.description) lines.push(`${indent(2)}description: ${yamlValue(tag.description)}`)
  }
  return lines.join('\n')
}

function generateSecurity(security: OpenAPISpec['security']): string {
  if (security.length === 0) return ''
  const lines: string[] = []
  lines.push('')
  lines.push('security:')
  for (const sec of security) {
    lines.push(`${indent(1)}- ${yamlValue(sec.name)}: []`)
  }
  return lines.join('\n')
}

function generatePaths(endpoints: OpenAPISpec['endpoints']): string {
  if (endpoints.length === 0) return ''
  const lines: string[] = []
  lines.push('')
  lines.push('paths:')

  const grouped: Record<string, typeof endpoints> = {}
  for (const ep of endpoints) {
    if (!grouped[ep.path]) grouped[ep.path] = []
    grouped[ep.path].push(ep)
  }

  for (const [path, eps] of Object.entries(grouped)) {
    lines.push(`${indent(1)}${yamlValue(path)}:`)
    for (const ep of eps) {
      lines.push(`${indent(2)}${ep.method}:`)
      if (ep.summary) lines.push(`${indent(3)}summary: ${yamlValue(ep.summary)}`)
      if (ep.description) lines.push(`${indent(3)}description: ${yamlValue(ep.description)}`)
      if (ep.operationId) lines.push(`${indent(3)}operationId: ${yamlValue(ep.operationId)}`)
      if (ep.deprecated) lines.push(`${indent(3)}deprecated: true`)
      if (ep.tags.length > 0) {
        lines.push(`${indent(3)}tags:`)
        for (const tag of ep.tags) lines.push(`${indent(4)}- ${yamlValue(tag)}`)
      }
      if (ep.parameters.length > 0) {
        lines.push(`${indent(3)}parameters:`)
        for (const param of ep.parameters) {
          lines.push(`${indent(4)}- name: ${yamlValue(param.name)}`)
          lines.push(`${indent(5)}in: ${param.in}`)
          if (param.description) lines.push(`${indent(5)}description: ${yamlValue(param.description)}`)
          if (param.required) lines.push(`${indent(5)}required: true`)
          lines.push(`${indent(5)}schema:`)
          lines.push(`${indent(6)}type: ${param.type}`)
          if (param.format) lines.push(`${indent(6)}format: ${yamlValue(param.format)}`)
          if (param.defaultValue) lines.push(`${indent(6)}default: ${yamlValue(param.defaultValue)}`)
          if (param.enum && param.enum.length > 0) {
            lines.push(`${indent(6)}enum:`)
            for (const e of param.enum) lines.push(`${indent(7)}- ${yamlValue(e)}`)
          }
        }
      }
      if (ep.requestBody) {
        lines.push(`${indent(3)}requestBody:`)
        if (ep.requestBody.description) lines.push(`${indent(4)}description: ${yamlValue(ep.requestBody.description)}`)
        if (ep.requestBody.required) lines.push(`${indent(4)}required: true`)
        lines.push(`${indent(4)}content:`)
        for (const [mediaType, media] of Object.entries(ep.requestBody.content)) {
          lines.push(`${indent(5)}${yamlValue(mediaType)}:`)
          if (media.schema) {
            lines.push(`${indent(6)}schema:`)
            if (media.schema.$ref) lines.push(`${indent(7)}$ref: ${yamlValue(media.schema.$ref)}`)
            else if (media.schema.type) lines.push(`${indent(7)}type: ${media.schema.type}`)
          }
          if (media.example) lines.push(`${indent(6)}example: ${yamlValue(String(media.example))}`)
        }
      }
      lines.push(`${indent(3)}responses:`)
      if (ep.responses.length === 0) {
        lines.push(`${indent(4)}"200":`)
        lines.push(`${indent(5)}description: OK`)
      } else {
        for (const res of ep.responses) {
          lines.push(`${indent(4)}"${res.statusCode}":`)
          lines.push(`${indent(5)}description: ${yamlValue(res.description)}`)
          if (res.content) {
            lines.push(`${indent(5)}content:`)
            for (const [mediaType, media] of Object.entries(res.content)) {
              lines.push(`${indent(6)}${yamlValue(mediaType)}:`)
              if (media.schema) {
                lines.push(`${indent(7)}schema:`)
                if (media.schema.$ref) lines.push(`${indent(8)}$ref: ${yamlValue(media.schema.$ref)}`)
                else if (media.schema.type) lines.push(`${indent(8)}type: ${media.schema.type}`)
              }
            }
          }
        }
      }
    }
  }
  return lines.join('\n')
}

function generateSecuritySchemes(security: OpenAPISpec['security']): string {
  if (security.length === 0) return ''
  const lines: string[] = []
  lines.push(`${indent(2)}securitySchemes:`)
  for (const sec of security) {
    lines.push(`${indent(3)}${yamlValue(sec.name)}:`)
    lines.push(`${indent(4)}type: ${sec.type}`)
    if (sec.type === 'http' && sec.scheme) {
      lines.push(`${indent(4)}scheme: ${sec.scheme}`)
      if (sec.bearerFormat) lines.push(`${indent(4)}bearerFormat: ${yamlValue(sec.bearerFormat)}`)
    }
    if (sec.type === 'apiKey' && sec.in) {
      lines.push(`${indent(4)}in: ${sec.in}`)
      lines.push(`${indent(4)}name: ${yamlValue(sec.name)}`)
    }
  }
  return lines.join('\n')
}

function generateSchemas(schemas: OpenAPISpec['schemas']): string {
  if (schemas.length === 0) return ''
  const lines: string[] = []
  lines.push(`${indent(2)}schemas:`)
  for (const schema of schemas) {
    lines.push(`${indent(3)}${yamlValue(schema.name)}:`)
    lines.push(`${indent(4)}type: object`)
    if (schema.description) lines.push(`${indent(4)}description: ${yamlValue(schema.description)}`)
    const required = schema.properties.filter(p => p.required)
    if (required.length > 0) {
      lines.push(`${indent(4)}required:`)
      for (const prop of required) lines.push(`${indent(5)}- ${yamlValue(prop.name)}`)
    }
    lines.push(`${indent(4)}properties:`)
    for (const prop of schema.properties) {
      lines.push(`${indent(5)}${yamlValue(prop.name)}:`)
      lines.push(`${indent(6)}type: ${prop.type}`)
      if (prop.format) lines.push(`${indent(6)}format: ${yamlValue(prop.format)}`)
      if (prop.description) lines.push(`${indent(6)}description: ${yamlValue(prop.description)}`)
      if (prop.defaultValue) lines.push(`${indent(6)}default: ${yamlValue(prop.defaultValue)}`)
      if (prop.enum && prop.enum.length > 0) {
        lines.push(`${indent(6)}enum:`)
        for (const e of prop.enum) lines.push(`${indent(7)}- ${yamlValue(e)}`)
      }
    }
  }
  return lines.join('\n')
}

function generateComponents(spec: OpenAPISpec): string {
  const hasSchemas = spec.schemas.length > 0
  const hasSecurity = spec.security.length > 0
  if (!hasSchemas && !hasSecurity) return ''
  const lines: string[] = []
  lines.push('')
  lines.push('components:')
  if (hasSecurity) lines.push(generateSecuritySchemes(spec.security))
  if (hasSchemas) lines.push(generateSchemas(spec.schemas))
  return lines.join('\n')
}

export function generateYaml(spec: OpenAPISpec): string {
  const parts: string[] = []
  parts.push(generateInfo(spec.info))
  parts.push(generateServers(spec.servers))
  parts.push(generateTags(spec.tags))
  parts.push(generateSecurity(spec.security))
  parts.push(generatePaths(spec.endpoints))
  parts.push(generateComponents(spec))
  return parts.join('\n') + '\n'
}
