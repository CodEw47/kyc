import { z } from 'zod'
import { onlyNumbers } from '../utils/string'

export const zipcodeZod = z.string().transform((value, ctx) => {
  const zipcode = onlyNumbers(value)
  if (zipcode.length === 0) {
    ctx.addIssue({
      message: 'CEP é obrigatório',
      code: 'custom'
    })
    return z.NEVER
  }

  if (zipcode.length !== 8) {
    ctx.addIssue({
      message: 'CEP inválido',
      code: 'custom'
    })
    return z.NEVER
  }
  return zipcode
})
