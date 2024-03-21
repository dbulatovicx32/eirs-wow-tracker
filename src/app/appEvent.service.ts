import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ToastMessage } from './toast-notification/ToastNotification';

@Injectable({
  providedIn: 'root',
})
export class AppEventService {
  private showToastSource = new Subject<ToastMessage>();
  showToast$ = this.showToastSource.asObservable();

  notifyShowToast(toastMessage: ToastMessage) {
    this.showToastSource.next(toastMessage);
  }
}
