/**
 * Stub SSR para @mediapipe/face_detection.
 * O pacote real é um script UMD (sem exports ESM) que só funciona no browser.
 * @tensorflow-models/face-detection importa { FaceDetection } dele —
 * este stub satisfaz a análise estática do Turbopack/webpack no servidor.
 * Em runtime no browser, o AWS Amplify Liveness carrega o MediaPipe via CDN/WASM.
 */
export class FaceDetection {
  constructor() {}
  setOptions() {}
  onResults() {}
  send() {}
  close() {}
  reset() {}
  initialize() { return Promise.resolve() }
}
