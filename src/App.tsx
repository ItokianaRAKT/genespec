import { useSpecEditor } from './hooks/useSpecEditor'
import { Sidebar } from './components/Sidebar'
import { YamlPreview } from './components/YamlPreview'
import { ConfirmProvider } from './components/ConfirmContext'
import type { SidebarSection } from './models/openapi'
import { OverviewPage } from './pages/OverviewPage'
import { InfoPage } from './pages/InfoPage'
import { ServersPage } from './pages/ServersPage'
import { SecurityPage } from './pages/SecurityPage'
import { TagsPage } from './pages/TagsPage'
import { EndpointsPage } from './pages/EndpointsPage'
import { SchemasPage } from './pages/SchemasPage'
import { ReusableResponsesPage } from './pages/ReusableResponsesPage'
import { ReusableParametersPage } from './pages/ReusableParametersPage'
import { ReusableRequestBodiesPage } from './pages/ReusableRequestBodiesPage'

import { useState } from 'react'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const {
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
  } = useSpecEditor()

  const handleSectionChange = (section: SidebarSection) => {
    setActiveSection(section)
    setSidebarOpen(false)
  }

  const renderPage = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewPage spec={spec} />
      case 'info':
        return (
          <InfoPage
            info={spec.info}
            onUpdate={updateInfo}
            onContactUpdate={updateContact}
            onLicenseUpdate={updateLicense}
          />
        )
      case 'servers':
        return (
          <ServersPage
            servers={spec.servers}
            onAdd={addServer}
            onUpdate={updateServer}
            onRemove={removeServer}
          />
        )
      case 'security':
        return (
          <SecurityPage
            security={spec.security}
            onAdd={addSecurityScheme}
            onUpdate={updateSecurityScheme}
            onRemove={removeSecurityScheme}
          />
        )
      case 'tags':
        return (
          <TagsPage
            tags={spec.tags}
            onAdd={addTag}
            onUpdate={updateTag}
            onRemove={removeTag}
          />
        )
      case 'endpoints':
        return (
          <EndpointsPage
            endpoints={spec.endpoints}
            selectedEndpointId={selectedEndpointId}
            onSelectEndpoint={setSelectedEndpointId}
            onAdd={addEndpoint}
            onUpdate={updateEndpoint}
            onRemove={removeEndpoint}
            onAddParameter={addParameter}
            onUpdateParameter={updateParameter}
            onRemoveParameter={removeParameter}
            onAddResponse={addResponse}
            onUpdateResponse={updateResponse}
            onUpdateResponseContent={updateResponseContent}
            onRemoveResponse={removeResponse}
          />
        )
      case 'schemas':
        return (
          <SchemasPage
            schemas={spec.schemas}
            selectedSchemaId={selectedSchemaId}
            onSelectSchema={setSelectedSchemaId}
            onAdd={addSchema}
            onUpdate={updateSchema}
            onRemove={removeSchema}
            onAddProperty={addSchemaProperty}
            onUpdateProperty={updateSchemaProperty}
            onRemoveProperty={removeSchemaProperty}
          />
        )
      case 'responses':
        return (
          <ReusableResponsesPage
            responses={spec.responses}
            selectedId={selectedReusableResponseId}
            onSelect={setSelectedReusableResponseId}
            onAdd={addReusableResponse}
            onUpdate={updateReusableResponse}
            onRemove={removeReusableResponse}
          />
        )
      case 'parameters':
        return (
          <ReusableParametersPage
            parameters={spec.parameters}
            selectedId={selectedReusableParameterId}
            onSelect={setSelectedReusableParameterId}
            onAdd={addReusableParameter}
            onUpdate={updateReusableParameter}
            onRemove={removeReusableParameter}
          />
        )
      case 'requestBodies':
        return (
          <ReusableRequestBodiesPage
            requestBodies={spec.requestBodies}
            selectedId={selectedReusableRequestBodyId}
            onSelect={setSelectedReusableRequestBodyId}
            onAdd={addReusableRequestBody}
            onUpdate={updateReusableRequestBody}
            onRemove={removeReusableRequestBody}
          />
        )
    }
  }

  return (
    <ConfirmProvider>
      <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--bg-app)' }}>
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg"
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)', color: 'var(--text-heading)' }}
          aria-label="Open menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div
          className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <Sidebar
            spec={spec}
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
            selectedEndpointId={selectedEndpointId}
            onSelectEndpoint={(id) => { setSelectedEndpointId(id); setSidebarOpen(false) }}
            selectedSchemaId={selectedSchemaId}
            onSelectSchema={(id) => { setSelectedSchemaId(id); setSidebarOpen(false) }}
            selectedReusableResponseId={selectedReusableResponseId}
            onSelectReusableResponse={(id) => { setSelectedReusableResponseId(id); setSidebarOpen(false) }}
            selectedReusableParameterId={selectedReusableParameterId}
            onSelectReusableParameter={(id) => { setSelectedReusableParameterId(id); setSidebarOpen(false) }}
            selectedReusableRequestBodyId={selectedReusableRequestBodyId}
            onSelectReusableRequestBody={(id) => { setSelectedReusableRequestBodyId(id); setSidebarOpen(false) }}
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {renderPage()}
        </div>
        <div className="w-[420px] flex-shrink-0 hidden lg:block border-l h-full" style={{ borderColor: 'var(--border-primary)' }}>
          <YamlPreview spec={spec} onImport={importSpec} />
        </div>
      </div>
    </ConfirmProvider>
  )
}
