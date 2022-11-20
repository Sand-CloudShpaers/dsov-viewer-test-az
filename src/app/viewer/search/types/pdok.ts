export interface PDOK {
  type: string;
  name: string;
  crs: { type: string; properties: { name: string } };
  totalFeatures?: number;
  features: unknown[];
}
