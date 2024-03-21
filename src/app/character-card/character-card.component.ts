import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Character } from '../characters/characters';
import { JsonPipe } from '@angular/common';
import { CharacterService } from '../character.service';
import { CharacterEventService } from '../characters/CharacterEventService';
import { AppEventService } from '../appEvent.service';

@Component({
  selector: 'app-character-card',
  standalone: true,
  imports: [JsonPipe],
  template: `
    <div class="card bg-base-100 shadow-xl image-full">
      <figure style="background-color:{{ getClassColor() }}"><img src="{{ getClassImage() }}" style="height: 200px;" /></figure>
      <div class="card-body">
        <h2 class="card-title">{{ character.name }}</h2>
        <p>lv.{{ character.level }} {{ character.class }}</p>
        <!-- <p>{{ character.professions | json }}</p> -->
        <!-- <div class="card-actions justify-end"> -->
        <div class="card-actions justify-end">
          <button class="btn-xs btn-circle btn-outline material-icons" (click)="editCharacter()">edit</button>
          <button class="btn-xs btn-circle btn-outline material-icons" (click)="deleteCharacter(character.id)">delete</button>
        </div>
      </div>
    </div>
  `,
  styleUrl: './character-card.component.scss',
})
export class CharacterCardComponent {
  @Input() character!: Character;
  @Output() onEditCharacter = new EventEmitter<string>();
  @Output() ondDeleteCharacter = new EventEmitter<string>();
  characterService = inject(CharacterService);
  characterEventService = inject(CharacterEventService);
  appEventService = inject(AppEventService);

  editCharacter() {
    this.onEditCharacter.emit(this.character.id);
  }
  deleteCharacter(characterId: string) {
    console.log('deleting', characterId);

    try {
      this.characterService.deleteCharacter(characterId).then(() => {
        this.appEventService.notifyShowToast({ message: 'Character deleted.', severity: 'success' });
        this.characterEventService.notifyCharacterUpdated();
      });
    } catch (error) {
      this.appEventService.notifyShowToast({ message: 'Error deleting character.', severity: 'error' });
      console.error(`Error`, error);
    }
  }

  getClassImage() {
    switch (this.character.class) {
      case 'Druid':
        return 'https://i.imgur.com/l9O6VDX.png';
      case 'Hunter':
        return 'https://i.imgur.com/Fsz72jJ.png';
      case 'Mage':
        return 'https://i.imgur.com/73HwEut.png';
      case 'Paladin':
        return 'https://i.imgur.com/ckgqohP.png';
      case 'Priest':
        return 'https://i.imgur.com/6qo1Xbt.png';
      case 'Rogue':
        return 'https://i.imgur.com/djdxDht.png';
      case 'Shaman':
        return 'https://i.imgur.com/rRwA2Sn.png';
      case 'Warlock':
        return 'https://i.imgur.com/rFUdNuY.png';
      case 'Warrior':
        return 'https://i.imgur.com/lFMFiku.png';
      default:
        return 'https://i.redd.it/uuqdg3jz6gi81.jpg';
    }
  }
  getClassColor() {
    switch (this.character.class) {
      case 'Druid':
        return '#FF7C0A';
      case 'Hunter':
        return '#AAD372';
      case 'Mage':
        return '#3FC7EB';
      case 'Paladin':
        return '#F48CBA';
      case 'Priest':
        return '#FFFFFF';
      case 'Rogue':
        return '#FFF468';
      case 'Shaman':
        return '#0070DD';
      case 'Warlock':
        return '#8788EE';
      case 'Warrior':
        return '#C69B6D';
      default:
        return '#A330C9';
    }
  }
}
