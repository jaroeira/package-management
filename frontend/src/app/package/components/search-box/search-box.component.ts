import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PackageService } from '../../services/package.service';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss'],
})
export class SearchBoxComponent implements OnInit {
  form = new FormGroup({
    packageType: new FormControl(null, [Validators.required]),
    packageVersion: new FormControl(
      null,
      Validators.pattern(/^\d+(?:\.\d+){2}$/)
    ),
    supportedDevices: new FormControl(null),
  });

  @Output() filterSelected = new EventEmitter<{}>();

  constructor(private packageService: PackageService) {}

  ngOnInit(): void {
    const filter = this.packageService.getSelectedFilter();
    if (filter) {
      this.packageType?.setValue(filter?.type);
      this.packageVersion?.setValue(filter?.version);
      this.supportedDevices?.setValue(filter?.supportedDeviceType);
    }
  }

  onFilter(formDirective: FormGroupDirective) {
    if (!this.form.valid) return;

    this.filterSelected.emit({
      packageType: this.form.value.packageType,
      packageVersion: this.form.value.packageVersion,
      supportedDevices: this.form.value.supportedDevices,
    });
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
}
