import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-chip-input',
  templateUrl: './chip-input.component.html',
  styleUrls: ['./chip-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChipInputComponent),
      multi: true,
    },
  ],
})
export class ChipInputComponent implements OnInit, ControlValueAccessor {
  separatorKeysCodes: number[] = [ENTER, COMMA];

  items: string[] = [];
  onChange: any;
  onTouched: any;

  constructor() {}

  ngOnInit(): void {}

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim().toLowerCase();

    if (this.items.includes(value)) return;

    if (value) {
      this.items.push(value);
      this.propagateChange(this.items);
      this.propagateTouch();
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(item: string): void {
    const index = this.items.indexOf(item);

    if (index >= 0) {
      this.items.splice(index, 1);
      this.propagateChange(this.items);
    }
  }

  // ControlValueAccessor interface implementation

  writeValue(value: string[]): void {
    this.items = value ?? [];
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  propagateChange(value: string[]) {
    if (this.onChange) {
      this.onChange(value);
    }
  }

  propagateTouch(): void {
    if (this.onTouched) {
      this.onTouched();
    }
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
