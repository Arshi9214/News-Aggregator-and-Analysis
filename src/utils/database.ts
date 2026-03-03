import Dexie, { Table } from 'dexie';
import { NewsArticle, ProcessedPDF, Language, Topic } from '../App';
import { UserManager } from './userManager';

// Database interfaces
export interface StoredArticle extends NewsArticle {
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface StoredPDF extends ProcessedPDF {
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface UserPreferences {
  id?: number;
  language: Language;
  selectedTopics: Topic[];
  themeMode: 'light' | 'dark' | 'newspaper';
  analysisDepth: 'basic' | 'advanced';
  userId: string;
  lastSync: Date;
}

export interface SearchHistory {
  id?: number;
  query: string;
  timestamp: Date;
  resultsCount: number;
  userId: string;
}

// Database class
class NewsDatabase extends Dexie {
  articles!: Table<StoredArticle>;
  pdfs!: Table<StoredPDF>;
  preferences!: Table<UserPreferences>;
  searchHistory!: Table<SearchHistory>;

  constructor() {
    super('NewsAnalyzerDB');
    
    this.version(1).stores({
      articles: '++id, title, date, topics, language, bookmarked, userId, createdAt, updatedAt',
      pdfs: '++id, name, uploadDate, bookmarked, userId, createdAt, updatedAt',
      preferences: '++id, language, themeMode, userId, lastSync',
      searchHistory: '++id, query, timestamp, userId'
    });

    // Hooks for automatic timestamps
    this.articles.hook('creating', (primKey, obj, trans) => {
      obj.createdAt = new Date();
      obj.updatedAt = new Date();
    });

    this.articles.hook('updating', (modifications, primKey, obj, trans) => {
      (modifications as any).updatedAt = new Date();
    });

    this.pdfs.hook('creating', (primKey, obj, trans) => {
      obj.createdAt = new Date();
      obj.updatedAt = new Date();
    });

    this.pdfs.hook('updating', (modifications, primKey, obj, trans) => {
      (modifications as any).updatedAt = new Date();
    });
  }
}

// Create database instance
export const db = new NewsDatabase();

// Database service class
export class DatabaseService {
  private static getUserId(): string {
    const user = UserManager.getCurrentUser();
    return user?.id || 'anonymous';
  }

  // Article operations
  static async saveArticle(article: NewsArticle): Promise<string> {
    try {
      const userId = this.getUserId();
      const storedArticle: StoredArticle = {
        ...article,
        userId,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Check if article already exists for this user
      const existing = await db.articles.where('[id+userId]').equals([article.id, userId]).first();
      if (existing) {
        await db.articles.update(existing.id!, { ...storedArticle });
        return article.id;
      }
      
      await db.articles.add(storedArticle);
      return article.id;
    } catch (error) {
      console.error('Error saving article:', error);
      throw new Error('Failed to save article');
    }
  }

  static async saveArticles(articles: NewsArticle[]): Promise<void> {
    try {
      const userId = this.getUserId();
      const storedArticles: StoredArticle[] = articles.map(article => ({
        ...article,
        userId,
        createdAt: new Date(),
        updatedAt: new Date()
      }));

      await db.transaction('rw', db.articles, async () => {
        for (const article of storedArticles) {
          const existing = await db.articles.where('[id+userId]').equals([article.id, userId]).first();
          if (existing) {
            await db.articles.update(existing.id!, { ...article });
          } else {
            await db.articles.add(article);
          }
        }
      });
    } catch (error) {
      console.error('Error saving articles:', error);
      throw new Error('Failed to save articles');
    }
  }

  static async getArticles(limit = 100, offset = 0): Promise<StoredArticle[]> {
    try {
      const userId = this.getUserId();
      return await db.articles
        .where('userId')
        .equals(userId)
        .orderBy('date')
        .reverse()
        .offset(offset)
        .limit(limit)
        .toArray();
    } catch (error) {
      console.error('Error fetching articles:', error);
      return [];
    }
  }

  static async getBookmarkedArticles(): Promise<StoredArticle[]> {
    try {
      const userId = this.getUserId();
      return await db.articles
        .where('[bookmarked+userId]')
        .equals([1, userId])
        .orderBy('updatedAt')
        .reverse()
        .toArray();
    } catch (error) {
      console.error('Error fetching bookmarked articles:', error);
      return [];
    }
  }

  static async searchArticles(query: string, topics?: Topic[]): Promise<StoredArticle[]> {
    try {
      const userId = this.getUserId();
      let collection = db.articles.where('userId').equals(userId);
      
      const results = await collection
        .filter(article => {
          const matchesQuery = article.title.toLowerCase().includes(query.toLowerCase()) ||
                              article.content.toLowerCase().includes(query.toLowerCase());
          const matchesTopics = !topics || topics.length === 0 || topics.includes('all') ||
                               article.topics.some(topic => topics.includes(topic));
          return matchesQuery && matchesTopics;
        })
        .toArray();
      
      // Save search history
      await this.saveSearchHistory(query, results.length);
      
      results.sort((a, b) => b.date.getTime() - a.date.getTime());
      return results;
    } catch (error) {
      console.error('Error searching articles:', error);
      return [];
    }
  }

  static async toggleBookmark(articleId: string): Promise<void> {
    try {
      const article = await db.articles.where('id').equals(articleId).first();
      if (article) {
        await db.articles.update(articleId, { 
          bookmarked: !article.bookmarked,
          updatedAt: new Date()
        });
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      throw new Error('Failed to toggle bookmark');
    }
  }

  static async togglePDFBookmark(pdfId: string): Promise<void> {
    try {
      const pdf = await db.pdfs.where('id').equals(pdfId).first();
      if (pdf) {
        await db.pdfs.update(pdfId, { 
          bookmarked: !pdf.bookmarked,
          updatedAt: new Date()
        });
      }
    } catch (error) {
      console.error('Error toggling PDF bookmark:', error);
      throw new Error('Failed to toggle PDF bookmark');
    }
  }

  static async deleteArticle(articleId: string): Promise<void> {
    try {
      await db.articles.delete(articleId);
    } catch (error) {
      console.error('Error deleting article:', error);
      throw new Error('Failed to delete article');
    }
  }

  // PDF operations
  static async savePDF(pdf: ProcessedPDF): Promise<string> {
    try {
      const userId = this.getUserId();
      const storedPDF: StoredPDF = {
        ...pdf,
        userId,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await db.pdfs.add(storedPDF);
      return pdf.id;
    } catch (error) {
      console.error('Error saving PDF:', error);
      throw new Error('Failed to save PDF');
    }
  }

  static async getPDFs(): Promise<StoredPDF[]> {
    try {
      const userId = this.getUserId();
      return await db.pdfs
        .where('userId')
        .equals(userId)
        .toArray()
        .then(pdfs => pdfs.sort((a, b) => b.uploadDate.getTime() - a.uploadDate.getTime()));
    } catch (error) {
      console.error('Error fetching PDFs:', error);
      return [];
    }
  }

  static async deletePDF(pdfId: string): Promise<void> {
    try {
      await db.pdfs.delete(pdfId);
    } catch (error) {
      console.error('Error deleting PDF:', error);
      throw new Error('Failed to delete PDF');
    }
  }

  // User preferences
  static async savePreferences(preferences: Omit<UserPreferences, 'id' | 'lastSync' | 'userId'>): Promise<void> {
    try {
      const userId = this.getUserId();
      const existing = await db.preferences.where('userId').equals(userId).first();
      const prefs: UserPreferences = {
        ...preferences,
        userId,
        lastSync: new Date()
      };
      
      if (existing) {
        await db.preferences.update(existing.id!, { ...prefs });
      } else {
        await db.preferences.add(prefs);
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      throw new Error('Failed to save preferences');
    }
  }

  static async getPreferences(): Promise<UserPreferences | null> {
    try {
      const userId = this.getUserId();
      return await db.preferences.where('userId').equals(userId).first() || null;
    } catch (error) {
      console.error('Error fetching preferences:', error);
      return null;
    }
  }

  // Search history
  static async saveSearchHistory(query: string, resultsCount: number): Promise<void> {
    try {
      const userId = this.getUserId();
      await db.searchHistory.add({
        query,
        timestamp: new Date(),
        resultsCount,
        userId
      });
      
      // Keep only last 50 searches per user
      const userSearches = await db.searchHistory.where('userId').equals(userId).toArray();
      if (userSearches.length > 50) {
        const oldest = userSearches
          .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
          .slice(0, userSearches.length - 50);
        
        await db.searchHistory.bulkDelete(oldest.map(s => s.id!));
      }
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  }

  static async getSearchHistory(limit = 10): Promise<SearchHistory[]> {
    try {
      const userId = this.getUserId();
      return await db.searchHistory
        .where('userId')
        .equals(userId)
        .orderBy('timestamp')
        .reverse()
        .limit(limit)
        .toArray();
    } catch (error) {
      console.error('Error fetching search history:', error);
      return [];
    }
  }

  // Database maintenance
  static async clearOldArticles(daysOld = 30): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);
      
      const oldArticles = await db.articles
        .where('createdAt')
        .below(cutoffDate)
        .and(article => !article.bookmarked)
        .toArray();
      
      await db.articles.bulkDelete(oldArticles.map(a => a.id));
      return oldArticles.length;
    } catch (error) {
      console.error('Error clearing old articles:', error);
      return 0;
    }
  }

  static async getDatabaseStats(): Promise<{
    articlesCount: number;
    bookmarkedCount: number;
    pdfsCount: number;
    searchHistoryCount: number;
    dbSize: string;
  }> {
    try {
      const userId = this.getUserId();
      const [articlesCount, bookmarkedCount, pdfsCount, searchHistoryCount] = await Promise.all([
        db.articles.where('userId').equals(userId).count(),
        db.articles.where('[bookmarked+userId]').equals([1, userId]).count(),
        db.pdfs.where('userId').equals(userId).count(),
        db.searchHistory.where('userId').equals(userId).count()
      ]);

      const dbSize = `~${Math.round((articlesCount * 2 + pdfsCount * 10) / 1024)} KB`;

      return {
        articlesCount,
        bookmarkedCount,
        pdfsCount,
        searchHistoryCount,
        dbSize
      };
    } catch (error) {
      console.error('Error getting database stats:', error);
      return {
        articlesCount: 0,
        bookmarkedCount: 0,
        pdfsCount: 0,
        searchHistoryCount: 0,
        dbSize: '0 KB'
      };
    }
  }

  static async exportData(): Promise<{
    articles: StoredArticle[];
    pdfs: StoredPDF[];
    preferences: UserPreferences | null;
  }> {
    try {
      const [articles, pdfs, preferences] = await Promise.all([
        db.articles.toArray(),
        db.pdfs.toArray(),
        this.getPreferences()
      ]);

      return { articles, pdfs, preferences };
    } catch (error) {
      console.error('Error exporting data:', error);
      throw new Error('Failed to export data');
    }
  }

  static async importData(data: {
    articles?: StoredArticle[];
    pdfs?: StoredPDF[];
    preferences?: UserPreferences;
  }): Promise<void> {
    try {
      await db.transaction('rw', [db.articles, db.pdfs, db.preferences], async () => {
        if (data.articles) {
          await db.articles.bulkAdd(data.articles);
        }
        if (data.pdfs) {
          await db.pdfs.bulkAdd(data.pdfs);
        }
        if (data.preferences) {
          await this.savePreferences(data.preferences);
        }
      });
    } catch (error) {
      console.error('Error importing data:', error);
      throw new Error('Failed to import data');
    }
  }

  static async clearAllData(): Promise<void> {
    try {
      await db.transaction('rw', [db.articles, db.pdfs, db.preferences, db.searchHistory], async () => {
        await Promise.all([
          db.articles.clear(),
          db.pdfs.clear(),
          db.preferences.clear(),
          db.searchHistory.clear()
        ]);
      });
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw new Error('Failed to clear data');
    }
  }
}

// Initialize database
db.open().catch(error => {
  console.error('Failed to open database:', error);
});

export default DatabaseService;