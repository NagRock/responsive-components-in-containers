import {Component} from '@angular/core';

@Component({
  selector: 'app-sample-component',
  templateUrl: './sample-component.component.html',
  styleUrls: ['./sample-component.component.css']
})
export class SampleComponentComponent {
  public resizeCount = 0;

  public handleResize() {
    this.resizeCount++;
  }
}
