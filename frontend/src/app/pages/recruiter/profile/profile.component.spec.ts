import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterProfileComponent } from './profile.component';

describe('Profile', () => {
  let component: RecruiterProfileComponent;
  let fixture: ComponentFixture<RecruiterProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecruiterProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecruiterProfileComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
