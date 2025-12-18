import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Pour *ngFor et date pipe
import { Router } from '@angular/router';
import { Job, JobService } from '../../services/job.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true, // si tu utilises Angular 15+ standalone components
  imports: [CommonModule], // nécessaire pour *ngFor, pipes
})
export class HomeComponent implements OnInit {
  jobs: Job[] = [];

  constructor(private jobService: JobService, private router: Router) {}

  ngOnInit(): void {
    this.loadLatestJobs();
  }

  loadLatestJobs() {
    this.jobService.getLatestJobs().subscribe({
      next: (data: Job[]) => this.jobs = data,
      error: (err: any) => console.error('Erreur lors du chargement des offres :', err)
    });
  }

  // Méthode pour naviguer vers la page détails
  viewJob(id: number) {
    this.router.navigate(['/offres', id]);
  }
}
