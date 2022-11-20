export function scrollToElement(id: string, document: Document): void {
  const elm = document.getElementById(id);
  if (elm) {
    elm.scrollIntoView({ behavior: 'smooth' });
  }
}
