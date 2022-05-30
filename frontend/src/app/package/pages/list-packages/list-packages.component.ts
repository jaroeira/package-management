import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Package } from '../../model/package.model';
import { PackageService } from '../../services/package.service';
import { Observable } from 'rxjs';

import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../components/UI/confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-packages',
  templateUrl: './list-packages.component.html',
  styleUrls: ['./list-packages.component.scss'],
})
export class ListPackagesComponent implements OnInit {
  packages$: Observable<Package[]>;
  isLoading$: Observable<Boolean>;
  firstLoad: any = true;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private packageService: PackageService
  ) {}

  ngOnInit(): void {
    this.packages$ = this.packageService.searchResults;
    this.isLoading$ = this.packageService.isLoading;
  }

  onEditClicked(packageId: any) {
    this.router.navigate(['/edit-package/' + packageId]);
  }
  onDeleteClicked(packageId: any) {
    const title = 'Delete Package';
    const message = 'Are you sure?';

    const dialogData = new ConfirmDialogData(title, message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        this.packageService.deletePackage(packageId);
      }
    });
  }

  onFilterSelected(event: any) {
    const filter: { [k: string]: any } = {};
    filter['type'] = event.packageType;
    if (event?.packageVersion) filter['version'] = event.packageVersion;
    if (event?.supportedDevices && event.supportedDevices.length > 0)
      filter['supportedDeviceType'] = [...event.supportedDevices] as string[];
    this.packageService.loadPackages(filter);
    this.firstLoad = this.packageService.getSelectedFilter() === null;
  }
}
