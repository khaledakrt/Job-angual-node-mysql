import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobService } from '../../services/job.service';
import { Job } from '../../models/job.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit {
  jobs: Job[] = [];
  filteredJobs: Job[] = [];
  loading = true;
  error: string | null = null;

  searchTerm: string = ''; // <- ajout de la variable

  constructor(private jobService: JobService) {}
selectedJob: Job | null = null;

  ngOnInit() {
    this.loadJobs();
  }

  loadJobs() {
    this.loading = true;
    this.error = null;

    this.jobService.getAllJobs().subscribe({
      next: (jobs: Job[]) => {
        this.jobs = jobs;
        this.filteredJobs = jobs; // initialisation de filteredJobs
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur récupération des jobs', err);
        this.error = 'Impossible de charger les offres.';
        this.loading = false;
      }
    });
  }

  filterJobs() {
    const term = this.searchTerm.toLowerCase();
    this.filteredJobs = this.jobs.filter(job =>
      job.title.toLowerCase().includes(term) ||
      job.location?.toLowerCase().includes(term) ||
      job.recruiter?.company?.toLowerCase().includes(term)
    );
  }
  // 🔹 Variables pour la recherche avancée
showAdvanced = false;

advancedFilters = {
  city: '',
  specialty: '', 
  experience: '',
  salary: ''
};

// 🔹 Méthode pour appliquer la recherche avancée
applyAdvancedSearch() {
  this.filteredJobs = this.jobs.filter(job => {
    const expFilter = this.advancedFilters.experience ? Number(this.advancedFilters.experience) : null;
    const salaryFilter = this.advancedFilters.salary ? Number(this.advancedFilters.salary) : null;

    return (
      (!this.advancedFilters.city || job.location?.toLowerCase().includes(this.advancedFilters.city.toLowerCase())) &&
      (!this.advancedFilters.specialty || job.title?.toLowerCase().includes(this.advancedFilters.specialty.toLowerCase())) &&
      (!expFilter || (job.experience !== undefined && job.experience >= expFilter)) &&
      (!salaryFilter || (job.salary !== undefined && Number(job.salary) >= salaryFilter))
    );
  });
}
// 🔹 Ouvrir/fermer modal
  openJobModal(job: Job) {
    this.selectedJob = job;
  }

  closeJobModal() {
    this.selectedJob = null;
  }
}

