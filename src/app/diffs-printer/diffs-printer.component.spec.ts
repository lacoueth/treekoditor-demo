import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiffsPrinterComponent } from './diffs-printer.component';

describe('DiffsPrinterComponent', () => {
  let component: DiffsPrinterComponent;
  let fixture: ComponentFixture<DiffsPrinterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiffsPrinterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiffsPrinterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
