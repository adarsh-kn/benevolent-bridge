import type { User, Donation } from './types';

export const mockUsers: Record<string, User> = {
  'donor-1': {
    id: 'donor-1',
    name: 'Adarsh',
    email: 'adarsh@example.com',
    avatarUrl: 'https://placehold.co/100x100/6FBFF2/424242.png',
  },
  'recipient-1': {
    id: 'recipient-1',
    name: 'Maria Garcia',
    email: 'maria.g@example.com',
    avatarUrl: 'https://placehold.co/100x100/A2E8A5/424242.png',
  },
};

export const mockDonations: Donation[] = [
  {
    id: 'donation-1',
    donorId: 'donor-1',
    donorName: 'Adarsh',
    recipientId: 'recipient-1',
    recipientName: 'Maria Garcia',
    amount: 150.0,
    date: '2024-05-01',
    purpose: 'Purchase of textbooks and school supplies for underprivileged students.',
    status: 'Reported',
    usageDetails: 'Purchased 15 mathematics textbooks, 20 notebooks, and a bulk set of pens and pencils for the community learning center.',
  },
  {
    id: 'donation-2',
    donorId: 'donor-1',
    donorName: 'Adarsh',
    recipientId: 'recipient-1',
    recipientName: 'Maria Garcia',
    amount: 200.0,
    date: '2024-06-15',
    purpose: 'Funding for a community garden project to provide fresh produce.',
    status: 'Pending',
  },
  {
    id: 'donation-3',
    donorId: 'donor-2',
    donorName: 'John Smith',
    recipientId: 'recipient-1',
    recipientName: 'Maria Garcia',
    amount: 75.0,
    date: '2024-07-20',
    purpose: 'Support for the local animal shelter\'s vaccination drive.',
    status: 'Reported',
    usageDetails: 'Funded vaccinations for 10 rescued cats and dogs.',
  },
  {
    id: 'donation-4',
    donorId: 'donor-1',
    donorName: 'Adarsh',
    recipientId: 'recipient-2',
    recipientName: 'Community Kitchen',
    amount: 300.0,
    date: '2024-07-22',
    purpose: 'To provide warm meals for the homeless during the week.',
    status: 'Pending',
  },
];

export const getDonationsByDonor = (donorId: string): Donation[] => {
  return mockDonations.filter((d) => d.donorId === donorId);
};

export const getDonationsByRecipient = (recipientId: string): Donation[] => {
  return mockDonations.filter((d) => d.recipientId === recipientId);
};

export const getDonationById = (donationId: string): Donation | undefined => {
  return mockDonations.find((d) => d.id === donationId);
};

export const getDonorUser = (): User => mockUsers['donor-1'];
export const getRecipientUser = (): User => mockUsers['recipient-1'];
