export interface Application {
  id: number;
  jobId: number;
  candidateId: number;
  status: 'pending' | 'accepted' | 'rejected';
}
