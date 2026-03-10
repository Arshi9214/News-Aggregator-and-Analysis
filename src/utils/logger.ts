// Secure logger - only logs for admin users in production
const ADMIN_EMAILS = ['arshi9214@gmail.com', 'arshishaikh9214@gmail.com'];

class SecureLogger {
  private isAdmin: boolean = false;
  private isDev: boolean = import.meta.env.DEV;

  setUser(email: string | null) {
    this.isAdmin = email ? ADMIN_EMAILS.includes(email.toLowerCase()) : false;
  }

  private shouldLog(): boolean {
    return this.isDev || this.isAdmin;
  }

  log(...args: any[]) {
    if (this.shouldLog()) {
      console.log(...args);
    }
  }

  error(...args: any[]) {
    // Always show errors
    console.error(...args);
  }

  warn(...args: any[]) {
    if (this.shouldLog()) {
      console.warn(...args);
    }
  }

  info(...args: any[]) {
    if (this.shouldLog()) {
      console.info(...args);
    }
  }
}

export const logger = new SecureLogger();
