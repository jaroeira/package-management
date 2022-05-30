import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PackageShellComponent } from './layout/package-shell/package-shell.component';

// Page Components
import { HomeComponent } from './pages/home/home.component';
import { ListPackagesComponent } from './pages/list-packages/list-packages.component';
import { AddPackageComponent } from './pages/add-package/add-package.component';
import { EditPackageComponent } from './pages/edit-package/edit-package.component';

const routes: Routes = [
  {
    path: '',
    component: PackageShellComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'list-packages', component: ListPackagesComponent },
      { path: 'add-package', component: AddPackageComponent },
      { path: 'edit-package/:id', component: EditPackageComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PackageRoutingModule {}
