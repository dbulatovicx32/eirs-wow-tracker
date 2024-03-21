import { Component, Input, OnInit, inject } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { ToastMessage } from './ToastNotification';
import { AppEventService } from '../appEvent.service';

@Component({
  standalone: true,
  selector: 'app-toast-notification',
  imports: [CommonModule],
  template: `
    <div @slideInOut class="toast toast-bottom toast-end z-50" *ngIf="showToast">
      <div
        class="alert"
        [ngClass]="{
          'alert-info': toastMessage.severity === 'info',
          'alert-success': toastMessage.severity === 'success',
          'alert-warning': toastMessage.severity === 'warning',
          'alert-error': toastMessage.severity === 'error'
        }">
        <span>{{ toastMessage.message }}</span>
      </div>
    </div>
  `,
  animations: [trigger('slideInOut', [transition(':leave', [animate('300ms ease-in', style({ transform: 'translateX(100%)' }))])])],
  styleUrl: './toast-notification.component.scss',
})
export class ToastNotificationComponent implements OnInit {
  toastMessage: ToastMessage = {};
  showToast: boolean = false;
  appEventService = inject(AppEventService);

  ngOnInit() {
    this.appEventService.showToast$.subscribe(toastMessage => {
      this.toastMessage = toastMessage;

      this.toggleToast()
    });
  }

  toggleToast() {
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 2000);
  }
}
