import { useSpecEditor } from './hooks/useSpecEditor'
import { Sidebar } from './components/Sidebar'
import { YamlPreview } from './components/YamlPreview'
import { ConfirmProvider } from './components/ConfirmContext'
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

export default function App() {
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
        <Sidebar
          spec={spec}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          selectedEndpointId={selectedEndpointId}
          onSelectEndpoint={setSelectedEndpointId}
          selectedSchemaId={selectedSchemaId}
          onSelectSchema={setSelectedSchemaId}
          selectedReusableResponseId={selectedReusableResponseId}
          onSelectReusableResponse={setSelectedReusableResponseId}
          selectedReusableParameterId={selectedReusableParameterId}
          onSelectReusableParameter={setSelectedReusableParameterId}
          selectedReusableRequestBodyId={selectedReusableRequestBodyId}
          onSelectReusableRequestBody={setSelectedReusableRequestBodyId}
        />
        <div className="flex-1 overflow-y-auto">
          {renderPage()}
        </div>
        <div className="w-[420px] flex-shrink-0 hidden lg:block border-l" style={{ borderColor: 'var(--border-primary)' }}>
          <YamlPreview spec={spec} onImport={importSpec} />
        </div>
      </div>
    </ConfirmProvider>
  )
}
