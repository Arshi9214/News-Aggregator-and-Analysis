import { NewsArticle, ProcessedPDF, Language, Topic } from '../App';
import { api } from './api';

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

export class DatabaseService {
  static async saveArticle(article: NewsArticle): Promise<string> {
    await api.saveArticle(article);
    return article.id;
  }

  static async saveArticles(articles: NewsArticle[]): Promise<void> {
    await Promise.all(articles.map(a => api.saveArticle(a)));
  }

  static async getArticles(limit = 100, offset = 0): Promise<StoredArticle[]> {
    const articles = await api.getArticles();
    return articles.map((a: any) => ({
      ...a,
      date: new Date(a.date),
      createdAt: new Date(a.created_at),
      updatedAt: new Date(a.updated_at),
      userId: a.user_id
    }));
  }

  static async getBookmarkedArticles(): Promise<StoredArticle[]> {
    const articles = await this.getArticles();
    return articles.filter(a => a.bookmarked);
  }

  static async searchArticles(query: string, topics?: Topic[]): Promise<StoredArticle[]> {
    const articles = await this.getArticles();
    return articles.filter(article => {
      const matchesQuery = article.title.toLowerCase().includes(query.toLowerCase()) ||
                          article.content.toLowerCase().includes(query.toLowerCase());
      const matchesTopics = !topics || topics.length === 0 || topics.includes('all') ||
                           article.topics.some(topic => topics.includes(topic));
      return matchesQuery && matchesTopics;
    });
  }

  static async toggleBookmark(articleId: string): Promise<void> {
    await api.toggleArticleBookmark(articleId);
  }

  static async togglePDFBookmark(pdfId: string): Promise<void> {
    await api.togglePDFBookmark(pdfId);
  }

  static async deleteArticle(articleId: string): Promise<void> {
    await api.deleteArticle(articleId);
  }

  static async savePDF(pdf: ProcessedPDF): Promise<string> {
    await api.savePDF(pdf);
    return pdf.id;
  }

  static async getPDFs(): Promise<StoredPDF[]> {
    const pdfs = await api.getPDFs();
    return pdfs.map((p: any) => ({
      ...p,
      uploadDate: new Date(p.upload_date),
      createdAt: new Date(p.created_at),
      updatedAt: new Date(p.updated_at),
      userId: p.user_id
    }));
  }

  static async deletePDF(pdfId: string): Promise<void> {
    await api.deletePDF(pdfId);
  }

  static async savePreferences(preferences: any): Promise<void> {
    await api.savePreferences(preferences);
  }

  static async getPreferences(): Promise<any> {
    return await api.getPreferences();
  }

  static async getDatabaseStats(): Promise<{
    articlesCount: number;
    bookmarkedCount: number;
    pdfsCount: number;
    searchHistoryCount: number;
    dbSize: string;
  }> {
    const stats = await api.getStats();
    return {
      ...stats,
      searchHistoryCount: 0,
      dbSize: '~0 KB'
    };
  }

  static async clearOldArticles(daysOld = 30): Promise<number> {
    return 0;
  }

  static async exportData(): Promise<any> {
    const [articles, pdfs, preferences] = await Promise.all([
      this.getArticles(),
      this.getPDFs(),
      this.getPreferences()
    ]);
    return { articles, pdfs, preferences };
  }

  static async importData(data: any): Promise<void> {
    if (data.articles) {
      await Promise.all(data.articles.map((a: any) => api.saveArticle(a)));
    }
    if (data.pdfs) {
      await Promise.all(data.pdfs.map((p: any) => api.savePDF(p)));
    }
  }

  static async clearAllData(): Promise<void> {
    const articles = await this.getArticles();
    const pdfs = await this.getPDFs();
    await Promise.all([
      ...articles.map(a => api.deleteArticle(a.id)),
      ...pdfs.map(p => api.deletePDF(p.id))
    ]);
  }
}

export default DatabaseService;
