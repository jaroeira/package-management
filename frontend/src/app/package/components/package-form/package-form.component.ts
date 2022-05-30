import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Package } from '../../model/package.model';

@Component({
  selector: 'app-package-form',
  templateUrl: './package-form.component.html',
  styleUrls: ['./package-form.component.scss'],
})
export class PackageFormComponent implements OnInit {
  @Output() onFormData = new EventEmitter<Package>();
  @Input() editPackage: Package;

  form: FormGroup;

  constructor() {}

  ngOnInit(): void {
    this.createForm();
    if (this.editPackage) {
      this.form.setValue({
        packageTitle: this.editPackage.title,
        packageType: this.editPackage.type,
        packageVersion: this.editPackage.version,
        supportedDevices: this.editPackage.supportedDevices,
        uploadFile: null,
      });
    }
  }

  createForm(): void {
    this.form = new FormGroup({
      packageTitle: new FormControl(null, Validators.required),
      packageType: new FormControl(null, [Validators.required]),
      packageVersion: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d+(?:\.\d+){2}$/),
      ]),
      supportedDevices: new FormControl(null, Validators.required),
      uploadFile: this.editPackage
        ? new FormControl(null)
        : new FormControl(null, Validators.required),
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const packageData: Package = {
      title: this.form.value.packageTitle,
      type: this.form.value.packageType,
      version: this.form.value.packageVersion,
      supportedDevices: this.form.value.supportedDevices,
      fileName: this.form.value.uploadFile?.name,
      file: this.form.value.uploadFile,
    };

    if (this.editPackage) packageData.id = this.editPackage.id;

    this.onFormData.emit(packageData);
  }

  get packageTitle() {
    return this.form.get('packageTitle');
  }

  get packageType() {
    return this.form.get('packageType');
  }

  get packageVersion() {
    return this.form.get('packageVersion');
  }

  get supportedDevices() {
    return this.form.get('supportedDevices');
  }

  get uploadFile() {
    return this.form.get('uploadFile');
  }
}
