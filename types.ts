
export type Language = 'en' | 'fr' | 'dr';

export interface Translations {
  [key: string]: {
    en: string;
    fr: string;
    dr?: string;
  };
}

export type Priority = 'urgent' | 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  date: string;
  time?: string;
}

export interface Challenge {
  id: string;
  text: string;
  completed: boolean;
  date: string;
}

export interface Expense {
  id: string;
  amount: number;
  description: string;
  date: string;
}

export interface Income {
  id: string;
  amount: number;
  description: string;
  date: string;
}

export interface Loan {
  id: string;
  person: string;
  amount: number;
  type: 'lent' | 'borrowed';
  dueDate?: string;
  isPaid: boolean;
  note?: string;
  createdAt: string;
}

export interface Mistake {
  id: string;
  text: string;
  date: string;
}

export interface MoodEntry {
  date: string;
  mood: 'great' | 'good' | 'neutral' | 'bad' | 'awful';
}

export interface TrashItem {
  type: 'task' | 'expense' | 'income' | 'loan' | 'challenge' | 'mistake';
  data: Task | Expense | Income | Loan | Challenge | Mistake;
  deletedAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface AppData {
  hasOnboarded: boolean;
  joinDate: string;
  userId: string;
  name: string;
  profileImage?: string;
  coverImage?: string;
  gender: 'male' | 'female';
  currency: string;
  tasks: Task[];
  challenges: Challenge[];
  expenses: Expense[];
  incomes: Income[];
  loans: Loan[];
  mistakes: Mistake[];
  moods: MoodEntry[];
  trash: TrashItem[];
  notifications: Notification[];
  lastActiveDate: string;
}

export type ViewState = 
  | 'onboarding' 
  | 'dashboard' 
  | 'notifications' 
  | 'time_manager' 
  | 'long_term_goals' 
  | 'learned_lessons' 
  | 'loans' 
  | 'daily_summary' 
  | 'calendar' 
  | 'wallet' 
  | 'settings' 
  | 'trash' 
  | 'money_saver';
