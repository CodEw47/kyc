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
  cameraNotFoundMessageText: 'Verifique as permissões de câmera antes de continuar',
  cameraMinSpecificationsHeadingText: 'A câmera não tem os requisitos necessários',
  cameraMinSpecificationsMessageText: 'A câmera deve suportar pelo menos a resolução 320x240 e 15 quadros por segundos',
  hintMoveFaceFrontOfCameraText: 'Mova seu rosto para frente da câmera',
  hintTooManyFacesText: 'Certifique que apenas um rosto esteja na câmera',
  hintCanNotIdentifyText: 'Mova o seu rosto para próximo da câmera',
  hintFaceDetectedText: 'Rosto detectado. Aguarde.',
  hintTooCloseText: 'Afaste-se',
  hintTooFarText: 'Aproxime-se',
  hintConnectingText: 'Conectando...',
  hintVerifyingText: 'Analisando..',
  hintIlluminationTooBrightText: 'Mova-se para um lugar um pouco escuro',
  hintIlluminationTooDarkText: 'Mova-se para um lugar com mais luz',
  hintIlluminationNormalText: 'Condição de iluminação normal',
  hintHoldFaceForFreshnessText: 'Mantenha a posição e aguarde.',
  tryAgainText: 'Tentar novamente'
}
