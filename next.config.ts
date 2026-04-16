import type { NextConfig } from 'next'
import path from 'path'

// Stub com exports ESM para satisfazer Turbopack/webpack no servidor.
// O pacote real (@mediapipe/face_detection) é um script UMD sem exports
// e só funciona no browser (carregado via CDN pelo AWS Amplify Liveness).
const mediapipeStub = path.resolve('./src/mocks/mediapipe-face-detection.js')

const nextConfig: NextConfig = {
  reactStrictMode: false,
  transpilePackages: [
    '@aws-amplify/ui-react-liveness',
    '@aws-amplify/ui-react'
  ],
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'camera=(self), microphone=()'
          }
        ]
      }
    ]
  },
  experimental: {
    turbo: {
      resolveAlias: {
        '@mediapipe/face_detection': './src/mocks/mediapipe-face-detection.js'
      }
    }
  },
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@mediapipe/face_detection': mediapipeStub
    }
    return config
  }
}

export default nextConfig

