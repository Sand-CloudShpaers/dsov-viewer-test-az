import { createSelector, MemoizedSelector } from '@ngrx/store';
import { selectDocumentById } from '~viewer/documenten/+state/documenten/documenten.selectors';
import { DocumentSubPagePath } from '~viewer/documenten/types/document-pages';
import { InhoudLinkVM, InhoudVM } from '~viewer/documenten/types/documenten.model';
import { PlanHeeftOnderdelenInner } from '~ihr-model/planHeeftOnderdelenInner';
import { State } from '..';

export const selectInhoud = (documentId: string): MemoizedSelector<State, InhoudVM> =>
  createSelector(selectDocumentById(documentId), (entity): InhoudVM => {
    const document = entity?.data?.ihr;
    return {
      onderdelen: document
        ? mapHeeftOnderdelen(document.heeftOnderdelen.filter(onderdeel => !onderdeel.heeftObjectgerichteTeksten.length))
        : [],
      verwijzingNaarVaststellingsbesluit: document?.verwijzingNaarVaststellingsbesluit,
      verwijzingNaarGml: document?.verwijzingNaarGml,
      illustraties: document?.illustraties.map(item => ({ href: item.href, type: item.type })),
    };
  });

export const selectInhoudBySubpage = (
  documentId: string,
  subpage: DocumentSubPagePath
): MemoizedSelector<State, PlanHeeftOnderdelenInner> =>
  createSelector(
    selectDocumentById(documentId),
    (entity): PlanHeeftOnderdelenInner =>
      entity?.data?.ihr?.heeftOnderdelen.find(el =>
        el.heeftObjectgerichteTeksten?.some(tekst => tekst.type.replace(/\s/g, '') === subpage)
      )
  );

const mapHeeftOnderdelen = (onderdelen: PlanHeeftOnderdelenInner[]): InhoudLinkVM[] => {
  const output: InhoudLinkVM[] = [];
  onderdelen.forEach(onderdeel => {
    onderdeel.externeReferenties.forEach(href => {
      output.push({ href, type: onderdeel.type });
    });
  });
  return output;
};
