'use client'

export function Logo() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/85 px-3 py-1.5 shadow-sm backdrop-blur">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-xs font-semibold text-white">
        K
      </span>
      <span className="text-sm font-semibold tracking-[0.08em] text-blue-900">KYC GATEWAY</span>
    </div>
  )
}
