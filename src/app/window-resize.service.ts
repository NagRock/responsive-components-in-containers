import { Injectable } from '@angular/core';
import {FromEventObservable} from 'rxjs/observable/FromEventObservable';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class WindowResizeService {
  private resizeSubject: Subject<void> = new Subject();

  constructor() {
    FromEventObservable.create(window, 'resize').subscribe(() => {
      this.resizeSubject.next();
    });
  }

  public getResize(): Observable<void> {
    return this.resizeSubject.asObservable();
  }
}
