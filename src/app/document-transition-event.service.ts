import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {FromEventObservable} from 'rxjs/observable/FromEventObservable';
import {merge} from 'rxjs/operators';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class DocumentTransitionEventService {
  private transitionEventSubject: Subject<void> = new Subject();

  constructor() {
    FromEventObservable.create(document, 'transitionend')
      .pipe(merge(FromEventObservable.create(document, 'webkitTransitionEnd')))
      .subscribe(() => {
        this.transitionEventSubject.next();
      });
  }

  public getTransitionChanged(): Observable<void> {
    return this.transitionEventSubject.asObservable();
  }
}
