import type { OpenAPISpec } from '../models/openapi'

export const defaultSpec: OpenAPISpec = {
  info: {
    title: '',
    description: '',
    version: '',
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
