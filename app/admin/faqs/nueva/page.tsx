import { FAQForm } from '../../../../components/admin/FAQForm'

export default function NewFAQPage() {
  return (
    <div>
      <div className="mb-7">
        <h1 className="text-xl sm:text-2xl font-semibold">Nueva pregunta</h1>
        <p className="text-sm text-white/45 mt-1">
          Cargá una nueva pregunta frecuente para mostrar en el home.
        </p>
      </div>
      <FAQForm />
    </div>
  )
}
