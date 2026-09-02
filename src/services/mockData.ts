import type { OpenAPISpec } from '../models/openapi'

export const defaultSpec: OpenAPISpec = {
  info: {
    title: '',
    description: '',
    version: '1.0.0',
    contact: {
      name: '',
      email: '',
      url: '',
    },
    license: {
      name: '',
      url: '',
    },
  },
  servers: [],
  tags: [],
  security: [],
  endpoints: [],
  schemas: [],
}
