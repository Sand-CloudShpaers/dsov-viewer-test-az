export enum DocumentViewContext {
  BIJLAGE = 'Bijlage',
  REGELS_OP_MAAT = 'Regels op maat',
  VOLLEDIG_DOCUMENT = 'Volledige document',
  TOELICHTING = 'Toelichting',
  PARTIAL_IN_OVERLAY = 'Gedeeltelijk document',
  TIJDELIJK_DEEL = 'Tijdelijk deel',
}

export enum LayoutState {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface DerivedLayoutStateOpen {
  isOpen: boolean;
  isClosed: boolean;
}

export interface DerivedLayoutStateActive {
  isActive: boolean;
  isNotActive: boolean;
}

export interface DerivedLayoutState {
  collapse?: DerivedLayoutStateOpen;
  representation?: DerivedLayoutStateActive;
  annotaties?: DerivedLayoutStateOpen;
  isSelected?: boolean;
}

export interface LayoutStateVM {
  [key: string]: DerivedLayoutState;
}

export interface DocumentElementenLayoutVM {
  documentViewContext: DocumentViewContext;
  showTitle: boolean;
  showNumberOnly: boolean;
  showToggle: boolean;
  showContent: boolean;
  showElementen: boolean;
  isCollapsible: boolean;
  isFiltered: boolean;
  isOpen: boolean;
  showAnnotation: boolean;
  hasAnnotation: boolean;
  isEmptyParagraph: boolean;
  showBreadcrumbs: boolean;
  isActive?: boolean;
}
