import { useState, useCallback, useEffect } from 'react'
import type { OpenAPISpec, SidebarSection, Server, SecurityScheme, Tag, Endpoint, Parameter, Response, Schema, SchemaProperty, ReusableResponse, ReusableParameter, ReusableRequestBody } from '../models/openapi'
import { defaultSpec } from '../services/mockData'
import { parseYamlToSpec } from '../services/yamlParser'

function uid(): string {
  return Math.random().toString(36).slice(2, 10)
}

function loadSpec(): OpenAPISpec {
  try {
    const saved = localStorage.getItem('genespec-spec')
    if (saved) {
      const parsed = JSON.parse(saved)
      return {
        ...defaultSpec,
        ...parsed,
        info: {
          ...defaultSpec.info,
          ...parsed.info,
          contact: { ...defaultSpec.info.contact, ...parsed.info?.contact },
          license: { ...defaultSpec.info.license, ...parsed.info?.license },
        },
        responses: parsed.responses ?? defaultSpec.responses,
        parameters: parsed.parameters ?? defaultSpec.parameters,
        requestBodies: parsed.requestBodies ?? defaultSpec.requestBodies,
      }
    }
  } catch { /* ignore */ }
  return defaultSpec
}

function loadActiveSection(): SidebarSection {
  try {
    const saved = localStorage.getItem('genespec-active-section') as SidebarSection
    if (saved) return saved
  } catch { /* ignore */ }
  return 'overview'
}

export function useSpecEditor() {
  const [spec, setSpec] = useState<OpenAPISpec>(loadSpec)
  const [activeSection, setActiveSection] = useState<SidebarSection>(loadActiveSection)
  const [selectedEndpointId, setSelectedEndpointId] = useState<string | null>(null)
  const [selectedSchemaId, setSelectedSchemaId] = useState<string | null>(null)
  const [selectedReusableResponseId, setSelectedReusableResponseId] = useState<string | null>(null)
  const [selectedReusableParameterId, setSelectedReusableParameterId] = useState<string | null>(null)
  const [selectedReusableRequestBodyId, setSelectedReusableRequestBodyId] = useState<string | null>(null)

  useEffect(() => {
    localStorage.setItem('genespec-spec', JSON.stringify(spec))
  }, [spec])

  useEffect(() => {
    localStorage.setItem('genespec-active-section', activeSection)
  }, [activeSection])

  const updateInfo = useCallback((field: string, value: string) => {
    setSpec(prev => ({
      ...prev,
      info: { ...prev.info, [field]: value },
    }))
  }, [])

  const updateContact = useCallback((field: string, value: string) => {
    setSpec(prev => ({
      ...prev,
      info: { ...prev.info, contact: { ...prev.info.contact, [field]: value } },
    }))
  }, [])

  const updateLicense = useCallback((field: string, value: string) => {
    setSpec(prev => ({
      ...prev,
      info: { ...prev.info, license: { ...prev.info.license, [field]: value } },
    }))
  }, [])

  const addServer = useCallback(() => {
    const server: Server = { id: uid(), url: '', description: '' }
    setSpec(prev => ({ ...prev, servers: [server, ...prev.servers] }))
  }, [])

  const updateServer = useCallback((id: string, field: string, value: string) => {
    setSpec(prev => ({
      ...prev,
      servers: prev.servers.map(s => s.id === id ? { ...s, [field]: value } : s),
    }))
  }, [])

  const removeServer = useCallback((id: string) => {
    setSpec(prev => ({ ...prev, servers: prev.servers.filter(s => s.id !== id) }))
  }, [])

  const addSecurityScheme = useCallback(() => {
    const sec: SecurityScheme = { id: uid(), name: '', type: 'http', scheme: 'bearer' }
    setSpec(prev => ({ ...prev, security: [sec, ...prev.security] }))
  }, [])

  const updateSecurityScheme = useCallback((id: string, field: string, value: string) => {
    setSpec(prev => ({
      ...prev,
      security: prev.security.map(s => s.id === id ? { ...s, [field]: value } : s),
    }))
  }, [])

  const removeSecurityScheme = useCallback((id: string) => {
    setSpec(prev => ({ ...prev, security: prev.security.filter(s => s.id !== id) }))
  }, [])

  const addTag = useCallback(() => {
    const tag: Tag = { id: uid(), name: '', description: '' }
    setSpec(prev => ({ ...prev, tags: [tag, ...prev.tags] }))
  }, [])

  const updateTag = useCallback((id: string, field: string, value: string) => {
    setSpec(prev => ({
      ...prev,
      tags: prev.tags.map(t => t.id === id ? { ...t, [field]: value } : t),
    }))
  }, [])

  const removeTag = useCallback((id: string) => {
    setSpec(prev => ({ ...prev, tags: prev.tags.filter(t => t.id !== id) }))
  }, [])

  const addEndpoint = useCallback(() => {
    const ep: Endpoint = {
      id: uid(), method: 'GET', path: '/', summary: '', description: '',
      operationId: '', deprecated: false, tags: [], parameters: [], responses: [],
    }
    setSpec(prev => ({ ...prev, endpoints: [ep, ...prev.endpoints] }))
    setSelectedEndpointId(ep.id)
  }, [])

  const updateEndpoint = useCallback((id: string, field: string, value: unknown) => {
    setSpec(prev => ({
      ...prev,
      endpoints: prev.endpoints.map(e => e.id === id ? { ...e, [field]: value } : e),
    }))
  }, [])

  const removeEndpoint = useCallback((id: string) => {
    setSpec(prev => ({ ...prev, endpoints: prev.endpoints.filter(e => e.id !== id) }))
    if (selectedEndpointId === id) setSelectedEndpointId(null)
  }, [selectedEndpointId])

  const addParameter = useCallback((endpointId: string) => {
    const param: Parameter = { id: uid(), name: '', in: 'query', description: '', required: false, type: 'string' }
    setSpec(prev => ({
      ...prev,
      endpoints: prev.endpoints.map(e =>
        e.id === endpointId ? { ...e, parameters: [param, ...e.parameters] } : e
      ),
    }))
  }, [])

  const updateParameter = useCallback((endpointId: string, paramId: string, field: string, value: unknown) => {
    setSpec(prev => ({
      ...prev,
      endpoints: prev.endpoints.map(e =>
        e.id === endpointId
          ? { ...e, parameters: e.parameters.map(p => p.id === paramId ? { ...p, [field]: value } : p) }
          : e
      ),
    }))
  }, [])

  const removeParameter = useCallback((endpointId: string, paramId: string) => {
    setSpec(prev => ({
      ...prev,
      endpoints: prev.endpoints.map(e =>
        e.id === endpointId
          ? { ...e, parameters: e.parameters.filter(p => p.id !== paramId) }
          : e
      ),
    }))
  }, [])

  const addResponse = useCallback((endpointId: string) => {
    const res: Response = { statusCode: '200', description: '' }
    setSpec(prev => ({
      ...prev,
      endpoints: prev.endpoints.map(e =>
        e.id === endpointId ? { ...e, responses: [res, ...e.responses] } : e
      ),
    }))
  }, [])

  const updateResponse = useCallback((endpointId: string, index: number, field: string, value: string) => {
    setSpec(prev => ({
      ...prev,
      endpoints: prev.endpoints.map(e =>
        e.id === endpointId
          ? { ...e, responses: e.responses.map((r, i) => i === index ? { ...r, [field]: value } : r) }
          : e
      ),
    }))
  }, [])

  const updateResponseContent = useCallback((endpointId: string, index: number, mediaType: string, ref: string) => {
    setSpec(prev => ({
      ...prev,
      endpoints: prev.endpoints.map(e =>
        e.id === endpointId
          ? {
              ...e,
              responses: e.responses.map((r, i) =>
                i === index
                  ? {
                      ...r,
                      content: ref
                        ? { [mediaType]: { schema: { $ref: ref } } }
                        : { [mediaType]: { schema: { type: 'object' } } },
                    }
                  : r
              ),
            }
          : e
      ),
    }))
  }, [])

  const removeResponse = useCallback((endpointId: string, index: number) => {
    setSpec(prev => ({
      ...prev,
      endpoints: prev.endpoints.map(e =>
        e.id === endpointId
          ? { ...e, responses: e.responses.filter((_, i) => i !== index) }
          : e
      ),
    }))
  }, [])

  const addSchema = useCallback(() => {
    const schema: Schema = { id: uid(), name: '', description: '', properties: [] }
    setSpec(prev => ({ ...prev, schemas: [schema, ...prev.schemas] }))
    setSelectedSchemaId(schema.id)
  }, [])

  const updateSchema = useCallback((id: string, field: string, value: string) => {
    setSpec(prev => ({
      ...prev,
      schemas: prev.schemas.map(s => s.id === id ? { ...s, [field]: value } : s),
    }))
  }, [])

  const removeSchema = useCallback((id: string) => {
    setSpec(prev => ({ ...prev, schemas: prev.schemas.filter(s => s.id !== id) }))
    if (selectedSchemaId === id) setSelectedSchemaId(null)
  }, [selectedSchemaId])

  const addSchemaProperty = useCallback((schemaId: string) => {
    const prop: SchemaProperty = { id: uid(), name: '', type: 'string', description: '', required: false }
    setSpec(prev => ({
      ...prev,
      schemas: prev.schemas.map(s =>
        s.id === schemaId ? { ...s, properties: [prop, ...s.properties] } : s
      ),
    }))
  }, [])

  const updateSchemaProperty = useCallback((schemaId: string, propId: string, field: string, value: unknown) => {
    setSpec(prev => ({
      ...prev,
      schemas: prev.schemas.map(s =>
        s.id === schemaId
          ? { ...s, properties: s.properties.map(p => p.id === propId ? { ...p, [field]: value } : p) }
          : s
      ),
    }))
  }, [])

  const removeSchemaProperty = useCallback((schemaId: string, propId: string) => {
    setSpec(prev => ({
      ...prev,
      schemas: prev.schemas.map(s =>
        s.id === schemaId
          ? { ...s, properties: s.properties.filter(p => p.id !== propId) }
          : s
      ),
    }))
  }, [])

  const addReusableResponse = useCallback(() => {
    const res: ReusableResponse = { id: uid(), name: '', statusCode: '200', description: '' }
    setSpec(prev => ({ ...prev, responses: [res, ...prev.responses] }))
    setSelectedReusableResponseId(res.id)
  }, [])

  const updateReusableResponse = useCallback((id: string, field: string, value: string) => {
    setSpec(prev => ({
      ...prev,
      responses: prev.responses.map(r => r.id === id ? { ...r, [field]: value } : r),
    }))
  }, [])

  const removeReusableResponse = useCallback((id: string) => {
    setSpec(prev => ({ ...prev, responses: prev.responses.filter(r => r.id !== id) }))
    if (selectedReusableResponseId === id) setSelectedReusableResponseId(null)
  }, [selectedReusableResponseId])

  const addReusableParameter = useCallback(() => {
    const param: ReusableParameter = { id: uid(), name: '', in: 'query', description: '', required: false, type: 'string' }
    setSpec(prev => ({ ...prev, parameters: [param, ...prev.parameters] }))
    setSelectedReusableParameterId(param.id)
  }, [])

  const updateReusableParameter = useCallback((id: string, field: string, value: unknown) => {
    setSpec(prev => ({
      ...prev,
      parameters: prev.parameters.map(p => p.id === id ? { ...p, [field]: value } : p),
    }))
  }, [])

  const removeReusableParameter = useCallback((id: string) => {
    setSpec(prev => ({ ...prev, parameters: prev.parameters.filter(p => p.id !== id) }))
    if (selectedReusableParameterId === id) setSelectedReusableParameterId(null)
  }, [selectedReusableParameterId])

  const addReusableRequestBody = useCallback(() => {
    const body: ReusableRequestBody = { id: uid(), name: '', description: '', required: false, content: {} }
    setSpec(prev => ({ ...prev, requestBodies: [body, ...prev.requestBodies] }))
    setSelectedReusableRequestBodyId(body.id)
  }, [])

  const updateReusableRequestBody = useCallback((id: string, field: string, value: unknown) => {
    setSpec(prev => ({
      ...prev,
      requestBodies: prev.requestBodies.map(b => b.id === id ? { ...b, [field]: value } : b),
    }))
  }, [])

  const removeReusableRequestBody = useCallback((id: string) => {
    setSpec(prev => ({ ...prev, requestBodies: prev.requestBodies.filter(b => b.id !== id) }))
    if (selectedReusableRequestBodyId === id) setSelectedReusableRequestBodyId(null)
  }, [selectedReusableRequestBodyId])

  const importSpec = useCallback((yamlContent: string) => {
    const parsed = parseYamlToSpec(yamlContent)
    setSpec(parsed)
  }, [])

  return {
    spec,
    activeSection,
    setActiveSection,
    selectedEndpointId,
    setSelectedEndpointId,
    selectedSchemaId,
    setSelectedSchemaId,
    selectedReusableResponseId,
    setSelectedReusableResponseId,
    selectedReusableParameterId,
    setSelectedReusableParameterId,
    selectedReusableRequestBodyId,
    setSelectedReusableRequestBodyId,
    updateInfo,
    updateContact,
    updateLicense,
    addServer,
    updateServer,
    removeServer,
    addSecurityScheme,
    updateSecurityScheme,
    removeSecurityScheme,
    addTag,
    updateTag,
    removeTag,
    addEndpoint,
    updateEndpoint,
    removeEndpoint,
    addParameter,
    updateParameter,
    removeParameter,
    addResponse,
    updateResponse,
    updateResponseContent,
    removeResponse,
    addSchema,
    updateSchema,
    removeSchema,
    addSchemaProperty,
    updateSchemaProperty,
    removeSchemaProperty,
    addReusableResponse,
    updateReusableResponse,
    removeReusableResponse,
    addReusableParameter,
    updateReusableParameter,
    removeReusableParameter,
    addReusableRequestBody,
    updateReusableRequestBody,
    removeReusableRequestBody,
    importSpec,
  }
}
