'use client'

import dynamic from 'next/dynamic'

// ssr: false impede que @mediapipe/face_detection seja avaliado no servidor,
// onde seus exports ESM não existem (o pacote usa apenas globals no browser).
const LivenessPage = dynamic(
  () =>
    import('@/pages/Auth/SignUp/Steps/FaceBiometry/Liveness/ui/LivenessPage').then(
      (m) => ({ default: m.LivenessPage })
    ),
  { ssr: false }
)

export default function Liveness() {
  return <LivenessPage />
}
