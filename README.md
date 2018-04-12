### PoC of Angular directive that notifies about DOM element resize

## Features

Directive that notifies about element size change by listening on:
* ngZone,
* Window resize,
* Transition end,
* Animation start/end.

## Usage

```html
<div (appDtResize)="handleResize()" [appDtResizeAuditTime]="200">
```

```typescript
  public handleResize(): void {
    console.log('Div changed size');
  }
```

## Demo

[responsive-components-in-containers](https://stackblitz.com/github/NagRock/responsive-components-in-containers)

