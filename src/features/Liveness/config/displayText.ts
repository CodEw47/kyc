import { FaceLivenessDetectorProps } from '@aws-amplify/ui-react-liveness'

export const displayText: FaceLivenessDetectorProps['displayText'] = {
  timeoutHeaderText: 'Tempo esgotado',
  timeoutMessageText:
    'O rosto não foi posicionado corretamente dentro do espaço oval. Tente novamente e preencha o rosto completamente no espaço oval.',
  faceDistanceHeaderText: 'Movimento para frente detectado',
  faceDistanceMessageText: 'Evite se aproximar enquanto conectamos.',
  multipleFacesHeaderText: 'Múltiplas faces detectadas',
  multipleFacesMessageText: 'Certifique que apenas um rosto esteja presente na frente da câmera ao conectar.',
  landscapeHeaderText: 'Orientação paisagem não suportada',
  landscapeMessageText: 'Gire o seu dispositivo para orientação retrato (vertical)',
  portraitMessageText:
    'Certifique que seu dispositivo permaneça em orientação retrato (vertical) até a conclusão da análise.',
  cameraNotFoundHeadingText: 'Câmera não está acessível',
  cameraNotFoundMessageText:
    'Nao conseguimos acessar sua camera. Libere a permissao no navegador e feche outros apps que possam estar usando a camera.',
  cameraMinSpecificationsHeadingText: 'A câmera não tem os requisitos necessários',
  cameraMinSpecificationsMessageText:
    'A camera deste dispositivo nao atende aos requisitos minimos para a biometria facial. Tente usar outro aparelho.',
  hintMoveFaceFrontOfCameraText: 'Mova seu rosto para frente da câmera',
  hintTooManyFacesText: 'Certifique que apenas um rosto esteja na câmera',
  hintCanNotIdentifyText: 'Mova o seu rosto para próximo da câmera',
  hintFaceDetectedText: 'Rosto detectado. Aguarde.',
  hintTooCloseText: 'Afaste-se',
  hintTooFarText: 'Aproxime-se',
  hintConnectingText: 'Preparando a camera...',
  hintVerifyingText: 'Validando sua biometria...',
  hintIlluminationTooBrightText: 'Mova-se para um lugar um pouco escuro',
  hintIlluminationTooDarkText: 'Mova-se para um lugar com mais luz',
  hintIlluminationNormalText: 'Condição de iluminação normal',
  hintHoldFaceForFreshnessText: 'Mantenha a posição e aguarde.',
  tryAgainText: 'Tentar novamente'
}
