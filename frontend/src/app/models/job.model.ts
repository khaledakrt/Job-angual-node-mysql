// frontend/src/app/services/job.model.ts
// frontend/src/app/services/job.model.ts
export interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  salary: string;
  type: string;
  status: string;
  expiryDate?: string;
  experience?: number;    // ← nouvelle colonne pour les années d'expérience
  recruiter?: {          
    company: string;      // récupère le nom de l'entreprise
  };
}
