const ADMIN_IDENTIFIERS = {
  name: 'admin',
  email: 'admin@gmail.com'
};

// Override console methods in production
if (import.meta.env.PROD) {
  const originalLog = console.log;
  const originalWarn = console.warn;
  const originalInfo = console.info;

  const isAdmin = () => {
    try {
      const userStr = localStorage.getItem('newsapp_current_user');
      if (!userStr) return false;
      const user = JSON.parse(userStr);
      return user.name?.toLowerCase() === ADMIN_IDENTIFIERS.name || 
             user.email?.toLowerCase() === ADMIN_IDENTIFIERS.email;
    } catch {
      return false;
    }
  };

  console.log = (...args: any[]) => {
    if (isAdmin()) originalLog(...args);
  };

  console.warn = (...args: any[]) => {
    if (isAdmin()) originalWarn(...args);
  };

  console.info = (...args: any[]) => {
    if (isAdmin()) originalInfo(...args);
  };
}
