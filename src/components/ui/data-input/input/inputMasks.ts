const onlyDigits = (value: string) => value.replace(/\D/g, "");

function limit(value: string, size: number) {
  return value.slice(0, size);
}

export function maskInteger(value: string) {
  return onlyDigits(value);
}

export function maskDecimal(value: string) {
  const normalized = value.replace(/[^\d,.]/g, "").replace(/,/g, ".");
  const [integer = "", ...decimalParts] = normalized.split(".");
  const decimal = decimalParts.join("").slice(0, 2);

  return decimalParts.length > 0 ? `${onlyDigits(integer)}.${onlyDigits(decimal)}` : onlyDigits(integer);
}

export function maskMoney(value: string) {
  const digits = onlyDigits(value);
  const cents = Number(digits || "0") / 100;

  return cents.toLocaleString("pt-BR", {
    currency: "BRL",
    minimumFractionDigits: 2,
    style: "currency"
  });
}

export function maskPhone(value: string) {
  const digits = limit(onlyDigits(value), 11);

  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function maskCpf(value: string) {
  const digits = limit(onlyDigits(value), 11);

  return digits
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

export function maskCnpj(value: string) {
  const digits = limit(onlyDigits(value), 14);

  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

export function maskCpfCnpj(value: string) {
  const digits = onlyDigits(value);

  return digits.length > 11 ? maskCnpj(digits) : maskCpf(digits);
}

export function maskCep(value: string) {
  const digits = limit(onlyDigits(value), 8);

  return digits.replace(/^(\d{5})(\d)/, "$1-$2");
}

export function maskDate(value: string) {
  const digits = limit(onlyDigits(value), 8);

  return digits.replace(/^(\d{2})(\d)/, "$1/$2").replace(/^(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");
}

export function maskTime(value: string) {
  const digits = limit(onlyDigits(value), 4);

  return digits.replace(/^(\d{2})(\d)/, "$1:$2");
}

export function maskDateTime(value: string) {
  const digits = limit(onlyDigits(value), 12);
  const date = maskDate(digits.slice(0, 8));
  const time = maskTime(digits.slice(8));

  return time ? `${date} ${time}` : date;
}

export function unmaskDigits(value: string) {
  return onlyDigits(value);
}