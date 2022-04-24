import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashflowComponent } from './cashflow.component';

describe('BalanceComponent', () => {
  let component: CashflowComponent;
  let fixture: ComponentFixture<CashflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CashflowComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
