export function getSlugFromString(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, '-')
}
