/* export interface Recruiter {
  id: number;
  name: string;
  email: string;
  company: string;
}
 */

// frontend/src/app/models/recruiter.model.ts
export interface Recruiter {
  id: number;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  role?: string;
  description?: string;
  website?: string;
  avatar?: string; // ✅ ajouté pour l'upload
}
