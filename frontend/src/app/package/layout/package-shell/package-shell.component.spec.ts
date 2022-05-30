import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageShellComponent } from './package-shell.component';

describe('PackageShellComponent', () => {
  let component: PackageShellComponent;
  let fixture: ComponentFixture<PackageShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackageShellComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
