import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FaqInfo, FaqItem } from './types/faq-items';
import { FaqService } from './services/faq.service';

@Component({
  selector: 'dsov-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FaqComponent implements OnInit {
  public faqInfo: FaqInfo;

  constructor(private faqService: FaqService, @Inject(DOCUMENT) private document: Document) {}

  public ngOnInit(): void {
    this.faqInfo = this.faqService.fetchFaqInfo();
  }

  public toggleQuestions(toggledQuestion: FaqItem, questions: FaqItem[]): void {
    toggledQuestion.open = !toggledQuestion.open;
    if (toggledQuestion.open) {
      questions
        .filter(question => question.title !== toggledQuestion.title)
        .forEach(question => (question.open = false));
    }
  }

  public trackByFn(_index: number, item: FaqItem): string {
    return item.title;
  }
}
