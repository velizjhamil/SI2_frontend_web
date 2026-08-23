import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-12"
      style={{
        background:
          'linear-gradient(135deg, #1a4731 0%, #1e3a5f 55%, #1a3050 100%)',
      }}
    >
      {/* Decoración de fondo — círculos difusos */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute -top-32 -left-32 h-96 w-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #4ade80, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #60a5fa, transparent 70%)' }}
        />
      </div>

      <div className="relative w-full max-w-md animate-slide-up">
        <Outlet />
      </div>
    </div>
  )
}
