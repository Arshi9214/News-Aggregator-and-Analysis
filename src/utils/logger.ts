// Secure logger - only logs for admin users
const ADMIN_EMAILS = ['arshishaikh9214@gmail.com']; // Add your admin emails here

class SecureLogger {
  private isAdmin: boolean = false;

  setUser(email: string | null) {
    this.isAdmin = email ? ADMIN_EMAILS.includes(email.toLowerCase()) : false;
  }

  log(...args: any[]) {
    if (this.isAdmin || import.meta.env.DEV) {
      console.log(...args);
    }
  }

  error(...args: any[]) {
    if (this.isAdmin || import.meta.env.DEV) {
      console.error(...args);
    }
  }

  warn(...args: any[]) {
    if (this.isAdmin || import.meta.env.DEV) {
      console.warn(...args);
    }
  }

  info(...args: any[]) {
    if (this.isAdmin || import.meta.env.DEV) {
      console.info(...args);
    }
  }
}

export const logger = new SecureLogger();
