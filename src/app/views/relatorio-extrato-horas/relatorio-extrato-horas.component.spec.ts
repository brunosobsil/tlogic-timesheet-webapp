import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioExtratoHorasComponent } from './relatorio-extrato-horas.component';

describe('RelatorioExtratoHorasComponent', () => {
  let component: RelatorioExtratoHorasComponent;
  let fixture: ComponentFixture<RelatorioExtratoHorasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelatorioExtratoHorasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatorioExtratoHorasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
