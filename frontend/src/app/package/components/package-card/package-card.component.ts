import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Package } from '../../model/package.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-package-card',
  templateUrl: './package-card.component.html',
  styleUrls: ['./package-card.component.scss'],
})
export class PackageCardComponent implements OnInit {
  @Input() package: Package;
  @Output() editPackage = new EventEmitter<string>();
  @Output() deletePackage = new EventEmitter<string>();

  fileDownloadUrl = '';

  constructor() {}

  ngOnInit(): void {
    this.fileDownloadUrl =
      environment.apiUrl + '/download/' + this.package.fileName;
  }

  onEdit() {
    this.editPackage.emit(this.package.id);
  }

  onDelete() {
    this.deletePackage.emit(this.package.id);
  }
}
