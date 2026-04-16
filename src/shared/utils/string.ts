export function onlyNumbers(value: string) {
  return value.replaceAll(/[^0-9]/g, '')
}

export function numberToCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 2
  }).format(value)
}
