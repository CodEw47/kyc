const sign_root = '/auth/sign-up'

export enum AuthRoutes {
  KYC_ENTRY = '/kyc',

  DOCUMENT_IDENTITY_INSTRUCTIONS = `${sign_root}/step/document-identity/instructions`,
  DOCUMENT_IDENTITY_OPTIONS = `${sign_root}/step/document-identity/options`,

  FACE_BIOMETRY_INSTRUCTIONS = `${sign_root}/step/face-biometry/instructions`,
  FACE_BIOMETRY_LIVENESS = `${sign_root}/step/face-biometry/liveness`,
  FACE_BIOMETRY_FALLBACK = `${sign_root}/step/face-biometry/fallback`,

  DRIVERS_LICENSE_OPTIONS = `${sign_root}/step/drivers-license/options`,
  DRIVERS_LICENSE_INSTRUCTIONS = `${sign_root}/step/drivers-license/instructions`,
  DRIVERS_LICENSE_INSTRUCTIONS_PDF = `${sign_root}/step/drivers-license/instructions-pdf`,

  RESIDENCE_PROOF_OPTIONS = `${sign_root}/step/residence-proof/options`,
  RESIDENCE_PROOF_INSTRUCTIONS = `${sign_root}/step/residence-proof/instructions`,

  UPLOAD_PREVIEW = `${sign_root}/step/upload-preview`,
  UPLOAD_DOCUMENTS = `${sign_root}/step/upload-document-options`,

  CAMERA = `${sign_root}/step/camera`,
  PASSWORD_DEFINITION = `/auth/password-definition`,
  EDIT_FORM = `/auth/edit-email`,

  PREVIEW_ACCOUNT = '/preview-account'
}
