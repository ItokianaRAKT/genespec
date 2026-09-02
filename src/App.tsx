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

export default function App() {
  const {
    spec,
    activeSection,
    setActiveSection,
    selectedEndpointId,
    setSelectedEndpointId,
    selectedSchemaId,
    setSelectedSchemaId,
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
