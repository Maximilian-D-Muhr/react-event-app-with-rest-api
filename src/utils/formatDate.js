export function formatDate(value) {
  try {
    return new Date(value).toLocaleDateString();
  } catch {
    return value;
  }
}
