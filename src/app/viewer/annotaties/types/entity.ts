import { ActiviteitLocatieaanduidingen } from '~ozon-model/activiteitLocatieaanduidingen';
import { Gebiedsaanwijzingen } from '~ozon-model/gebiedsaanwijzingen';
import { Hoofdlijnen } from '~ozon-model/hoofdlijnen';
import { Kaarten } from '~ozon-model/kaarten';
import { Locaties } from '~ozon-model/locaties';
import { Omgevingsnormen } from '~ozon-model/omgevingsnormen';
import { Omgevingswaarden } from '~ozon-model/omgevingswaarden';
import { OntwerpActiviteitLocatieaanduidingen } from '~ozon-model/ontwerpActiviteitLocatieaanduidingen';
import { OntwerpGebiedsaanwijzingen } from '~ozon-model/ontwerpGebiedsaanwijzingen';
import { OntwerpHoofdlijnen } from '~ozon-model/ontwerpHoofdlijnen';
import { OntwerpKaarten } from '~ozon-model/ontwerpKaarten';
import { OntwerpLocaties } from '~ozon-model/ontwerpLocaties';
import { OntwerpOmgevingsnormen } from '~ozon-model/ontwerpOmgevingsnormen';
import { OntwerpOmgevingswaarden } from '~ozon-model/ontwerpOmgevingswaarden';
import { AnnotationId } from '~viewer/documenten/types/annotation';

interface annotationEntity {
  annotationId: AnnotationId;
  vastgesteld?: unknown;
  ontwerp?: unknown;
}

export interface LocatiesEntity extends annotationEntity {
  vastgesteld?: Locaties;
  ontwerp?: OntwerpLocaties;
}

export interface GebiedsaanwijzingenEntity extends annotationEntity {
  vastgesteld?: Gebiedsaanwijzingen;
  ontwerp?: OntwerpGebiedsaanwijzingen;
}

export interface OmgevingsnormenEntity extends annotationEntity {
  vastgesteld?: Omgevingsnormen;
  ontwerp?: OntwerpOmgevingsnormen;
}

export interface OmgevingswaardenEntity extends annotationEntity {
  vastgesteld?: Omgevingswaarden;
  ontwerp?: OntwerpOmgevingswaarden;
}

export interface ActiviteitLocatieaanduidingenEntity extends annotationEntity {
  vastgesteld?: ActiviteitLocatieaanduidingen;
  ontwerp?: OntwerpActiviteitLocatieaanduidingen;
}

export interface HoofdlijnenEntity extends annotationEntity {
  vastgesteld?: Hoofdlijnen;
  ontwerp?: OntwerpHoofdlijnen;
}

export interface KaartenEntity extends annotationEntity {
  vastgesteld?: Kaarten;
  ontwerp?: OntwerpKaarten;
}
