import { z } from 'zod'
import { onlyNumbers } from '../utils/string'

export const phoneZod = z.string().transform((value, ctx) => {
  const phone = onlyNumbers(value)

  if (!(phone.length >= 10 && phone.length <= 11)) {
    ctx.addIssue({
      message: 'Número é obrigatório',
      code: 'custom'
    })
    return z.NEVER
  }

  if (phone.length === 11 && parseInt(phone.substring(2, 3)) != 9) {
    ctx.addIssue({
      message: 'Número inválido',
      code: 'custom'
    })
    return z.NEVER
  }

  for (let n = 0; n < 10; n++) {
    const temp = phone.substring(2)
    if (temp === new Array(9).join(n.toString()) || temp === new Array(10).join(n.toString())) {
      ctx.addIssue({
        message: 'Número inválido',
        code: 'custom'
      })
      return z.NEVER
    }
  }

  const DDD = [
    11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48,
    49, 51, 53, 54, 55, 61, 62, 63, 64, 65, 66, 67, 68, 69, 71, 73, 74, 75, 77, 79, 81, 82, 83, 84, 85, 86, 87, 88, 89,
    91, 92, 93, 94, 95, 96, 97, 98, 99
  ]

  if (DDD.indexOf(parseInt(phone.substring(0, 2))) === -1) {
    ctx.addIssue({
      message: 'DDD inserido é inválido',
      code: 'custom'
    })
    return z.NEVER
  }

  return phone
})
