export const decodeHTML = (s: string) => {
  const doc = new DOMParser().parseFromString(s, 'text/html')
  return doc.documentElement.textContent
}
