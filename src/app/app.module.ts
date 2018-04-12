import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


import {AppComponent} from './app.component';
import {DtResizeDirective} from './dt-resize.directive';
import {SampleComponentComponent} from './sample-component/sample-component.component';
import {WindowResizeService} from './window-resize.service';
import {DocumentAnimationEventService} from './document-animation-event.service';


@NgModule({
  declarations: [
    AppComponent,
    DtResizeDirective,
    SampleComponentComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    WindowResizeService,
    DocumentAnimationEventService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
