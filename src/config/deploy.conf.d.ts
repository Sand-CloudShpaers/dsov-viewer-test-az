type trueFalseString = 'true' | 'false';

export interface DeployResponse {
  betacontent?: trueFalseString;
  ozonprocedurestatus?: trueFalseString;
  ozonomgevingsvisiemock?: trueFalseString;

  [key: string]: DeployResponse[keyof DeployResponse];
}
