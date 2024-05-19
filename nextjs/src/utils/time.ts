
export const format = (date: Date) => {
  const formatDate = new Date(+date - 8 * 3600 * 1000)
  const year = formatDate.getFullYear();
  const month = String(formatDate.getMonth() + 1).padStart(2, '0');
  const day = String(formatDate.getDate()).padStart(2, '0');
  const hours = String(formatDate.getHours()).padStart(2, '0');
  const minutes = String(formatDate.getMinutes()).padStart(2, '0');
  const seconds = String(formatDate.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}-${hours}:${minutes}:${seconds}`;
}