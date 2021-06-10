import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportarFeriadosComponent } from './importar-feriados.component';

describe('ImportarFeriadosComponent', () => {
  let component: ImportarFeriadosComponent;
  let fixture: ComponentFixture<ImportarFeriadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportarFeriadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportarFeriadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
