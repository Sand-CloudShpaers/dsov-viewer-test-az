import { Injectable } from '@angular/core';
import { Tekst } from '~ihr-model/tekst';
import { TekstCollectie } from '~ihr-model/tekstCollectie';

@Injectable()
export class IhrDocumentHtmlService {
  public static getHtmlFromTekstCollectie(tekstCollectie: TekstCollectie): string {
    let html = '';
    tekstCollectie._embedded.teksten.forEach((tekst: Tekst) => {
      html += IhrDocumentHtmlService.getHtmlFromTekst(tekst);
    });
    return html;
  }

  public static getHtmlFromTekst(documentElement: Tekst): string {
    let html: string = IhrDocumentHtmlService.getHtmlPart(documentElement.titel, documentElement.inhoud, '3');
    documentElement._embedded?.children.forEach(child => {
      html += IhrDocumentHtmlService.getHtmlPart(child.titel, child.inhoud, '4');
      child._embedded?.children.forEach(grandChild => {
        html += IhrDocumentHtmlService.getHtmlPart(grandChild.titel, grandChild.inhoud, '5');
        grandChild._links.children.length ? (html += '...<br>') : (html += '');
      });
    });
    return html;
  }

  private static getHtmlPart(titel: string, inhoud: string, niveau: string): string {
    return '<h' + niveau + '>' + titel + '</h' + niveau + '>' + (inhoud ? inhoud : '');
  }
}
