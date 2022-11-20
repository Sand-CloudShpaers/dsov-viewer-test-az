import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({ name: 'safeHtmlUtil' })
export class SafeHtmlUtilPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) {}

  public transform(value: string): SafeHtml {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}
