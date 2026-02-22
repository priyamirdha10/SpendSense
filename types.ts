
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export enum LockDuration {
  THREE_DAYS = 3,
  SEVEN_DAYS = 7,
  THIRTY_DAYS = 30
}

export interface LockedProduct {
  id: string;
  url: string;
  name: string;
  price: number;
  lockedAt: number; // timestamp
  duration: LockDuration;
  expiresAt: number; // timestamp
  status: 'locked' | 'completed' | 'broken';
}

export interface SpendingStats {
  totalLocked: number;
  totalCompleted: number;
  totalBroken: number;
  totalSaved: number;
  totalPenalties: number;
}

export interface MonthlyData {
  month: string;
  savings: number;
  penalties: number;
}
