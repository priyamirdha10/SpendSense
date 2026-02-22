
import { LockedProduct, SpendingStats, User, MonthlyData } from '../types';

const KEYS = {
  USER: 'spendsense_user',
  LOCKS: 'spendsense_locks',
  NOTIFS: 'spendsense_notifications',
};

export interface Notification {
  id: string;
  text: string;
  time: number;
  read: boolean;
}

export const Storage = {
  getUser: (): User => {
    const data = localStorage.getItem(KEYS.USER);
    return data ? JSON.parse(data) : { id: '1', name: 'Alex Johnson', email: 'alex@example.com' };
  },
  setUser: (user: User | null) => {
    if (user) localStorage.setItem(KEYS.USER, JSON.stringify(user));
    else localStorage.removeItem(KEYS.USER);
  },
  getLocks: (): LockedProduct[] => {
    const data = localStorage.getItem(KEYS.LOCKS);
    const locks: LockedProduct[] = data ? JSON.parse(data) : [];
    
    // Auto-update status based on time
    let changed = false;
    const updated = locks.map(lock => {
      if (lock.status === 'locked' && Date.now() >= lock.expiresAt) {
        changed = true;
        return { ...lock, status: 'completed' as const };
      }
      return lock;
    });

    if (changed) {
      localStorage.setItem(KEYS.LOCKS, JSON.stringify(updated));
    }
    return updated;
  },
  saveLocks: (locks: LockedProduct[]) => {
    localStorage.setItem(KEYS.LOCKS, JSON.stringify(locks));
  },
  getStats: (): SpendingStats => {
    const locks = Storage.getLocks();
    const completed = locks.filter(l => l.status === 'completed');
    const broken = locks.filter(l => l.status === 'broken');
    
    return {
      totalLocked: locks.filter(l => l.status === 'locked').length,
      totalCompleted: completed.length,
      totalBroken: broken.length,
      totalSaved: completed.reduce((acc, curr) => acc + curr.price, 0),
      totalPenalties: broken.length * 2000,
    };
  },
  getNotifications: (): Notification[] => {
    const data = localStorage.getItem(KEYS.NOTIFS);
    return data ? JSON.parse(data) : [
      { id: '1', text: 'Welcome to SpendSense! Start your first challenge.', time: Date.now(), read: false }
    ];
  },
  addNotification: (text: string) => {
    const notifs = Storage.getNotifications();
    const updated = [{ id: Math.random().toString(), text, time: Date.now(), read: false }, ...notifs];
    localStorage.setItem(KEYS.NOTIFS, JSON.stringify(updated.slice(0, 10)));
  },
  markNotifsRead: () => {
    const notifs = Storage.getNotifications();
    const updated = notifs.map(n => ({ ...n, read: true }));
    localStorage.setItem(KEYS.NOTIFS, JSON.stringify(updated));
  }
};

export const MOCK_MONTHLY_DATA: MonthlyData[] = [
  { month: 'JAN', savings: 12000, penalties: 2000 },
  { month: 'FEB', savings: 18000, penalties: 4000 },
  { month: 'MAR', savings: 10000, penalties: 4000 },
  { month: 'APR', savings: 16000, penalties: 1000 },
  { month: 'MAY', savings: 20000, penalties: 0 },
  { month: 'JUN', savings: 8000, penalties: 4000 },
];
