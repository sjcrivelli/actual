export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  currency: string;
  darkMode: boolean;
  language: string;
  startOfWeek: 'Sunday' | 'Monday';
}

