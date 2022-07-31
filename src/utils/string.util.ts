export const decodeHTML = (s: string) => {
  const doc = new DOMParser().parseFromString(s, 'text/html')
  console.log(s, doc.documentElement.textContent)
  return doc.documentElement.textContent
}
