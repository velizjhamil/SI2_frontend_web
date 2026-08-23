/**
 * Card — contenedor base CoopIA.
 *
 * Props:
 *   as:        elemento HTML ('div' por defecto)
 *   className: clases adicionales
 *   children:  contenido
 */
export default function Card({ as: Tag = 'div', className = '', children, ...rest }) {
  return (
    <Tag
      className={`rounded-2xl bg-white shadow-card transition-shadow hover:shadow-card-hover ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
}
