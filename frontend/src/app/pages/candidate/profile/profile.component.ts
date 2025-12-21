// frontend/src/app/pages/candidate/profile/profile.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CandidateService } from '../../../services/candidate.service';
import { Candidate } from '../../../models/candidate.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class CandidateProfileComponent implements OnInit {
  profile: Candidate = {
    id: 0,
    userId: 0,
    phone: '',
    address: '',
    summary: '',
    User: { name: '', email: '', role: '', profilephoto: '' },
    diplomas: [],
    formationsPrivees: [],
    experience: [],
    competences: [],
    education: [],
    skills: []
  };

  loading = true;
  error = '';

  editPersonalInfo = false;
  editResume = false;
  editEducation = false;
  editExperience = false;
  editSkills = false;

  educationText = '';
  skillsText = '';

  constructor(private candidateService: CandidateService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.candidateService.getProfile().subscribe({
      next: (data: any) => {
        this.profile = {
          id: data.id,
          userId: data.user?.id || 0,
          phone: data.phone || '',
          address: data.address || '',
          summary: data.summary || '',
          User: {
            name: data.user?.name || '',
            email: data.user?.email || '',
            role: data.user?.role || '',
            profilephoto: data.user?.profile_photo || ''
          },
          diplomas: data.diplomas || [],
          formationsPrivees: data.formationsPrivees || [],
          experience: (data.experiences || []).map((exp: any) => ({
            id: exp.id || 0,
            Usr_id: exp.user_id || 0,
            title: exp.title || '',
            company: exp.company || '',
            start_date: exp.startDate || '', // ← correspondance avec le backend si nécessaire
            end_date: exp.endDate || '',
            description: exp.description || ''
          })),
          competences: data.competences || [],
          education: data.diplomas?.map((d: any) => ({
            degree: d.level,
            institution: d.university,
            year: d.year
          })) || [],
          skills: data.skills || []
        };

        this.educationText = (this.profile.education || [])
          .map(e => `${e.degree} - ${e.institution} - ${e.year}`)
          .join('\n');

        this.skillsText = (this.profile.skills || []).join(', ');
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Impossible de charger le profil.';
        console.error(err);
        this.loading = false;
      }
    });
  }

  saveProfile(): void {
    this.candidateService.updateProfile(this.profile).subscribe({
      next: (data: Candidate) => {
        this.profile = data;
        this.editPersonalInfo = false;
        this.editResume = false;
        this.editEducation = false;
        this.editExperience = false;
        this.editSkills = false;
      },
      error: (err) => {
        this.error = 'Impossible de sauvegarder le profil.';
        console.error(err);
      }
    });
  }

  saveEducation(): void {
    this.profile.education = this.educationText.split('\n').map(line => {
      const [degree, institution, year] = line.split(' - ');
      return { degree, institution, year };
    });
    this.editEducation = false;
    this.saveProfile();
  }

  toggleEditExperience(): void {
    this.editExperience = !this.editExperience;
  }

    addExperience(): void {
    this.profile.experience = this.profile.experience || [];
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
    this.loadProfile();
  }

  saveSkills(): void {
    this.profile.skills = this.skillsText.split(',').map(s => s.trim());
    this.editSkills = false;
    this.saveProfile();
  }
}
