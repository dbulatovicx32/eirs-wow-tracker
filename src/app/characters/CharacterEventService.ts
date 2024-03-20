import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CharacterEventService {
  private characterUpdatedSource = new Subject<void>();
  characterUpdated$ = this.characterUpdatedSource.asObservable();

  notifyCharacterUpdated() {
    this.characterUpdatedSource.next();
  }
}