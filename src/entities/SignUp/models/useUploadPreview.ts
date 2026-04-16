'use client'

import { create } from 'zustand'
import { DocumentType, UploadPreview } from './UploadPreview'
import { nanoid } from 'nanoid'
import { createJSONStorage, persist } from 'zustand/middleware'

interface PhotoPreviewState {
  documents: UploadPreview[]
  documentType: DocumentType | null
  add: (document: Omit<UploadPreview, 'id'>) => void
  update: (id: string, imageUrl: string) => void
  setDocumentType: (type: DocumentType) => void
  reset: () => void
}

export const useUploadPreview = create<PhotoPreviewState>()(
  persist(
    (set) => ({
      reset: () => set(() => ({ documentType: null, documents: [] })),
      documents: [],
      documentType: null,
      setDocumentType: (document) => set(() => ({ documentType: document })),
      add: (document) => set((state) => ({ documents: [...state.documents, { ...document, id: nanoid() }] })),
      update: (id, imageUrl) =>
        set((state) => {
          return {
            documents: state.documents.map((item) => {
              if (item.id === id) {
                return {
                  ...item,
                  imageUrl
                }
              }
              return item
            })
          }
        })
    }),
    {
      name: 'upload-preview-storage',
      storage: createJSONStorage(() => sessionStorage)
    }
  )
)
