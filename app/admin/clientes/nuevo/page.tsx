import { ClientForm } from '../../../../components/admin/ClientForm'

export default function NewClientPage() {
  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 600, margin: 0 }}>Nueva agencia</h1>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginTop: '4px' }}>
          Cargá los datos de la nueva agencia de turismo estudiantil.
        </p>
      </div>
      <ClientForm />
    </div>
  )
}
