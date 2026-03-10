import { NewsArticle, Topic, Language } from '../App';
import { generateLightweightSummary } from './groqApi';
import { fetchRSSNews, generateRSSSummary } from './rssApi';
import { fetchArchiveNews } from './archiveApi';

// Topic keywords for better categorization
const TOPIC_KEYWORDS: Record<Topic, string[]> = {
  all: [],
  economy: ['economy', 'economic', 'gdp', 'rbi', 'budget', 'market', 'finance', 'banking', 'investment', 'inflation', 'rupee', 'stock', 'trade'],
  polity: ['government', 'parliament', 'politics', 'election', 'minister', 'policy', 'governance', 'democracy', 'constitution', 'supreme court', 'high court'],
  environment: ['environment', 'climate', 'pollution', 'green', 'carbon', 'renewable', 'solar', 'wind', 'forest', 'wildlife', 'conservation'],
  international: ['foreign', 'international', 'global', 'world', 'diplomatic', 'embassy', 'treaty', 'bilateral', 'multilateral', 'UN', 'NATO'],
  science: ['technology', 'science', 'isro', 'research', 'innovation', 'AI', 'space', 'satellite', 'digital', 'cyber', 'internet'],
  society: ['education', 'health', 'society', 'social', 'welfare', 'poverty', 'employment', 'healthcare', 'hospital', 'school', 'university'],
  history: ['history', 'heritage', 'ancient', 'historical', 'archaeological', 'monument', 'culture', 'tradition', 'civilization'],
  geography: ['geography', 'natural', 'resources', 'region', 'river', 'mountain', 'state', 'district', 'border', 'map']
};

/**
 * Main function to fetch news from RSS feeds
 * This replaces the paid API approach with free RSS feeds
 */
export async function fetchNews(
  topics: Topic[],
  dateRange: { from: Date; to: Date },
  language: Language,
  onProgressUpdate?: (articles: NewsArticle[]) => void
): Promise<NewsArticle[]> {
  console.log('🚀 Starting news fetch...', { topics, dateRange, language });
  
  const daysDiff = (dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24);
  const daysFromNow = (new Date().getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24);
  
  try {
    // For custom/month ranges (>7 days) OR specific dates older than 7 days, use archive scraping
    if (daysDiff > 7 || daysFromNow > 7) {
      console.log('📚 Using archive scraping for custom/month/old date range');
      const articles = await fetchArchiveNews(
        topics,
        dateRange,
        language,
        (status, source) => console.log(`${status} - ${source}`),
        onProgressUpdate
      );
      console.log(`✅ Archive fetch completed: ${articles.length} articles`);
      return articles;
    }
    
    // For recent ranges (≤7 days from now), use RSS feeds
    console.log('📡 Using RSS feeds for recent news');
    const articles = await fetchRSSNews(
      topics,
      language,
      dateRange,
      onProgressUpdate
    );
    
    console.log(`✅ RSS fetch completed: ${articles.length} articles`);
    return articles;
  } catch (error) {
    console.error('❌ News fetch failed:', error);
    return [];
  }
}

/**
 * Generate summary for a single article (used for lazy loading)
 */
export async function generateArticleSummary(
  article: NewsArticle,
  language: Language,
  onUpdate?: (updatedArticle: NewsArticle) => void
): Promise<NewsArticle> {
  try {
    // Use RSS summary generator if it's an RSS article
    if (article.id.startsWith('rss-')) {
      return await generateRSSSummary(article, language);
    }
    
    const summaryResult = await generateLightweightSummary(
      article.title,
      article.content,
      article.summary || '',
      language
    );
    
    const updatedArticle = {
      ...article,
      summary: summaryResult.summary,
      analysis: {
        summary: summaryResult.summary,
        keyTakeaways: summaryResult.keyTakeaways,
        examRelevance: '',
        importantFacts: [],
        potentialQuestions: [],
        relatedTopics: article.topics
      }
    };
    
    onUpdate?.(updatedArticle);
    return updatedArticle;
  } catch (error) {
    console.error('Error generating summary:', error);
    return article;
  }
}

/**
 * Helper functions
 */
function detectTopics(content: string, selectedTopics: Topic[]): Topic[] {
  const lowerContent = content.toLowerCase();
  const detected: Topic[] = [];
  
  Object.entries(TOPIC_KEYWORDS).forEach(([topic, keywords]) => {
    if (topic === 'all') return;
    
    const hasKeyword = keywords.some(keyword => 
      lowerContent.includes(keyword.toLowerCase())
    );
    
    if (hasKeyword) {
      detected.push(topic as Topic);
    }
  });
  
  return detected.length > 0 ? detected.slice(0, 2) : selectedTopics.filter(t => t !== 'all');
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get date range helper
 */
export function getDateRange(
  preset: '24h' | 'week' | 'month' | 'custom',
  customDates?: { from: Date; to: Date }
): { from: Date; to: Date } {
  const now = new Date();
  
  let from: Date;
  let to: Date;
  
  switch (preset) {
    case '24h':
      to = new Date(now);
      from = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case 'week':
      to = new Date(now);
      from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      to = new Date(now);
      from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case 'custom':
      if (customDates) {
        return {
          from: customDates.from,
          to: customDates.to
        };
      }
      to = new Date(now);
      from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    default:
      to = new Date(now);
      from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }
  
  return { from, to };
}