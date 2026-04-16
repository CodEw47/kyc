import { z } from 'zod'
import { onlyNumbers } from '../utils/string'

export const currencyZod = z.string().transform((value, ctx) => {
  const amount = parseInt(onlyNumbers(value)) / 100
  if (amount <= 0) {
    ctx.addIssue({
      message: 'Preço é obrigatório',
      code: 'custom'
    })
    return z.NEVER
  }
  return amount
})
