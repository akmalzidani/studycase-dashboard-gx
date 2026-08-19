export const formatSpeed = (speed: number) => `${speed} Mbps`;

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

export const formatCurrencyInput = (amount: number) =>
  new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(amount);
