import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { JobsComponent } from './pages/jobs/jobs.component';

import { RecruiterProfileComponent } from './pages/recruiter/profile/profile.component';
import { DashboardComponent } from './pages/recruiter/dashboard/dashboard.component';
import { CandidateProfileComponent } from './pages/candidate/profile/profile.component';

import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Public
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'jobs', component: JobsComponent },

  // CANDIDATE
  {
    path: 'candidate/profile',
    component: CandidateProfileComponent,
    canActivate: [AuthGuard],
    data: { role: 'candidate' }
  },

  // RECRUITER
  {
    path: 'recruiter/profile',
    component: RecruiterProfileComponent,
    canActivate: [AuthGuard],
    data: { role: 'recruiter' }
  },
  {
    path: 'recruiter/dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { role: 'recruiter' }
  },

  // fallback
  { path: '**', redirectTo: '' }
];
