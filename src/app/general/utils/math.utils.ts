export function setMaxDecimalsUsingFloor(n: number, decimals = 1): number {
  return Math.floor(n * 10 ** decimals) / 10 ** decimals;
}
