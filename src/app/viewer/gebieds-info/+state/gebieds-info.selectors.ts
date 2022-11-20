import { createSelector } from '@ngrx/store';
import { getOmgevingsnormenStatus, selectOmgevingsnormenVM } from './omgevingsnormen/omgevingsnormen.selectors';
import { getOmgevingswaardenStatus, selectOmgevingswaardenVM } from './omgevingswaarden/omgevingswaarden.selectors';
import {
  getGebiedsaanwijzingenStatus,
  selectGebiedsaanwijzingenVM,
} from './gebiedsaanwijzingen/gebiedsaanwijzingen.selectors';
import { SelectionSet, ViewSelectionItems } from '~viewer/gebieds-info/types/gebieds-info.model';
import { DerivedLoadingState } from '~general/utils/store.utils';

export const getViewSelectionLoadingStatus = createSelector(
  getOmgevingsnormenStatus,
  getOmgevingswaardenStatus,
  getGebiedsaanwijzingenStatus,
  (omgevingsnormen, omgevingswaarden, gebiedsaanwijzingen): DerivedLoadingState => {
    const statusList = [omgevingsnormen, omgevingswaarden, gebiedsaanwijzingen];
    return {
      isLoading: statusList.some(status => status.isLoading),
      isIdle: statusList.some(status => status.isIdle),
      isPending: statusList.some(status => status.isPending),
      isResolved: statusList.some(status => status.isPending),
      isRejected: statusList.some(status => status.isRejected),
      isLoaded: statusList.some(status => status.isLoaded),
    };
  }
);

export const getViewSelectionItems = createSelector(
  selectOmgevingsnormenVM,
  selectOmgevingswaardenVM,
  selectGebiedsaanwijzingenVM,
  (omgevingsnormenVM, omgevingswaardenVM, gebiedsaanwijzingenVM): ViewSelectionItems => {
    const gebiedsaanwijzingen: SelectionSet[] = [];

    gebiedsaanwijzingenVM?.forEach(lijst => {
      lijst.gebiedsaanwijzingen.forEach(gebiedsaanwijzing => {
        gebiedsaanwijzingen.push({
          identificatie: gebiedsaanwijzing.identificatie,
          naam: `${gebiedsaanwijzing.naam} (${lijst.label})`,
        });
      });
    });

    const omgevingsnormen: SelectionSet[] = [];
    omgevingsnormenVM?.forEach(omgevinsnorm => {
      omgevinsnorm.normen.forEach(norm => {
        omgevingsnormen.push({
          identificatie: norm.identificatie,
          naam: norm.naam,
        });
      });
    });

    const omgevingswaarden: SelectionSet[] = [];
    omgevingswaardenVM?.forEach(omgevingswaarde => {
      omgevingswaarde.normen.forEach(norm => {
        omgevingswaarden.push({
          identificatie: norm.identificatie,
          naam: norm.naam,
        });
      });
    });

    return {
      omgevingsnormen,
      omgevingswaarden,
      gebiedsaanwijzingen,
    };
  }
);
