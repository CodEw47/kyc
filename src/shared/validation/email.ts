import { z } from 'zod'

const regexEmail =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const emailZod = z
  .string({ required_error: 'E-mail é obrigatório' })
  .trim()
  .min(1, 'Email é obrigatório')
  .regex(regexEmail, 'Email inválido')
  .email('Email inválido')
