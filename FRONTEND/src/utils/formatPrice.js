export function formatPrice(num) {
  if (num === undefined || num === null) return "";
  return Number(num).toLocaleString("es-AR");
}