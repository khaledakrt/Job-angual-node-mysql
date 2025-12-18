import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authServiceStub: Partial<AuthService>;

  beforeEach(async () => {
    // Stub du service AuthService
    authServiceStub = {
      isLoggedIn$: of(true),
      getUser: () => ({ id: 1, role: 'recruiter' }) // <-- id ajouté
    };

    await TestBed.configureTestingModule({
      imports: [NavbarComponent, RouterTestingModule],
      providers: [{ provide: AuthService, useValue: authServiceStub }]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show Dashboard link for recruiter', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('a[href="/dashboard"]')).toBeTruthy();
  });
});
