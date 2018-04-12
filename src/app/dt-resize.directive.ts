import {Directive, ElementRef, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output, Renderer2} from '@angular/core';
import {WindowResizeService} from './window-resize.service';
import {auditTime} from 'rxjs/operators';
import {Subscription} from 'rxjs/Subscription';
import {DocumentAnimationEventService} from './document-animation-event.service';

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
              private documentAnimationEndedService: DocumentAnimationEventService,
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
    this.createDocumentAnimationEndedSubscription();
    this.createNgZoneStableSubscription();
  }

  private createWindowResizeSubscription() {
    const subscription = this.windowResizeService.getResize()
      .pipe(auditTime(this.appDtResizeAuditTime))
      .subscribe(() => this.emitEvent());
    this.subscriptions.add(subscription);
  }

  private createDocumentAnimationEndedSubscription() {
    const subscription = this.documentAnimationEndedService.getAnimationEnded()
      .pipe(auditTime(this.appDtResizeAuditTime))
      .subscribe(() => {
        if (this.hasSizeChanged()) {
          this.emitEvent();
        }
      });
    this.subscriptions.add(subscription);
  }

  private createNgZoneStableSubscription() {
    const ngZoneStableSubscription = this.ngZone.onStable
      .pipe(auditTime(this.appDtResizeAuditTime))
      .subscribe(() => {
        if (this.hasSizeChanged()) {
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
