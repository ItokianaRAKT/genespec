export interface Info {
  title: string
  description: string
  version: string
  contact: {
    name: string
    email: string
    url: string
  }
  license: {
    name: string
    url: string
  }
}

export interface Server {
  id: string
  url: string
  description: string
}

export interface SecurityScheme {
  id: string
  name: string
  type: 'http' | 'apiKey' | 'oauth2' | 'openIdConnect'
  scheme?: string
  bearerFormat?: string
  in?: 'query' | 'header' | 'cookie'
}

export interface Tag {
  id: string
  name: string
  description: string
}

export interface Parameter {
  id: string
  name: string
  in: 'query' | 'path' | 'header' | 'cookie'
  description: string
  required: boolean
  type: string
  format?: string
  defaultValue?: string
  enum?: string[]
}

export interface RequestBody {
  description: string
  required: boolean
  content: Record<string, MediaType>
}

export interface MediaType {
  schema?: {
    type?: string
    $ref?: string
  }
  example?: string
}

export interface Response {
  statusCode: string
  description: string
  content?: Record<string, MediaType>
}

export interface Endpoint {
  id: string
  method: string
  path: string
  summary: string
  description: string
  operationId: string
  deprecated: boolean
  tags: string[]
  parameters: Parameter[]
  requestBody?: RequestBody
  responses: Response[]
}

export interface SchemaProperty {
  id: string
  name: string
  type: string
  format?: string
  description: string
  required: boolean
  nullable?: boolean
  defaultValue?: string
  enum?: string[]
}

export interface Schema {
  id: string
  name: string
  description: string
  properties: SchemaProperty[]
}

export interface ReusableResponse {
  id: string
  name: string
  description: string
  content?: Record<string, MediaType>
}

export interface ReusableParameter {
  id: string
  name: string
  in: 'query' | 'path' | 'header' | 'cookie'
  description: string
  required: boolean
  type: string
  format?: string
  defaultValue?: string
  enum?: string[]
}

export interface ReusableRequestBody {
  id: string
  name: string
  description: string
  required: boolean
  content: Record<string, MediaType>
}

export interface OpenAPISpec {
  info: Info
  servers: Server[]
  tags: Tag[]
  security: SecurityScheme[]
  endpoints: Endpoint[]
  schemas: Schema[]
  responses: ReusableResponse[]
  parameters: ReusableParameter[]
  requestBodies: ReusableRequestBody[]
}

export type SidebarSection = 'overview' | 'info' | 'servers' | 'security' | 'tags' | 'endpoints' | 'schemas' | 'responses' | 'parameters' | 'requestBodies'
