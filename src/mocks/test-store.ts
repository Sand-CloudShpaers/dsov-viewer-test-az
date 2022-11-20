// tslint:disable: rxjs-finnish
import { BehaviorSubject, Observable } from 'rxjs';

export class TestStore<T> {
  private state: BehaviorSubject<T> = new BehaviorSubject(null);

  public setState(data: T): void {
    this.state.next(data);
  }

  public select(selector?: any): Observable<T> {
    return this.state.asObservable();
  }

  public dispatch(action: any): void {}

  public pipe(action: any): Observable<T> {
    return this.state.asObservable();
  }
}
