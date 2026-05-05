import { AttractionForm } from '../../../../components/admin/AttractionForm'

export default function NewAttractionPage() {
  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 600, margin: 0 }}>
          Nueva atracción
        </h1>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginTop: '4px' }}>
          Cargá los datos de la nueva atracción. Los campos en español son obligatorios.
        </p>
      </div>
      <AttractionForm />
    </div>
  )
}
