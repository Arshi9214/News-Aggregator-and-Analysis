import DatabaseService, { StoredArticle } from './database';
import { NewsArticle } from '../App';

// Simple user management for multi-user support
export interface User {
  id: string;
  name: string;
  email?: string;
  password: string;
  createdAt: Date;
  lastLogin: Date;
}

export class UserManager {
  private static currentUser: User | null = null;
  
  static getCurrentUser(): User | null {
    if (!this.currentUser) {
      const stored = localStorage.getItem('currentUser');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        parsed.createdAt = new Date(parsed.createdAt);
        parsed.lastLogin = new Date(parsed.lastLogin);
        this.currentUser = parsed;
      }
    }
    return this.currentUser;
  }
  
  static setCurrentUser(user: User): void {
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
  
  static logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }
  
  static generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  static async getAllUsers(): Promise<User[]> {
    const users = localStorage.getItem('allUsers');
    if (users) {
      const parsed = JSON.parse(users);
      return parsed.map((user: any) => ({
        ...user,
        createdAt: new Date(user.createdAt),
        lastLogin: new Date(user.lastLogin)
      }));
    }
    return [];
  }
  
  static async saveUser(user: User): Promise<void> {
    const users = await this.getAllUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);
    
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    
    localStorage.setItem('allUsers', JSON.stringify(users));
  }
  
  static async createUser(name: string, password: string, email?: string): Promise<User> {
    const user: User = {
      id: this.generateUserId(),
      name,
      email,
      password,
      createdAt: new Date(),
      lastLogin: new Date()
    };
    
    await this.saveUser(user);
    return user;
  }
  
  static async loginUser(nameOrEmail: string, password: string): Promise<User | null> {
    const users = await this.getAllUsers();
    const user = users.find(u => 
      (u.name.toLowerCase() === nameOrEmail.toLowerCase() || 
       u.email?.toLowerCase() === nameOrEmail.toLowerCase()) &&
      u.password === password
    );
    
    if (user) {
      user.lastLogin = new Date();
      await this.saveUser(user);
      this.setCurrentUser(user);
    }
    
    return user || null;
  }
}