export interface Character {
  id: string;
  name: string;
  class: string;
  level: number;
  professions: Profession[];
}

export interface Profession {
  name: string;
  level: number;
  note?: string;
}
