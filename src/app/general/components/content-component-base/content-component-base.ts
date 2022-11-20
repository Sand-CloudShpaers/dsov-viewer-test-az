import { ContentKeys, ContentService } from '~services/content.service';

export abstract class ContentComponentBase {
  protected constructor(protected contentService: ContentService) {}

  public get contentKeys(): typeof ContentKeys {
    return ContentKeys;
  }

  public getRichContent(key: string): string {
    return this.contentService.getRichContent(key);
  }
}
