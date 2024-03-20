import { Injectable } from '@angular/core';
import { Character } from './characters/characters';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  url = 'http://localhost:3000/characters';

  async getAllCharacters(): Promise<Character[]> {
    const data = await fetch(this.url);
    return (await data.json()) ?? [];
  }

  async getCharacterById(id: string): Promise<Character> {
    const data = await fetch(`${this.url}/${id}`);
    return (await data.json()) ?? {};
  }

  async getNextDbId(): Promise<string> {
    try {
      const dbLength = await this.getAllCharacters();
      return dbLength.length.toString();
    } catch (error) {
      console.error('Error getting next free character ID:', error);
      throw error;
    }
  }

  async createNewCharacter(character: Character): Promise<Character> {
    const response = await fetch(this.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(character),
    });
    return await response.json();
  }

  async updateCharacter(character: Character): Promise<Character> {
    const response = await fetch(`${this.url}/${character.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(character),
    });
    return await response.json();
  }

  async deleteCharacter(characterId: string) {
    const response = await fetch(`${this.url}/${characterId}`, {
      method: 'DELETE',
    });
    return await response.json();
  }
}
