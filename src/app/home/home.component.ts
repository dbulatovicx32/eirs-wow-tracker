import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div
      class="hero min-h-screen"
      style="background-image: url(https://bnetcmsus-a.akamaihd.net/cms/blog_header/a4/A47BLIYL3KA31587000605632.jpg);">
      <div class="hero-overlay bg-opacity-60"></div>
      <div class="hero-content text-center text-neutral-content">
        <div class="max-w-md">
          <h1 class="mb-5 text-5xl font-bold">Eir's Grind Tracker</h1>
          <p class="mb-5">
            Make profit tracking easier by saving grind sessions across all characters and zones. Summarize them and preview all earnings or
            only for single character.
          </p>
          <button class="btn btn-neutral" (click)="addCharacter()">add a character</button>
        </div>
      </div>
    </div>
  `,
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private router = inject(Router);

  addCharacter() {
    this.router.navigate(['/characters']); // Use the correct path for your routing setup
  }
}
