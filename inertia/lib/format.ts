const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const dateTime = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
const date = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' })

export function formatCurrency(value: number) {
  return currency.format(Number.isFinite(value) ? value : 0)
}

export function formatDateTime(value: string | null | undefined) {
  if (!value) return '—'
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? '—' : dateTime.format(parsed)
}

export function formatDate(value: string | null | undefined) {
  if (!value) return '—'
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? '—' : date.format(parsed)
}

export function formatQuantity(value: number, unit: string) {
  const normalized = Number(value)
  const text = Number.isInteger(normalized) ? String(normalized) : normalized.toFixed(2)
  return `${text} ${unit}`
}
