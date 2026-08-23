/**
 * FormField — wrapper de campo de formulario con label y mensaje de error.
 * Input — campo de texto CoopIA.
 * Textarea — área de texto CoopIA.
 *
 * Uso:
 *   <FormField id="ci" label="Cédula" required error={errors.ci}>
 *     <Input id="ci" value={form.ci} onChange={handleChange} hasError={!!errors.ci} />
 *   </FormField>
 */

export function FormField({ id, label, required, error, children }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-slate-700"
      >
        {label}
        {required && (
          <span className="ml-0.5 text-red-500" aria-hidden="true">*</span>
        )}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-xs text-red-600" role="alert">{error}</p>
      )}
    </div>
  )
}

const INPUT_BASE =
  'w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 ' +
  'placeholder-slate-400 outline-none transition duration-150 ' +
  'focus:ring-2 focus:ring-navy/30 focus:border-navy'

const INPUT_NORMAL = 'border-slate-200 bg-white hover:border-slate-300'
const INPUT_ERROR  = 'border-red-400 bg-red-50'

export function Input({ hasError = false, className = '', ...rest }) {
  return (
    <input
      className={`${INPUT_BASE} ${hasError ? INPUT_ERROR : INPUT_NORMAL} ${className}`}
      {...rest}
    />
  )
}

export function Textarea({ hasError = false, className = '', ...rest }) {
  return (
    <textarea
      className={`${INPUT_BASE} resize-none ${hasError ? INPUT_ERROR : INPUT_NORMAL} ${className}`}
      {...rest}
    />
  )
}
