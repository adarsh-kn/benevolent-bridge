import type { User, Donation } from './types';

export const mockUsers: Record<string, User> = {
  'donor-1': {
    id: 'donor-1',
    name: 'Adarsh KN',
    email: 'adarsh.kn@example.com',
    avatarUrl: 'https://placehold.co/100x100/A9A2F8/424242.png',
  },
  'donor-2': {
    id: 'donor-2',
    name: 'Rohan Mehta',
    email: 'rohan.m@example.com',
    avatarUrl: 'https://placehold.co/100x100/bf6ff2/424242.png',
  },
  'recipient-1': {
    id: 'recipient-1',
    name: 'Priya Sharma',
    email: 'priya.s@example.com',
    avatarUrl: 'https://placehold.co/100x100/FFB347/424242.png',
  },
  'recipient-2': {
    id: 'recipient-2',
    name: 'Seva Kitchen',
    email: 'seva.kitchen@example.com',
    avatarUrl: 'https://placehold.co/100x100/f2bf6f/424242.png',
  },
  'recipient-3': {
    id: 'recipient-3',
    name: 'Gyan Foundation',
    email: 'gyan.foundation@example.com',
    avatarUrl: 'https://placehold.co/100x100/e8a2a2/424242.png',
  }
};

export let mockDonations: Donation[] = [
  {
    id: 'donation-1',
    donorId: 'donor-1',
    donorName: 'Adarsh KN',
    recipientId: 'recipient-1',
    recipientName: 'Priya Sharma',
    amount: 12500.0,
    date: '2024-05-01',
    purpose: 'Purchase of textbooks and school supplies for underprivileged students.',
    status: 'Reported',
    usageDetails: 'Purchased 15 mathematics textbooks, 20 notebooks, and a bulk set of pens and pencils for the community learning center.',
  },
  {
    id: 'donation-2',
    donorId: 'donor-1',
    donorName: 'Adarsh KN',
    recipientId: 'recipient-1',
    recipientName: 'Priya Sharma',
    amount: 15000.0,
    date: '2024-06-15',
    purpose: 'Funding for a community garden project to provide fresh produce.',
    status: 'Pending',
  },
  {
    id: 'donation-3',
    donorId: 'donor-2',
    donorName: 'Rohan Mehta',
    recipientId: 'recipient-1',
    recipientName: 'Priya Sharma',
    amount: 5000.0,
    date: '2024-07-20',
    purpose: 'Support for the local animal shelter\'s vaccination drive.',
    status: 'Reported',
    usageDetails: 'Funded vaccinations for 10 rescued cats and dogs.',
  },
  {
    id: 'donation-4',
    donorId: 'donor-1',
    donorName: 'Adarsh KN',
    recipientId: 'recipient-2',
    recipientName: 'Seva Kitchen',
    amount: 25000.0,
    date: '2024-07-22',
    purpose: 'To provide warm meals for the homeless during the week.',
    status: 'Pending',
  },
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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


export const getAllRecipients = (): User[] => {
    return Object.values(mockUsers).filter((user) => user.id.startsWith('recipient-'));
};

export const addRecipient = (name: string): User => {
    const newId = `recipient-${Object.values(mockUsers).filter(u => u.id.startsWith('recipient-')).length + 1}`;
    const newUser: User = {
        id: newId,
        name: name,
        email: `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        avatarUrl: `https://placehold.co/100x100/cccccc/424242.png`,
    };
    mockUsers[newId] = newUser;
    return newUser;
};

export const addDonation = (donationData: {
    donorId: string;
    recipientId?: string;
    amount: number;
    purpose: string;
    newRecipientName?: string;
}) => {
    const donor = mockUsers[donationData.donorId];
    let recipient: User | undefined;

    if (donationData.newRecipientName) {
        recipient = addRecipient(donationData.newRecipientName);
    } else if (donationData.recipientId) {
        recipient = mockUsers[donationData.recipientId];
    }

    if (!donor || !recipient) {
        throw new Error("Invalid donor or recipient ID");
    }

    const newDonation: Donation = {
        id: `donation-${mockDonations.length + 1}`,
        donorId: donationData.donorId,
        donorName: donor.name,
        recipientId: recipient.id,
        recipientName: recipient.name,
        amount: donationData.amount,
        date: new Date().toISOString().split('T')[0],
        purpose: donationData.purpose,
        status: 'Pending',
    };

    mockDonations.push(newDonation);
    mockDonations.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return newDonation;
}

export const updateDonationReport = (donationId: string, usageDetails: string): Donation | null => {
  const donationIndex = mockDonations.findIndex((d) => d.id === donationId);
  if (donationIndex !== -1) {
    mockDonations[donationIndex].status = 'Reported';
    mockDonations[donationIndex].usageDetails = usageDetails;
    return mockDonations[donationIndex];
  }
  return null;
};
