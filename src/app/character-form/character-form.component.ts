import { NgFor, NgClass, JsonPipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CharacterService } from '../character.service';
import { Character, Profession } from '../characters/characters';
import { CharacterEventService } from '../characters/CharacterEventService';
import { AVAILABLE_CLASSES, AVAILABLE_PROFESSIONS } from '../characters/constants';
import { AppEventService } from '../appEvent.service';

@Component({
  selector: 'app-character-form',
  standalone: true,
  imports: [NgFor, NgClass, JsonPipe, ReactiveFormsModule],
  template: `
    <dialog #dialogRef id="my_modal_2" class="modal">
      <div class="modal-box">
        <form class="w-full max-w-lg" [formGroup]="characterForm" (ngSubmit)="onSubmit()">
          {{ characterForm.value | json }}
          {{ characterForm.invalid }}
          <div class="flex flex-wrap -mx-3 mb-3">
            <div class="flex flex-col w-full px-3 mb-3">
              <label class="self-center"> ID </label>
              <input formControlName="id" class="input input-bordered input-sm w-full" />
            </div>
            <div class="flex flex-col w-full px-3 mb-3">
              <label> Name </label>
              <!-- [ngClass]="{ 'input-error': name.invalid && (name.dirty || name.touched) }" /> -->

              <input id="name" formControlName="name" class="input input-bordered input-sm w-full" />
            </div>

            <div class="flex flex-col w-full md:w-1/2 px-3 mb-3">
              <label> Class </label>
              <select formControlName="class" class="select select-bordered select-sm w-full">
                <option *ngFor="let class of availableClasses; let i = index">
                  {{ class }}
                </option>
              </select>
            </div>

            <div class="flex flex-col w-full md:w-1/2 px-3 mb-3">
              <label> Level </label>
              <input formControlName="level" class="input input-bordered input-sm w-full" type="number" />
            </div>
          </div>

          <div formArrayName="professions">
            <div class="flex flex-row justify-between mb-3">
              <p class="text-lg">Professions</p>
              <button type="button" class="btn-xs btn-circle btn-outline material-icons self-center" (click)="addProfession()">add</button>
            </div>
            <div
              *ngFor="let profession of professions.controls; let i = index"
              [formGroupName]="i"
              class="flex profession-card mb-3 group relative">
              <div class="flex flex-wrap -mx-3">
                <div class="flex flex-col w-full md:w-1/2 px-3 mb-3">
                  <label> Name </label>
                  <select formControlName="name" class="select select-bordered select-sm w-full">
                    <option *ngFor="let profession of availableProfessions; let i = index">
                      {{ profession }}
                    </option>
                  </select>
                </div>
                <div class="flex flex-col w-full md:w-1/2 px-3 mb-3">
                  <label> Level </label>
                  <input formControlName="level" class="input input-bordered input-sm w-full" type="number" />
                </div>
                <div class="flex flex-col w-full px-3 mb-3">
                  <label> Note </label>
                  <input formControlName="note" class="input input-bordered input-sm w-full" />
                </div>
              </div>

              <button
                type="button"
                class="btn-xs btn-circle btn-outline material-icons absolute bottom-0 right-0 opacity-0 group-hover:opacity-100"
                (click)="removeProfession(i)">
                delete
              </button>
            </div>
          </div>

          <button type="submit" class="btn btn-sm btn-primary btn-wide w-full mt-3">submit</button>
        </form>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button (click)="closeForm()">close</button>
      </form>
    </dialog>
  `,
  styleUrl: './character-form.component.scss',
})
export class CharacterFormComponent implements OnInit {
  @Input() characterId!: string;
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();
  @ViewChild('dialogRef') dialogRef!: ElementRef<HTMLDialogElement>;
  characterForm!: FormGroup;
  characterService = inject(CharacterService);
  characterEventService = inject(CharacterEventService);
  appEventService = inject(AppEventService);
  availableClasses: string[] = AVAILABLE_CLASSES;
  availableProfessions: string[] = AVAILABLE_PROFESSIONS;

  constructor(private formBuilder: FormBuilder) {}

  async ngOnInit(): Promise<void> {
    this.characterForm = this.formBuilder.group({
      id: [{ value: this.characterId, disabled: true }],
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(15)]],
      level: [1, [Validators.required, Validators.min(1), Validators.max(60)]],
      class: ['', Validators.required],
      professions: this.formBuilder.array([]),
    });

    await this.loadCharacter();
  }
  ngAfterViewInit(): void {
    this.dialogRef.nativeElement.showModal();
  }

  async loadCharacter() {
    if (this.characterId != 'new') {
      await this.characterService.getCharacterById(this.characterId).then((character: Character) => {
        this.characterForm.patchValue({ id: character.id, name: character.name, class: character.class, level: character.level });
        character.professions.forEach(profession => {
          this.addProfession(profession);
        });
      });
    } else {
      this.characterForm.patchValue({ id: await this.characterService.getNextDbId() });
      this.addProfession();
    }
  }
  get professions(): FormArray {
    return this.characterForm.get('professions') as FormArray;
  }
  removeProfession(index: number): void {
    this.professions.removeAt(index);
  }
  addProfession(profession: Profession = { name: '', level: 0, note: '' }): void {
    const professionFormGroup = this.formBuilder.group({
      name: [profession.name || '', [Validators.required, Validators.minLength(1), Validators.maxLength(15)]],
      level: [profession.level || 0, [Validators.required, Validators.min(1), Validators.max(60)]],
      note: [profession.note || ''],
    });
    this.professions.push(professionFormGroup);
  }

  onSubmit(): void {
    console.log(this.characterForm.value);

    if (!this.characterForm.valid) {
      const formData = this.characterForm.getRawValue() as Character;
      this.saveCharacter(formData);
    } else {
      //button should be disabled if invalid, remove whole if block after implementing validation
      this.appEventService.notifyShowToast({ message: `Toast is not valid, check for errors`, severity: 'warning' });
    }
  }
  async saveCharacter(formData: Character) {
    const isCreating = this.characterId === 'new';
    const operation = isCreating ? 'created' : 'updated';

    try {
      isCreating
        ? await this.characterService.createNewCharacter(formData)
        : await this.characterService.updateCharacter({ ...formData, id: this.characterId });

      this.appEventService.notifyShowToast({ message: `Character ${operation} successfully!`, severity: 'success' });
      this.characterEventService.notifyCharacterUpdated();
      this.submit.emit();
    } catch (error) {
      this.appEventService.notifyShowToast({ message: `Error ${operation} character`, severity: 'error' });
    }
  }

  closeForm(): void {
    this.dialogRef.nativeElement.close();
    this.close.emit();
  }

  get name() {
    return this.characterForm.get('name') ?? '';
  }
}
