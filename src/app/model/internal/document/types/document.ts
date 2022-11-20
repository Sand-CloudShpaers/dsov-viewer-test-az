import { Geometry } from 'ol/geom';
import { DocumentCard } from './document-card';
import { DocumentContent } from './document-content';
import { ApiSource } from '~model/internal/api-source';

export class Document {
  public id: string;
  public olGeometry: Geometry;
  public card: DocumentCard = new DocumentCard();
  public content: DocumentContent = new DocumentContent();
  public apiSource: ApiSource.IHR | ApiSource.OZON;
}
