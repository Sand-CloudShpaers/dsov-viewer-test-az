import { HttpHeaders } from '@angular/common/http';

export const NoCacheHeaders = new HttpHeaders({
  'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
  Pragma: 'no-cache',
  Expires: '0',
});
