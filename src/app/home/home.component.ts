import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  template: ` home works `,
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
