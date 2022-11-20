import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { PipesModule } from '~general/pipes/pipes.module';
import { FaqItem } from './types/faq-items';
import { FaqComponent } from './faq.component';
import { FaqService } from './services/faq.service';

describe('FaqComponent', () => {
  let component: FaqComponent;
  let fixture: ComponentFixture<FaqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FaqComponent],
      imports: [PipesModule],
      providers: [
        {
          provide: FaqService,
          useValue: {
            fetchFaqInfo: () => ({
              leadIn$: of({
                title: 'abc',
                content: 'abc',
              }),
              questions$: of([
                { title: 'a', content: 'aa', open: false },
                { title: 'b', content: 'bb', open: false },
              ]),
            }),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('toggleQuestions', () => {
    it('should toggle open the selected question and close another open question', () => {
      const toggledQuestion: FaqItem = { title: 'a', content: 'aa', open: false };
      const questions: FaqItem[] = [toggledQuestion, { title: 'b', content: 'bb', open: true }];
      component.toggleQuestions(toggledQuestion, questions);

      expect(toggledQuestion).toEqual({ title: 'a', content: 'aa', open: true });
      expect(questions).toEqual([
        { title: 'a', content: 'aa', open: true },
        { title: 'b', content: 'bb', open: false },
      ]);
    });

    it('should toggle close the selected question', () => {
      const toggledQuestion: FaqItem = { title: 'a', content: 'aa', open: true };
      const questions: FaqItem[] = [toggledQuestion, { title: 'b', content: 'bb', open: false }];
      component.toggleQuestions(toggledQuestion, questions);

      expect(toggledQuestion).toEqual({ title: 'a', content: 'aa', open: false });
      expect(questions).toEqual([
        { title: 'a', content: 'aa', open: false },
        { title: 'b', content: 'bb', open: false },
      ]);
    });
  });

  describe('trackByFn', () => {
    it('should return title of the item', () => {
      expect(component.trackByFn(0, { title: 'a', content: '' })).toEqual('a');
    });
  });
});
