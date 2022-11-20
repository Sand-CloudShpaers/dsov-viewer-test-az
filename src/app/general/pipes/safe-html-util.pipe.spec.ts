import { SafeHtmlUtilPipe } from './safe-html-util.pipe';
import { DomSanitizer } from '@angular/platform-browser';
import { TestBed } from '@angular/core/testing';

describe('SafeHtmlUtilPipe', () => {
  let sanitizer: DomSanitizer;

  beforeEach(() => {
    sanitizer = TestBed.inject(DomSanitizer);
  });

  it('should transfom string to SafeHtml', () => {
    const pipe = new SafeHtmlUtilPipe(sanitizer);
    const html = '<div>Inhoud</div>';
    const result = pipe.transform(html);

    const expected = sanitizer.bypassSecurityTrustHtml(html);

    expect(result).toEqual(expected);
  });
});
