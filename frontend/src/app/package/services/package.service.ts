import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BehaviorSubject, map, catchError, throwError, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  ErrorDialogComponent,
  ErrorDialogData,
} from '../components/UI/error-dialog/error-dialog.component';
import { Package, transformFromJson } from '../model/package.model';

const BACKEND_URL = environment.apiUrl + '/packages/';

@Injectable({ providedIn: 'root' })
export class PackageService {
  //Search Result State
  private _searchResults = new BehaviorSubject<Package[]>([]);
  readonly searchResults = this._searchResults.asObservable();
  private storedSearchResults: Package[] = [];

  //Loading State
  private _isLoading = new BehaviorSubject<boolean>(false);
  readonly isLoading = this._isLoading.asObservable();

  //Package By ID
  private _packageByIdSubject = new Subject<Package>();
  readonly packageByIdObs = this._packageByIdSubject.asObservable();

  private selectedFilter: any = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {}

  loadPackages(filter: any) {
    let params = new HttpParams();

    Object.keys(filter).forEach((k) => {
      if (typeof filter[k] === 'object') {
        filter[k].forEach(
          (item: string) => (params = params.append(`${k}[]`, item))
        );
      } else {
        params = params.append(k, filter[k]);
      }
    });

    this.selectedFilter = filter;
    this._isLoading.next(true);

    this.http
      .get<{ results: any[]; count: number; filter: any }>(
        BACKEND_URL + 'list?' + params.toString()
      )
      .pipe(
        map((response) => {
          return response.results.map((data) => {
            return transformFromJson(data);
          });
        }),
        catchError((error) => this.handleHttpError(error))
      )
      .subscribe((response) => {
        this._isLoading.next(false);
        this.storedSearchResults = [...response];
        this._searchResults.next([...response]);
      });
  }

  addPackage(newPackage: Package) {
    this._isLoading.next(true);

    const packageData = new FormData();
    packageData.append('title', newPackage.title);
    packageData.append('type', newPackage.type);
    packageData.append('version', newPackage.version);
    newPackage.supportedDevices.forEach((device) =>
      packageData.append('supportedDeviceTypes[]', device)
    );
    packageData.append('file', newPackage.file!, newPackage.file?.name);

    this.http
      .post<{ message: string; newPackage: any }>(
        BACKEND_URL + 'create',
        packageData
      )
      .pipe(catchError((error) => this.handleHttpError(error)))
      .subscribe((response) => {
        const createdPackage = transformFromJson(response.newPackage);
        if (this.shouldAddNewPackageToSearchResults(createdPackage)) {
          this.storedSearchResults.push(createdPackage);
          this._searchResults.next([...this.storedSearchResults]);
        }

        this.router.navigate(['/list-packages']);
        this._isLoading.next(false);
        this._snackBar.open('Package created successfully', 'close', {
          duration: 3000,
        });
      });
  }

  getPackageById(id: string) {
    this._isLoading.next(true);

    // Check if Package is already there
    let pack = this.storedSearchResults.find((p) => p.id === id);

    if (pack) {
      this._packageByIdSubject.next(pack);
      this._isLoading.next(false);
      return;
    }

    this.http
      .get<Package>(`${BACKEND_URL}get-by-id?id=${id}`)
      .pipe(
        map((data: any) => {
          return transformFromJson(data.package);
        }),
        catchError((error) => this.handleHttpError(error))
      )
      .subscribe((pack) => {
        this._packageByIdSubject.next(pack);
        this._isLoading.next(false);
      });
  }

  updatePackage(updatedPackage: Package) {
    this._isLoading.next(true);

    const payload = {
      packageId: updatedPackage.id,
      type: updatedPackage.type,
      title: updatedPackage.title,
      version: updatedPackage.version,
      supportedDeviceTypes: updatedPackage.supportedDevices,
    };

    this.http
      .put(BACKEND_URL + 'update', payload)
      .pipe(catchError((error) => this.handleHttpError(error)))
      .subscribe((resposne) => {
        if (this.selectedFilter) {
          this.loadPackages(this.selectedFilter);
        }

        this.router.navigate(['/list-packages']);
        this._isLoading.next(false);
        this._snackBar.open('Package updated successfully', 'close', {
          duration: 3000,
        });
      });
  }

  deletePackage(packageId: string) {
    this._isLoading.next(true);

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        packageId,
      },
    };

    this.http
      .delete(BACKEND_URL + 'delete', options)
      .pipe(catchError((error) => this.handleHttpError(error)))
      .subscribe((response) => {
        const packageIndex = this.storedSearchResults
          .map((pack) => pack.id)
          .indexOf(packageId);
        this.storedSearchResults.splice(packageIndex, 1);
        this._searchResults.next([...this.storedSearchResults]);

        this._isLoading.next(false);
        this._snackBar.open('Package deleted successfully', 'close', {
          duration: 3000,
        });
      });
  }

  getSelectedFilter() {
    return this.selectedFilter;
  }

  private shouldAddNewPackageToSearchResults(createdPackage: Package): boolean {
    if (!this.selectedFilter) return false;
    if (this.selectedFilter.type !== createdPackage.type) return false;
    if (
      this.selectedFilter?.version &&
      this.selectedFilter.version !== createdPackage.version
    )
      return false;
    if (
      this.selectedFilter?.supportedDeviceType &&
      JSON.stringify(this.selectedFilter.supportedDeviceType) !==
        JSON.stringify(createdPackage.supportedDevices)
    )
      return false;
    return true;
  }

  private handleHttpError(error: any) {
    this._isLoading.next(false);

    let message = '';
    let title = 'An Error Occurred!';

    if (error?.error && error.error instanceof ErrorEvent) {
      message = error.error.message;
      console.log(error.error.message);
    } else {
      console.log(error.message);
      message = error.message;
      if (error.status === 404) {
        title = '404';
        message = 'Package not found';
      }
    }

    const dialogData = new ErrorDialogData(title, message);
    this.dialog.open(ErrorDialogComponent, {
      maxWidth: '400px',
      data: dialogData,
    });

    return throwError(() => error);
  }
}
