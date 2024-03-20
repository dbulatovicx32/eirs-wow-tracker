import { Component, inject } from '@angular/core';
import { CharacterCardComponent } from '../character-card/character-card.component';
import { CharacterFormComponent } from '../character-form/character-form.component';
import { Character } from './characters';
import { CharacterService } from '../character.service';
import { CommonModule } from '@angular/common';
import { CharacterEventService } from './CharacterEventService';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-characters',
  standalone: true,
  imports: [CharacterCardComponent, CharacterFormComponent, CommonModule],
  template: `
    {{ isFormVisible }}
    <div class="m-3 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-3">
      <app-character-card
        *ngFor="let character of filteredCharacterList"
        [character]="character"
        (onEditCharacter)="openCharacterForm($event)" />
    </div>

    <app-character-form *ngIf="isFormVisible" [characterId]="selectedCharacterId" (submit)="closeForm()" (close)="closeForm()" />

    <button class="btn btn-circle btn-outline fixed bottom-4 right-4 z-50" (click)="openCharacterForm('new')">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    </button>
  `,
  styleUrl: './characters.component.scss',
})
export class CharactersComponent {
  private eventsSubscription: Subscription = new Subscription();
  characterList: Character[] = [];
  filteredCharacterList: Character[] = [];
  isFormVisible: boolean = false;
  selectedCharacterId: string = '';

  constructor(private characterService: CharacterService, private characterEventService: CharacterEventService) {}

  ngOnInit() {
    this.loadCharacters();
    this.eventsSubscription = this.characterEventService.characterUpdated$.subscribe(() => {
      this.loadCharacters();
    });
  }
  ngOnDestroy() {
    if (this.eventsSubscription) this.eventsSubscription.unsubscribe();
  }

  async loadCharacters() {
    try {
      await this.characterService.getAllCharacters().then((characters: Character[]) => {
        this.characterList = characters;
        this.filteredCharacterList = characters;
      });
    } catch (err) {
      console.error('Failed to load characters', err);
    }
  }
  async addNewCharacter(): Promise<void> {
    try {
      this.selectedCharacterId = await this.characterService.getNextDbId();
      console.log(this.selectedCharacterId);
    } catch (error) {
      console.error('Error in addNewCharacter:', error);
    }
  }

  openCharacterForm(characterId: string): void {
    this.selectedCharacterId = characterId;
    this.toggleFormVisibility();
  }
  toggleFormVisibility(): void {
    this.isFormVisible = !this.isFormVisible;
  }
  closeForm(): void {
    this.isFormVisible = false;
    this.selectedCharacterId = '';
  }
}
