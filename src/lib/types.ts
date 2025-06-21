export interface Donation {
  id: string;
  donorId: string;
  donorName: string;
  recipientId: string;
  recipientName: string;
  amount: number;
  date: string;
  purpose: string;
  status: 'Pending' | 'Reported';
  usageDetails?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}
