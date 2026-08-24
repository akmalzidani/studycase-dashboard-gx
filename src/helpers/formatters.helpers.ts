export const formatSpeed = (speed: number) => `${speed} Mbps`;

export const getWhatsAppUrl = (phoneNumber: string) => {
  const digits = phoneNumber.replace(/\D/g, "");
  const internationalNumber = digits.startsWith("0")
    ? `62${digits.slice(1)}`
    : digits.startsWith("62")
      ? digits
      : `62${digits}`;

  return `https://wa.me/${internationalNumber}`;
};

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

export const formatCurrencyInput = (amount: number) =>
  new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(amount);
