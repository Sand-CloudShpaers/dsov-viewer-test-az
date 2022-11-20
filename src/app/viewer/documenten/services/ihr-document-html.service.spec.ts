import { IhrDocumentHtmlService } from '~viewer/documenten/services/ihr-document-html.service';
import { ihrDocumentElementResponse } from '~viewer/documenten/+state/document-element-link/document-element.mock';
import { ihrDocumentTekstCollectieResponse } from '~viewer/documenten/+state/document-teksten-planobject/document-teksten-planobject-effects.spec';

describe('IhrDocumentHtmlService', () => {
  it('should return html from Ihr Tekst', () => {
    expect(IhrDocumentHtmlService.getHtmlFromTekst(ihrDocumentElementResponse)).toEqual(
      '<h3>Groeten uit Lochem</h3><h4>Hallo</h4>met inhoud<h5></h5>nog meer inhoud'
    );
  });

  it('should return html from Ihr TekstCollectie', () => {
    expect(IhrDocumentHtmlService.getHtmlFromTekstCollectie(ihrDocumentTekstCollectieResponse)).toEqual(
      '<h3>artikel titel</h3><div>Artikel inhoud</div>'
    );
  });
});
