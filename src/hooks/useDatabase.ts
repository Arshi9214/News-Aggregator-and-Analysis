import { useState, useEffect, useCallback } from 'react';
import DatabaseService, { StoredArticle, StoredPDF, UserPreferences } from '../utils/database';
import { NewsArticle, ProcessedPDF, Topic } from '../App';

// Hook for articles management
export function useArticles() {
  const [articles, setArticles] = useState<StoredArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadArticles = useCallback(async (limit = 100, offset = 0) => {
    setLoading(true);
    setError(null);
    try {
      const data = await DatabaseService.getArticles(limit, offset);
      setArticles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load articles');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveArticle = useCallback(async (article: NewsArticle) => {
    try {
      await DatabaseService.saveArticle(article);
      await loadArticles();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save article');
    }
  }, [loadArticles]);

  const saveArticles = useCallback(async (articles: NewsArticle[]) => {
    try {
      await DatabaseService.saveArticles(articles);
      await loadArticles();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save articles');
    }
  }, [loadArticles]);

  const toggleBookmark = useCallback(async (articleId: string) => {
    try {
      await DatabaseService.toggleBookmark(articleId);
      await loadArticles();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle bookmark');
    }
  }, [loadArticles]);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  return {
    articles,
    loading,
    error,
    loadArticles,
    saveArticle,
    saveArticles,
    toggleBookmark
  };
}

// Hook for user preferences
export function usePreferences() {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(false);

  const loadPreferences = useCallback(async () => {
    setLoading(true);
    try {
      const data = await DatabaseService.getPreferences();
      setPreferences(data);
    } catch (err) {
      console.error('Failed to load preferences:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const savePreferences = useCallback(async (prefs: Omit<UserPreferences, 'id' | 'lastSync'>) => {
    try {
      await DatabaseService.savePreferences(prefs);
      await loadPreferences();
    } catch (err) {
      console.error('Failed to save preferences:', err);
    }
  }, [loadPreferences]);

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  return {
    preferences,
    loading,
    savePreferences
  };
}