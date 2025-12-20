/* export interface Candidate {
  id: number;
  name: string;
  email: string;
  resumeUrl?: string;
}
 */


// frontend/src/app/models/candidate.model.ts
/* export interface Candidate {
  id: number;
  userId: number;
  phone: string;
  address: string;
  resumeUrl?: string; // si tu gères le CV plus tard
  User: {
    name: string;
    email: string;
    role: string;
    profilephoto?: string; // si tu veux afficher l’avatar
  };
}
 */


// frontend/src/app/models/candidate.model.ts

export interface Candidate {
  id: number;
  userId: number;
  phone: string;
  address: string;
  User: {
    name: string;
    email: string;
    role: string;
    profilephoto?: string;
  };
  resume?: string;
  education?: { degree: string; institution: string; year: string }[];
  experience?: {
    id: number;
    Usr_id: number;
    title: string;
    company: string;
    start_date: string;
    end_date: string;
    description: string;
  }[];
  skills?: string[];
}



export interface Job {
  id: number;
  title: string;
  description: string;
  company: string;
}

export interface Application {
  id: number;
  jobId: number;
  candidateId: number;
  status: string;
}
