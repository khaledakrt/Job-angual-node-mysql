import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';

interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  salary: string;
  type: string;
  status: string;
  experience?: number;
  createdAt?: string | Date;
  expiryDate?: string | Date;
  applicationsCount?: number; // on laisse vide pour l'instant
}

interface Profile {
  name: string;
  company: string;
  stats: {
    jobsPublished: number;
    activeJobs: number;
    applicationsReceived: number;
  };
  jobs: Job[];
}

@Component({
  selector: 'app-recruiter-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  profile: Profile | null = null;
  loading = true;
  error: string | null = null;

  showCreateForm = false;
  newJob: Partial<Job> = { title: '', description: '', location: '', salary: '', type: 'full-time', experience: 0, expiryDate: '' };
// ✅ Ajouter cette ligne pour l'édition
  editingJob: Partial<Job> | null = null;
  showEditModal: boolean = false;
  constructor(private authService: AuthService, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadJobs();
  }

  loadJobs() {
    this.loading = true;
    this.error = null;

    const headers = this.authService.getAuthHeaders()?.headers;
    if (!headers) {
      this.error = 'Utilisateur non connecté ou token manquant';
      this.loading = false;
      return;
    }

    this.http.get<Job[]>('http://localhost:5000/jobs/my', { headers }).subscribe({
      next: (jobs) => {
        // Convertir les dates et gérer null
        const processedJobs = jobs.map(j => ({
          ...j,
          createdAt: j.createdAt ? new Date(j.createdAt) : undefined,
          expiryDate: j.expiryDate ? new Date(j.expiryDate) : undefined,
          applicationsCount: 0 // on laisse vide pour l'instant
        }));

        // Construire le profile réel
        this.profile = {
          name: 'Recruteur', // à remplacer si tu as le vrai nom via AuthService
          company: 'Entreprise', // idem
          stats: {
            jobsPublished: processedJobs.length,
            activeJobs: processedJobs.filter(j => !this.isJobExpired(j)).length,

            applicationsReceived: 0
          },
          jobs: processedJobs
        };
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur récupération des jobs', err);
        this.error = 'Impossible de charger les jobs';
        this.loading = false;
      }
    });
  }

  isJobExpired(job: Job): boolean {
    if (!job.expiryDate) return false;
    return new Date(job.expiryDate) < new Date();
  }

  editJob(job: Job) {
  this.editingJob = { ...job };
  this.showEditModal = true; // si tu veux un modal distinct pour l'édition
}
  deleteJob(jobId: number) {
    if (confirm('Voulez-vous vraiment supprimer ce job ?')) {
      console.log('Supprimer job', jobId);
    }
  }

  openCreateModal() {
    this.showCreateForm = true;
  }

  cancelCreate() {
    this.showCreateForm = false;
    this.newJob = { title: '', description: '', location: '', salary: '', type: 'full-time', experience: 0, expiryDate: '' };
    
    
  }

  submitJob() {
    const headers = this.authService.getAuthHeaders()?.headers;
    if (!headers || !this.profile) return;

    this.http.post<Job>('http://localhost:5000/jobs', this.newJob, { headers }).subscribe({
      next: (job) => {
        const newJobProcessed = {
          ...job,
          createdAt: job.createdAt ? new Date(job.createdAt) : new Date(),
          expiryDate: job.expiryDate ? new Date(job.expiryDate) : undefined,
          applicationsCount: 0
        };
        this.profile!.jobs.push(newJobProcessed);
        this.profile!.stats.jobsPublished += 1;
        if (job.status === 'active') this.profile!.stats.activeJobs += 1;
        this.cancelCreate();
      },
      error: (err) => console.error('Erreur création job', err)
    });
  }

  viewApplications() {
    this.router.navigate(['/recruiter/applications']);
  }
  saveJob() {
  if (!this.editingJob || !this.editingJob.id) return;

  const headers = this.authService.getAuthHeaders()?.headers;
  if (!headers) return;

  this.http.put<Job>(`http://localhost:5000/jobs/${this.editingJob.id}`, this.editingJob, { headers }).subscribe({
    next: (updatedJob) => {
      if (this.profile) {
        const index = this.profile.jobs.findIndex(j => j.id === updatedJob.id);
        if (index !== -1) {
          this.profile.jobs[index] = { ...updatedJob };
        }
      }
      this.cancelEdit(); // ferme le modal
    },
    error: (err) => console.error('Erreur sauvegarde job', err)
  });
}

cancelEdit() {
  this.editingJob = null;
  this.showEditModal = false;
}
}
