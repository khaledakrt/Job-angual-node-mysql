import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Candidate } from '../../../models/candidate.model';
import { CandidateService } from '../../../services/candidate.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class CandidateProfileComponent implements OnInit {
  profile!: Candidate;
  loading = true;
  error = '';

  // Flags pour l'édition de chaque section
  editPersonalInfo = false;
  editResume = false;
  editEducation = false;
  editExperience = false;
  editSkills = false;

  // Champs temporaires pour textarea
  educationText = '';
  skillsText = '';

  constructor(private candidateService: CandidateService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.candidateService.getProfile().subscribe(
      (data: Candidate) => {
        this.profile = data;
        this.loading = false;

        // Initialiser les textes pour les sections éditables
        this.educationText = this.profile.education
          ?.map(e => `${e.degree} - ${e.institution} - ${e.year}`)
          .join('\n') || '';
        this.skillsText = this.profile.skills?.join(', ') || '';
      },
      (err: any) => {
        this.error = 'Impossible de charger le profil.';
        this.loading = false;
        console.error(err);
      }
    );
  }

  saveProfile(): void {
    this.candidateService.updateProfile(this.profile).subscribe(
      (data: Candidate) => {
        this.profile = data;
        this.editPersonalInfo = false;
        this.editResume = false;
        this.editEducation = false;
        this.editExperience = false;
        this.editSkills = false;
      },
      (err: any) => {
        this.error = 'Impossible de sauvegarder le profil.';
        console.error(err);
      }
    );
  }

  saveEducation(): void {
    this.profile.education = this.educationText.split('\n').map(line => {
      const [degree, institution, year] = line.split(' - ');
      return { degree, institution, year };
    });
    this.editEducation = false;
    this.saveProfile();
  }

  // ------------------------
  // Expériences
  // ------------------------
  toggleEditExperience(): void {
    this.editExperience = !this.editExperience;
  }

  addExperience(): void {
    if (!this.profile.experience) this.profile.experience = [];
    this.profile.experience.push({
      id: 0,
      Usr_id: this.profile.userId,
      title: '',
      company: '',
      start_date: '',
      end_date: '',
      description: ''
    });
  }

  removeExperience(index: number): void {
    if (!this.profile.experience) return;
    this.profile.experience.splice(index, 1);
  }

  saveExperience(): void {
    if (!this.profile.experience) return;

    // Nettoyer les champs vides
    this.profile.experience = this.profile.experience.map(exp => ({
      id: exp.id || 0,
      Usr_id: this.profile.userId,
      title: exp.title || '',
      company: exp.company || '',
      start_date: exp.start_date || '',
      end_date: exp.end_date || '',
      description: exp.description || ''
    }));

    this.editExperience = false;
    this.saveProfile();
  }

  cancelEditExperience(): void {
    this.editExperience = false;
    this.loadProfile(); // Recharger pour annuler les modifications
  }

  saveSkills(): void {
    this.profile.skills = this.skillsText.split(',').map(s => s.trim());
    this.editSkills = false;
    this.saveProfile();
  }
}
