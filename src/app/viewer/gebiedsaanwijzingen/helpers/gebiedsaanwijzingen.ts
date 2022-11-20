import { GebiedsaanwijzingenVM, GebiedsaanwijzingVM } from '~viewer/gebiedsaanwijzingen/types/gebiedsaanwijzingenVM';
import { uniqueObjects } from '~general/utils/array.utils';
import { sortByKey } from '~general/utils/group-by.utils';
import { GebiedsaanwijzingenEmbedded } from '~ozon-model/gebiedsaanwijzingenEmbedded';
import { OntwerpGebiedsaanwijzingenEmbedded } from '~ozon-model/ontwerpGebiedsaanwijzingenEmbedded';
import { Gebiedsaanwijzing } from '~ozon-model/gebiedsaanwijzing';
import { OntwerpGebiedsaanwijzing } from '~ozon-model/ontwerpGebiedsaanwijzing';
import { Selection } from '~store/common/selection/selection.model';

export function getGebiedsaanwijzingenVMArray(
  selections: Selection[],
  vastgesteld?: GebiedsaanwijzingenEmbedded,
  ontwerp?: OntwerpGebiedsaanwijzingenEmbedded
): GebiedsaanwijzingenVM[] {
  const gebiedsaanwijzingenVMs: GebiedsaanwijzingenVM[] = [];
  let uniqueTypes: { type: string; label: string }[] = [];
  if (vastgesteld) {
    uniqueTypes = uniqueTypes.concat(
      uniqueObjects<Gebiedsaanwijzing>(vastgesteld.gebiedsaanwijzingen, 'gebiedsaanwijzingType').map(
        gebiedsaanwijzing => ({ type: gebiedsaanwijzing.gebiedsaanwijzingType, label: gebiedsaanwijzing.label })
      )
    );
  }
  if (ontwerp) {
    uniqueTypes = uniqueTypes.concat(
      uniqueObjects<OntwerpGebiedsaanwijzing>(ontwerp.ontwerpGebiedsaanwijzing, 'gebiedsaanwijzingType').map(
        ontwerpgebiedsaanwijzing => ({
          type: ontwerpgebiedsaanwijzing.gebiedsaanwijzingType,
          label: ontwerpgebiedsaanwijzing.label,
        })
      )
    );
  }

  // groepeer de gebiedsaanwijzingen per type
  uniqueTypes.forEach(uniquetype => {
    const gebiedsaanwijzingVMs: GebiedsaanwijzingVM[] = [];
    vastgesteld.gebiedsaanwijzingen
      .filter(gebiedsaanwijzing => gebiedsaanwijzing.gebiedsaanwijzingType === uniquetype.type)
      .forEach(gebiedsaanwijzing => {
        const selection = selections?.find(x => x.id === gebiedsaanwijzing.identificatie);
        gebiedsaanwijzingVMs.push({
          identificatie: gebiedsaanwijzing.identificatie,
          naam: gebiedsaanwijzing.naam,
          groep: gebiedsaanwijzing.groep.waarde,
          isSelected: !!selection,
          symboolcode: selection?.symboolcode,
          isOntwerp: false,
        });
      });
    ontwerp?.ontwerpGebiedsaanwijzing
      .filter(gebiedsaanwijzing => gebiedsaanwijzing.gebiedsaanwijzingType === uniquetype.type)
      ?.forEach(gebiedsaanwijzing => {
        const selection = selections?.find(x => x.id === gebiedsaanwijzing.identificatie);
        gebiedsaanwijzingVMs.push({
          identificatie: gebiedsaanwijzing.identificatie,
          naam: gebiedsaanwijzing.naam,
          groep: gebiedsaanwijzing.groep.waarde,
          isSelected: !!selection,
          symboolcode: selection?.symboolcode,
          isOntwerp: true,
        });
      });

    gebiedsaanwijzingenVMs.push({
      gebiedsaanwijzingType: uniquetype.type,
      label: uniquetype.label,
      gebiedsaanwijzingen: sortByKey<GebiedsaanwijzingVM>(gebiedsaanwijzingVMs, 'naam'),
    });
  });
  return sortByKey<GebiedsaanwijzingenVM>(gebiedsaanwijzingenVMs, 'label');
}
