import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DisableMapClickService {
  private popupEnabledSubject$ = new BehaviorSubject<boolean>(true);
  public popupEnabled$ = this.popupEnabledSubject$.asObservable();
  private closeSubject$ = new Subject<void>();
  public close$ = this.closeSubject$.asObservable();

  public enable(): void {
    this.popupEnabledSubject$.next(true);
  }

  public disable(): void {
    this.popupEnabledSubject$.next(false);
  }

  public close(): void {
    this.closeSubject$.next(null);
  }
}
