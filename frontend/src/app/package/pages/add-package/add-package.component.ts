import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Package } from '../../model/package.model';
import { PackageService } from '../../services/package.service';

@Component({
  selector: 'app-add-package',
  templateUrl: './add-package.component.html',
  styleUrls: ['./add-package.component.scss'],
})
export class AddPackageComponent implements OnInit {
  isLoading$: Observable<Boolean>;

  constructor(private packageService: PackageService) {}

  ngOnInit(): void {
    this.isLoading$ = this.packageService.isLoading;
  }

  onFormData(data: any) {
    console.log(data as Package);
    this.packageService.addPackage(data as Package);
  }
}
