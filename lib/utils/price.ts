export function formatPrice(amount: number, currency: string = "PKR") {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function discountPercent(price: number, salePrice: number) {
  return Math.round(((price - salePrice) / price) * 100);
}
