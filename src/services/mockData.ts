import type { OpenAPISpec } from '../models/openapi'

export const defaultSpec: OpenAPISpec = {
  info: {
    title: 'My API',
    description: 'A brief description of your API',
    version: '1.0.0',
    contact: {
      name: 'API Support',
      email: 'support@example.com',
      url: 'https://example.com',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      id: 'server-1',
      url: 'https://api.example.com/v1',
      description: 'Production server',
    },
  ],
  tags: [
    {
      id: 'tag-1',
      name: 'users',
      description: 'User management operations',
    },
  ],
  security: [
    {
      id: 'sec-1',
      name: 'bearerAuth',
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
  ],
  endpoints: [
    {
      id: 'ep-1',
      method: 'GET',
      path: '/users',
      summary: 'List all users',
      description: 'Returns a list of all users',
      operationId: 'listUsers',
      deprecated: false,
      tags: ['users'],
      parameters: [],
      responses: [
        {
          statusCode: '200',
          description: 'Successful response',
          content: {
            'application/json': {
              schema: {
                type: 'array',
              },
            },
          },
        },
      ],
    },
    {
      id: 'ep-2',
      method: 'POST',
      path: '/users',
      summary: 'Create a user',
      description: 'Creates a new user',
      operationId: 'createUser',
      deprecated: false,
      tags: ['users'],
      parameters: [],
      requestBody: {
        description: 'User to create',
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/User',
            },
          },
        },
      },
      responses: [
        {
          statusCode: '201',
          description: 'User created',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/User',
              },
            },
          },
        },
      ],
    },
    {
      id: 'ep-3',
      method: 'GET',
      path: '/users/{id}',
      summary: 'Get a user by ID',
      description: 'Returns a single user',
      operationId: 'getUserById',
      deprecated: false,
      tags: ['users'],
      parameters: [
        {
          id: 'param-1',
          name: 'id',
          in: 'path',
          description: 'The user ID',
          required: true,
          type: 'integer',
          format: 'int64',
        },
      ],
      responses: [
        {
          statusCode: '200',
          description: 'Successful response',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/User',
              },
            },
          },
        },
      ],
    },
  ],
  schemas: [
    {
      id: 'schema-1',
      name: 'User',
      description: 'A user object',
      properties: [
        {
          id: 'prop-1',
          name: 'id',
          type: 'integer',
          format: 'int64',
          description: 'User ID',
          required: true,
        },
        {
          id: 'prop-2',
          name: 'name',
          type: 'string',
          description: 'User name',
          required: true,
        },
        {
          id: 'prop-3',
          name: 'email',
          type: 'string',
          format: 'email',
          description: 'User email',
          required: true,
        },
      ],
    },
    {
      id: 'schema-2',
      name: 'Error',
      description: 'An error object',
      properties: [
        {
          id: 'prop-4',
          name: 'code',
          type: 'integer',
          description: 'Error code',
          required: true,
        },
        {
          id: 'prop-5',
          name: 'message',
          type: 'string',
          description: 'Error message',
          required: true,
        },
      ],
    },
  ],
}
