import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {FromEventObservable} from 'rxjs/observable/FromEventObservable';
import {Observable} from 'rxjs/Observable';
import {merge} from 'rxjs/operators';

@Injectable()
export class DocumentAnimationEventService {
  private animationEventSubject: Subject<void> = new Subject();

  constructor() {
    FromEventObservable.create(document, 'animationstart')
      .pipe(merge(
        FromEventObservable.create(document, 'animationend'),
        FromEventObservable.create(document, 'webkitAnimationStart'),
        FromEventObservable.create(document, 'webkitAnimationEnd'),
      ))
      .subscribe(() => {
        this.animationEventSubject.next();
      });
  }

  public getAnimationEnded(): Observable<void> {
    return this.animationEventSubject.asObservable();
  }
}
