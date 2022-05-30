// Modules
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PackageRoutingModule } from './package-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Components
import { PackageShellComponent } from './layout/package-shell/package-shell.component';
import { HomeComponent } from './pages/home/home.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { ListPackagesComponent } from './pages/list-packages/list-packages.component';
import { SearchBoxComponent } from './components/search-box/search-box.component';
import { PackageFormComponent } from './components/package-form/package-form.component';
import { AddPackageComponent } from './pages/add-package/add-package.component';
import { ChipInputComponent } from './components/chip-input/chip-input.component';
import { FileInputComponent } from './components/file-input/file-input.component';
import { BackdropComponent } from './components/UI/backdrop/backdrop.component';
import { ConfirmDialogComponent } from './components/UI/confirm-dialog/confirm-dialog.component';
import { PackageCardComponent } from './components/package-card/package-card.component';
import { ErrorDialogComponent } from './components/UI/error-dialog/error-dialog.component';
import { EditPackageComponent } from './pages/edit-package/edit-package.component';

@NgModule({
  declarations: [
    PackageShellComponent,
    HomeComponent,
    FooterComponent,
    HeaderComponent,
    ListPackagesComponent,
    SearchBoxComponent,
    PackageFormComponent,
    AddPackageComponent,
    ChipInputComponent,
    FileInputComponent,
    BackdropComponent,
    ConfirmDialogComponent,
    PackageCardComponent,
    ErrorDialogComponent,
    EditPackageComponent,
  ],
  imports: [
    SharedModule,
    PackageRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class PackageModule {}
