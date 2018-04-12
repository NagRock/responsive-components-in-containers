import {Component} from '@angular/core';
import {TimerObservable} from 'rxjs/observable/TimerObservable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public anim = false;
  public menuVisible = true;

  public startAnim() {
    this.anim = false;
    TimerObservable.create(100).subscribe(() => {
      this.anim = true;
    });
  }

  public toggleMenu() {
    this.menuVisible = !this.menuVisible;
  }
}
