
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  upiId: string;
  balance: number;
  lastInterestDate: number;
  joinedAt: number;
}

export interface Transaction {
  id: string;
  senderUid: string;
  senderName: string;
  senderUpiId: string;
  receiverUid: string;
  receiverName: string;
  receiverUpiId: string;
  amount: number;
  timestamp: number;
  note: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
}

export interface AppSettings {
  interestRate: number; // Daily interest rate (e.g., 0.0001 for 0.01%)
  bonusAmount: number;
}
