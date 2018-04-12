import {Directive, ElementRef, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output, Renderer2} from '@angular/core';
import {WindowResizeService} from './window-resize.service';
import {auditTime} from 'rxjs/operators';
import {Subscription} from 'rxjs/Subscription';
import {DocumentAnimationEventService} from './document-animation-event.service';
import {DocumentTransitionEventService} from './document-transition-event.service';

@Directive({
  selector: '[appDtResize]'
})
export class DtResizeDirective implements OnInit, OnDestroy {
  @Input()
  public appDtResizeAuditTime = 150;
  @Output()
  public appDtResize = new EventEmitter<void>();

  private readonly nativeElement: HTMLElement;
  private readonly subscriptions = new Subscription();

  private lastWidth = 0;
  private lastHeight = 0;

  constructor(private renderer: Renderer2,
              private windowResizeService: WindowResizeService,
              private documentAnimationEventService: DocumentAnimationEventService,
              private documentTransitionEventService: DocumentTransitionEventService,
              private ngZone: NgZone,
              elementRef: ElementRef) {
    this.nativeElement = elementRef.nativeElement;
  }

  public ngOnInit(): void {
    this.lastWidth = this.nativeElement.offsetWidth;
    this.lastHeight = this.nativeElement.offsetHeight;
    this.init();
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private init() {
    this.createWindowResizeSubscription();
    this.createDocumentAnimationChangedSubscription();
    this.createDocumentTransitionChangedSubscription();
    this.createNgZoneStableSubscription();
  }

  private createWindowResizeSubscription() {
    const subscription = this.windowResizeService.getResize()
      .pipe(auditTime(this.appDtResizeAuditTime))
      .subscribe(() => {
        console.log('Window Resize');
        console.log('Emit from Window Resize');
        this.emitEvent();
      });
    this.subscriptions.add(subscription);
  }

  private createDocumentAnimationChangedSubscription() {
    const subscription = this.documentAnimationEventService.getAnimationChanged()
      .pipe(auditTime(this.appDtResizeAuditTime))
      .subscribe(() => {
        console.log('Animation');
        if (this.hasSizeChanged()) {
          console.log('Emit from Animation');
          this.emitEvent();
        }
      });
    this.subscriptions.add(subscription);
  }

  private createDocumentTransitionChangedSubscription() {
    const subscription = this.documentTransitionEventService.getTransitionChanged()
      .pipe(auditTime(this.appDtResizeAuditTime))
      .subscribe(() => {
        console.log('Transition');
        if (this.hasSizeChanged()) {
          console.log('Emit from Transition');
          this.emitEvent();
        }
      });
    this.subscriptions.add(subscription);
  }

  private createNgZoneStableSubscription() {
    const ngZoneStableSubscription = this.ngZone.onStable
      .pipe(auditTime(this.appDtResizeAuditTime))
      .subscribe(() => {
        console.log('Zone');
        if (this.hasSizeChanged()) {
          console.log('Emit from Zone');
          this.emitEvent();
        }
      });
    this.subscriptions.add(ngZoneStableSubscription);
  }

  private hasSizeChanged() {
    const width = this.nativeElement.offsetWidth;
    const height = this.nativeElement.offsetHeight;

    if (this.lastWidth !== width || this.lastHeight !== height) {
      this.lastWidth = width;
      this.lastHeight = height;
      return true;
    } else {
      return false;
    }
  }

  private emitEvent() {
    this.appDtResize.emit();
  }
}
