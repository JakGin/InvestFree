export function formattedCurrency(number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number)
}

export function formattedPercent(number) {
  if (typeof number !== "number" || isNaN(number)) {
    return ""
  }
  let percentString = number.toFixed(2)
  percentString += "%"
  return percentString
}
