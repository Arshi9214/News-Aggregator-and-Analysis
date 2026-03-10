import { api } from './api';

export interface User {
  id: string;
  name: string;
  email?: string;
  createdAt: string;
  lastLogin: string;
}

export class UserManager {
  private static readonly CURRENT_USER_KEY = 'newsapp_current_user';

  static async createUser(name: string, password: string, email?: string, securityQuestion?: string, securityAnswer?: string): Promise<User> {
    const user = await api.register(name, password, email, securityQuestion, securityAnswer);
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    console.log('✅ User created:', user.name);
    return user;
  }

  static async resetPassword(nameOrEmail: string, securityAnswer: string, newPassword: string): Promise<void> {
    await api.resetPassword(nameOrEmail, securityAnswer, newPassword);
    console.log('✅ Password reset successful');
  }



  static async loginUser(name: string, password: string): Promise<User> {
    const user = await api.login(name, password);
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    console.log('✅ User logged in:', user.name);
    return user;
  }

  static logout(): void {
    api.clearToken();
    localStorage.removeItem(this.CURRENT_USER_KEY);
    console.log('✅ User logged out');
  }

  static getCurrentUser(): User | null {
    const userJson = localStorage.getItem(this.CURRENT_USER_KEY);
    if (!userJson) return null;
    
    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  }

  static setCurrentUser(user: User): void {
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
  }

  static async getAllUsers(): Promise<User[]> {
    return await api.getAllUsers();
  }
}
