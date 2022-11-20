export class PopupDiv {
  public div: HTMLElement;
  public text: HTMLElement;
  public className: string;

  constructor(div: HTMLElement, text: HTMLElement, className: string) {
    this.div = div;
    this.text = text;
    this.className = className;
  }
}
