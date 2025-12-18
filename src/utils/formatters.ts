export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return "0€";

  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("es-ES").format(new Date(date));
}
