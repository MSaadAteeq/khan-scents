export function formatPrice(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-PK')}`;
}

export function genderLabel(gender: string): string {
  if (gender === 'him') return 'For Him';
  if (gender === 'her') return 'For Her';
  return 'Unisex';
}
