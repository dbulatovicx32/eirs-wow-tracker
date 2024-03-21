import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastNotificationComponent } from './toast-notification/toast-notification.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, ToastNotificationComponent, CommonModule],
  template: `
    <main class="flex flex-col h-full w-full">
      <div class="navbar z-50">
        <div class="navbar-start">
          <div class="dropdown">
            <div tabindex="0" role="button" class="btn btn-ghost btn-circle btn-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </div>
            <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-300 rounded-box w-52">
              <li><a [routerLink]="['/']">Homepage</a></li>
              <li><a [routerLink]="['/characters']">Characters</a></li>
              <li><a [routerLink]="['/sessions']">Sessions</a></li>
            </ul>
          </div>
        </div>

        <div class="navbar-center">
          <a class="btn btn-ghost btn-sm text-xl">grind tracker</a>
        </div>

        <div class="navbar-end">
          <div class="dropdown dropdown-end z-50">
            <div tabindex="0" role="button" class="btn btn-circle btn-sm btn-ghost m-1">
              <i class="material-icons-outlined" style="font-size: 20px;">format_paint</i>
            </div>
            <ul tabindex="0" class="dropdown-content z-[1] p-2 shadow-2xl bg-base-300 rounded-box w-32">
              <li *ngFor="let theme of availableThemes; let i = index">
                <input
                  type="radio"
                  name="theme-dropdown"
                  class="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                  [attr.aria-label]="theme"
                  [value]="theme" />
              </li>
            </ul>
          </div>
        </div>
      </div>

      <router-outlet></router-outlet>
      <app-toast-notification />
    </main>
  `,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'eirs-wow-tracker';
  availableThemes: string[] = ['light', 'dark', 'cyberpunk', 'dracula', 'business'];
}
