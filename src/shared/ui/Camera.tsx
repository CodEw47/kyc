'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from './Button'
import { Spinner } from './Spinner'
import { cn } from '../lib/utils'

interface CameraProps {
  onSuccess: (imageUrl: string) => void
  fullscreen?: boolean
}

export function Camera({ onSuccess, fullscreen }: CameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isCapturing, setIsCapturing] = useState(false)

  async function start() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: 'environment'
        }
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.log('Ocorreu um erro ao acessar camêra.', error)
    }
  }

  useEffect(() => {
    start()
  }, [])

  function delay(delayInms: number) {
    return new Promise((resolve) => setTimeout(resolve, delayInms))
  }

  async function captureImage() {
    if (!videoRef.current && !canvasRef.current) return
    setIsCapturing(true)
    await delay(500)
    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (context && video?.videoWidth && video?.videoHeight && canvas) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      const imageUrl = canvas.toDataURL('image/jpeg')
      onSuccess(imageUrl)
    }
    setIsCapturing(false)
  }

  return (
    <div className={cn('flex flex-col flex-1', fullscreen && 'h-[100dvh]')}>
      <video
        playsInline
        className={cn(
          'border-4 flex-2 rounded-4 object-cover border-primary-400 scale-x-[-1]',
          fullscreen && 'h-[100dvh]'
        )}
        ref={videoRef}
        autoPlay
        muted
      />
      {isCapturing && (
        <div className="bg-black/15 flex items-center justify-center absolute top-0 right-0 left-0 bottom-0">
          <Spinner className="w-48 h-48" />
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
      <div className="flex-1 mt-7">
        <Button type="button" onClick={captureImage}>
          Capturar imagem
        </Button>
      </div>
    </div>
  )
}
