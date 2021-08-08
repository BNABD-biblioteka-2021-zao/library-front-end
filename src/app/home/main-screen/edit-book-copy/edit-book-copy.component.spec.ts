import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBookCopyComponent } from './edit-book-copy.component';

describe('EditBookCopyComponent', () => {
  let component: EditBookCopyComponent;
  let fixture: ComponentFixture<EditBookCopyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditBookCopyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBookCopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
