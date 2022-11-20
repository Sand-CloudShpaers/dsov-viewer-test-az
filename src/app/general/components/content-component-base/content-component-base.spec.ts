import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentComponentBase } from '~general/components/content-component-base/content-component-base';
import { ContentService } from '~services/content.service';
import { Component } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Component({})
class MockComponent extends ContentComponentBase {
  constructor(protected contentService: ContentService) {
    super(contentService);
  }
}

describe('ContentComponentBaseComponent', () => {
  let component: MockComponent;
  let fixture: ComponentFixture<MockComponent>;
  const ContentServiceSpy = {
    getRichContent: jasmine.createSpy('getRichContent'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MockComponent],
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: ContentService,
          useValue: ContentServiceSpy,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getRichContent', () => {
    it('should return requested content', () => {
      component.getRichContent('a');

      expect(ContentServiceSpy.getRichContent).toHaveBeenCalledWith('a');
    });
  });
});
