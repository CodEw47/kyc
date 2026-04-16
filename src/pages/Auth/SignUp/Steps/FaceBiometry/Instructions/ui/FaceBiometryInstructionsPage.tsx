import { AuthRoutes } from '@/shared/types/routes/AuthRoutes'
import { Link } from '@/shared/ui/Link'

export function FaceBiometryInstructionsPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-blue-950 via-blue-900 to-blue-800 p-5 text-white">
      <div className="pointer-events-none absolute -top-24 -left-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-blue-300/20 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100dvh-2.5rem)] w-full max-w-xl flex-col justify-between">
        <div>
          <div className="mb-8 mt-2 rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
            <span className="mb-3 inline-block rounded-full bg-cyan-300/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100">
              Biometria Facial
            </span>
            <h1 className="text-3xl font-semibold leading-tight">Prepare-se para a captura</h1>
            <p className="mt-2 text-blue-100">
              Em menos de 1 minuto voce conclui a validacao. Siga as orientacoes abaixo para evitar falhas.
            </p>
          </div>

          <ul className="list-none flex flex-col gap-4">
            <li className="flex items-center gap-4 rounded-2xl border border-blue-200/20 bg-white px-4 py-4 text-blue-950 shadow-lg shadow-blue-950/20">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1d4ed8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                  <path d="M9 18h6" />
                  <path d="M10 22h4" />
                </svg>
              </div>
              <p className="font-medium">Fique em um local bem iluminado e sem luz forte atras de voce.</p>
            </li>
            <li className="flex items-center gap-4 rounded-2xl border border-blue-200/20 bg-white px-4 py-4 text-blue-950 shadow-lg shadow-blue-950/20">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1d4ed8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                  <path d="M12 18h.01" />
                </svg>
              </div>
              <p className="font-medium">Segure o celular na altura dos olhos e olhe direto para a camera.</p>
            </li>
            <li className="flex items-center gap-4 rounded-2xl border border-blue-200/20 bg-white px-4 py-4 text-blue-950 shadow-lg shadow-blue-950/20">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1d4ed8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                  <line x1="2" x2="22" y1="2" y2="22" />
                </svg>
              </div>
              <p className="font-medium">Remova oculos escuros, boné e acessorios que escondam o rosto.</p>
            </li>
          </ul>
        </div>
        <Link
          href={AuthRoutes.FACE_BIOMETRY_LIVENESS}
          buttonProps={{
            className:
              'h-13 w-full rounded-xl border border-cyan-200/30 bg-gradient-to-r from-cyan-400 to-blue-500 text-base font-semibold text-white shadow-xl shadow-blue-950/40'
          }}
        >
          Iniciar biometria
        </Link>
      </div>
    </div>
  )
}
