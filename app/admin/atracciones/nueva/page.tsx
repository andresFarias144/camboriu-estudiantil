import { AttractionForm } from '../../../../components/admin/AttractionForm'

export default function NewAttractionPage() {
  return (
    <div>
      <div className="mb-7">
        <h1 className="text-xl sm:text-2xl font-semibold">Nueva atracción</h1>
        <p className="text-sm text-white/45 mt-1">
          Cargá los datos de la nueva atracción. Los campos en español son obligatorios.
        </p>
      </div>
      <AttractionForm />
    </div>
  )
}
