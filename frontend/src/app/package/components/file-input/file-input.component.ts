import {
  Component,
  ElementRef,
  forwardRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileInputComponent),
      multi: true,
    },
  ],
})
export class FileInputComponent implements OnInit, ControlValueAccessor {
  @ViewChild('uploadFileInput') uploadFileInput: ElementRef;
  selectedFileName = 'Select File';

  onChange: any;
  onTouched: any;

  constructor() {}

  ngOnInit(): void {}

  onFileChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      this.selectedFileName = file.name;

      this.propagateChange(file);

      this.uploadFileInput.nativeElement.value = '';
    } else {
      this.selectedFileName = 'Select File';
    }
  }

  // ControlValueAccessor interface implementation

  writeValue(value: string): void {
    this.selectedFileName = value ?? 'Select File';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  propagateChange(value: string) {
    if (this.onChange) {
      this.onChange(value);
    }
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
