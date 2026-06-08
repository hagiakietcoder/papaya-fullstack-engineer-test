const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

export function formatCount(value: number, unit: string): string {
  if (value === -1) {
    return 'Unlimited';
  }

  return `${value.toLocaleString()} ${unit}${value === 1 ? '' : 's'}/year`;
}

export function formatPercentage(value: number): string {
  return `${value}%`;
}

export function formatDays(value: number): string {
  if (value === 0) {
    return 'None';
  }

  return `${value} day${value === 1 ? '' : 's'}`;
}
