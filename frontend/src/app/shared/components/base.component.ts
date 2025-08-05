import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * Base component that provides common functionality and automatic subscription cleanup
 */
@Component({
  template: ''
})
export abstract class BaseComponent implements OnDestroy {
  protected readonly destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Track by function for ngFor performance optimization
   */
  trackByFn<T extends { id: any }>(index: number, item: T): any {
    return item?.id ?? index;
  }

  /**
   * Track by id function for simple id-based tracking
   */
  trackById(index: number, item: { id: any }): any {
    return item.id;
  }

  /**
   * Track by index function for simple index-based tracking
   */
  trackByIndex(index: number): number {
    return index;
  }
}
