import { ClientForm } from '../../../../components/admin/ClientForm'

export default function NewClientPage() {
  return (
    <div>
      <div className="mb-7">
        <h1 className="text-xl sm:text-2xl font-semibold">Nueva agencia</h1>
        <p className="text-sm text-white/45 mt-1">
          Cargá los datos de la nueva agencia de turismo estudiantil.
        </p>
      </div>
      <ClientForm />
    </div>
  )
}
