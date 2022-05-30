import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Package } from '../../model/package.model';
import { PackageService } from '../../services/package.service';

@Component({
  selector: 'app-edit-package',
  templateUrl: './edit-package.component.html',
  styleUrls: ['./edit-package.component.scss'],
})
export class EditPackageComponent implements OnInit, OnDestroy {
  packageByIdSub: Subscription;
  editPackage: Package;
  isLoading$: Observable<boolean>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private packageService: PackageService
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.packageService.isLoading;
    this.activatedRoute.params.subscribe((params) => {
      const id = params['id'];
      this.packageByIdSub = this.packageService.packageByIdObs.subscribe(
        (editPackage) => {
          this.editPackage = editPackage;
        }
      );
      this.packageService.getPackageById(id);
    });
  }

  onFormData(data: any) {
    this.packageService.updatePackage(data as Package);
  }

  ngOnDestroy(): void {
    if (this.packageByIdSub) {
      this.packageByIdSub.unsubscribe();
    }
  }
}
