export function getLastPathSegment(url: string): string {
  let lastPathSegment = url.split('/').pop();
  lastPathSegment = lastPathSegment.includes('?') ? lastPathSegment.split('?')[0] : lastPathSegment;
  return lastPathSegment;
}

export function getQueryParamSeparator(url: string): '?' | '&' {
  return url.includes('?') ? '&' : '?';
}
