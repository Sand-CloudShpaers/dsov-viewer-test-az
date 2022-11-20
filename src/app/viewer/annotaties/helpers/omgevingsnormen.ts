import { OmgevingsnormenVM, OmgevingsnormwaardeVM } from '~viewer/normen/types/omgevingsnormenVM';
import { uniqueObjects } from '~general/utils/array.utils';
import { Omgevingswaarde } from '~ozon-model/omgevingswaarde';
import { NormType } from '~viewer/annotaties/types/annotaties-enums';
import { Omgevingsnorm } from '~ozon-model/omgevingsnorm';
import { sortByKey } from '~general/utils/group-by.utils';
import { OntwerpOmgevingsnorm } from '~ozon-model/ontwerpOmgevingsnorm';
import { OntwerpOmgevingswaarde } from '~ozon-model/ontwerpOmgevingswaarde';
import { NormVM } from '~viewer/annotaties/types/norm';
import { getDescription } from '~viewer/annotaties/helpers/normwaarden';
import { Selection } from '~store/common/selection/selection.model';
import { Normwaarde } from '~ozon-model/normwaarde';

export function getOmgevingsnormenArray(
  vastgesteld: (Omgevingsnorm | Omgevingswaarde)[],
  ontwerp: (OntwerpOmgevingsnorm | OntwerpOmgevingswaarde)[],
  normType: NormType,
  selections: Selection[],
  ozonLocaties: string[] = []
): OmgevingsnormenVM[] {
  let mergedList: NormVM[] = [];
  [vastgesteld, ontwerp].forEach(item => {
    mergedList = mergedList.concat(
      item.map(norm => ({
        identificatie: norm.identificatie,
        naam: norm.naam,
        normwaarde: norm.normwaarde,
        type: {
          ...norm.type,
        },
        groep: {
          ...norm.groep,
        },
        eenheid: norm.eenheid,
        isOntwerp: 'ontwerpDocumentComponenten' in norm,
      }))
    );
  });

  // Genereer collectie op basis van eigenschappen
  const collections: OmgevingsnormenVM[] = uniqueObjects(
    mergedList?.map(item => item.type),
    'code'
  ).map(item => ({ identificatie: item.code, naam: item.waarde, normen: [] }));

  const output: OmgevingsnormenVM[] = collections.map((container: OmgevingsnormenVM) => {
    const relatedItems: NormVM[] = mergedList.filter(item => item.type.code === container.identificatie);
    return {
      identificatie: container.identificatie,
      naam: container.naam,
      normen: relatedItems.map((norm: NormVM) => ({
        identificatie: norm.identificatie,
        naam: norm.naam,
        eenheid: norm.eenheid?.length > 0 ? norm.eenheid[0].waarde : '',
        type: norm.type.waarde,
        normType,
        normwaarden: getNormwaarden(norm, selections, ozonLocaties),
      })),
    };
  });
  return sortByKey<OmgevingsnormenVM>(output, 'naam');
}

const getNormwaarden = (norm: NormVM, selections: Selection[], ozonLocaties: string[]): OmgevingsnormwaardeVM[] => {
  const isKwantitatief = norm.normwaarde.length ? !!norm.normwaarde[0].kwantitatieveWaarde : false;
  // Alleen sorteren op basis van kwantitatieve waarde
  const normwaarden = isKwantitatief
    ? [...norm.normwaarde].sort((a, b) => a.kwantitatieveWaarde - b.kwantitatieveWaarde)
    : norm.normwaarde;
  return normwaarden
    .filter(normwaarde => {
      if ((normwaarde as Normwaarde)._embedded?.locaties && ozonLocaties.length) {
        // Alleen normwaarden tonen die een locatie gemeen hebben met een ozon zoek locaties
        const locaties = (normwaarde as Normwaarde)._embedded.locaties;
        const intersection = locaties.map(l => l.identificatie).filter(l => ozonLocaties.includes(l));
        return !!intersection.length;
      }
      return true;
    })
    .map(normwaarde => {
      const identificatie = normwaarde.identificatie;
      const selection = selections?.find(x => x.id === identificatie);
      return {
        identificatie,
        naam: getDescription(normwaarde, norm),
        representationLabel: getDescription(normwaarde, norm),
        isSelected: !!selection,
        symboolcode: selection?.symboolcode,
        isOntwerp: norm.isOntwerp,
      };
    });
};
