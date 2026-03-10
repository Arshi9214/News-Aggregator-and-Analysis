// This file exports logger for use throughout the app
// In production, only admin users will see console logs
export { logger } from './logger';

// Usage: Replace console.log with logger.log
// import { logger } from './utils/secureLogger';
// logger.log('This will only show for admins in production');
