import { NewsArticle, Topic, Language } from '../App';
import { generateLightweightSummary } from './groqApi';
import { translateNewsContent } from './translator';

// Indian news RSS feeds (most reliable sources)
const RSS_FEEDS = {
  // Main feeds
  toi: 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms',
  hindu: 'https://www.thehindu.com/news/national/feeder/default.rss',
  indianExpress: 'https://indianexpress.com/feed/',
  hindustanTimes: 'https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml',
  ndtv: 'https://feeds.feedburner.com/ndtvnews-top-stories',
  livemint: 'https://www.livemint.com/rss/news',
  wire: 'https://thewire.in/feed',
  indiaToday: 'https://www.indiatoday.in/rss/home',
  
  // Category-specific feeds for better coverage
  toiPolitics: 'https://timesofindia.indiatimes.com/rssfeeds/1898055.cms',
  toiEconomy: 'https://timesofindia.indiatimes.com/rssfeeds/1898056.cms',
  hinduPolitics: 'https://www.thehindu.com/news/national/feeder/default.rss',
  hinduBusiness: 'https://www.thehindu.com/business/feeder/default.rss',
  ieIndia: 'https://indianexpress.com/section/india/feed/',
  iePolitics: 'https://indianexpress.com/section/political-pulse/feed/',
  ndtvIndia: 'https://feeds.feedburner.com/ndtvnews-india-news',
  ndtvBusiness: 'https://feeds.feedburner.com/ndtvprofit-latest',
  mintPolitics: 'https://www.livemint.com/rss/politics',
  mintEconomy: 'https://www.livemint.com/rss/economy'
};

// Try multiple CORS proxies - Fast public first, then custom as reliable fallback
const RSS_PROXY_URL = import.meta.env.VITE_RSS_PROXY;

const CORS_PROXIES = [
  // Proxy 1: corsproxy.io (fastest 310ms, but rate-limited after 3-5 requests)
  'https://corsproxy.io/?',
  // Proxy 2: Your custom backend proxy (slower 917ms, but NO rate limits - reliable)
  RSS_PROXY_URL ? `${RSS_PROXY_URL}?url=` : null,
  // Proxy 3: AllOrigins proxy (slowest, last resort)
  'https://api.allorigins.win/raw?url='
].filter(Boolean) as string[];

function cleanHTML(html: string): string {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

function isEnglish(text: string): boolean {
  // Check if text contains Devanagari script (Hindi)
  const hindiPattern = /[\u0900-\u097F]/;
  return !hindiPattern.test(text);
}

export async function fetchRSSNews(
  topics: Topic[],
  language: Language,
  dateRange?: { from: Date; to: Date },
  onArticlesFound?: (articles: NewsArticle[]) => void
): Promise<NewsArticle[]> {
  const articles: NewsArticle[] = [];
  
  for (const [source, feedUrl] of Object.entries(RSS_FEEDS)) {
    let success = false;
    
    for (const proxy of CORS_PROXIES) {
      try {
        const proxiedUrl = proxy + encodeURIComponent(feedUrl);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(proxiedUrl, { 
          method: 'GET',
          headers: { 'Accept': 'application/xml, text/xml' },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) continue;
        
        const text = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, 'text/xml');
        
        const items = xml.querySelectorAll('item');
        if (items.length === 0) continue;
        
        const sourceArticles: NewsArticle[] = [];
        
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          const title = item.querySelector('title')?.textContent || 'Untitled';
          const description = item.querySelector('description')?.textContent || '';
          const contentEncoded = item.querySelector('content\\:encoded, encoded')?.textContent || '';
          const content = cleanHTML(contentEncoded || description || title);
          
          // Skip non-English articles if language is English
          if (language === 'en' && !isEnglish(title + ' ' + content)) {
            continue;
          }
          
          const link = item.querySelector('link')?.textContent || '';
          const pubDate = item.querySelector('pubDate')?.textContent || '';
          const guid = item.querySelector('guid')?.textContent || '';
          
          // Translate content if needed
          const { title: translatedTitle, content: translatedContent } = 
            await translateNewsContent(title, content, language);
          
          const hasRealContent = content.length > title.length + 50;
          
          const article: NewsArticle = {
            id: `rss-${source}-${guid || link || Date.now()}-${i}`,
            title: translatedTitle,
            content: hasRealContent ? translatedContent : `${translatedTitle}. Click 'Generate Summary' for AI analysis or visit the article link for full content.`,
            summary: hasRealContent ? translatedContent.substring(0, 300) : 'Click Generate Summary for AI-powered analysis',
            source: { name: source.toUpperCase() },
            date: pubDate ? new Date(pubDate) : new Date(),
            topics: detectTopics(title + ' ' + content, topics),
            language,
            url: link,
            imageUrl: undefined,
            bookmarked: false,
            hasRealContent
          };
          
          sourceArticles.push(article);
        }
        
        articles.push(...sourceArticles);
        
        // Progressive loading: yield articles from this source immediately
        if (sourceArticles.length > 0 && onArticlesFound) {
          const filteredSourceArticles = sourceArticles.filter(article => {
            if (!dateRange) return true;
            const articleTime = article.date.getTime();
            return articleTime >= dateRange.from.getTime() && articleTime <= dateRange.to.getTime();
          });
          
          if (filteredSourceArticles.length > 0) {
            onArticlesFound(filteredSourceArticles);
          }
        }
        
        success = true;
        console.log(`✅ RSS ${source}: Fetched ${items.length} items via ${proxy}`);
        break;
      } catch (error) {
        console.log(`⚠️ RSS ${source} failed with ${proxy}:`, error);
        continue;
      }
    }
    
    if (!success) {
      console.error(`❌ All proxies failed for ${source}`);
    }
  }
  
  // Remove duplicates and prioritize articles with real content
  const uniqueArticles = removeDuplicates(articles);
  
  // Sort: articles with real content first, then by date
  const sortedArticles = uniqueArticles.sort((a, b) => {
    if (a.hasRealContent && !b.hasRealContent) return -1;
    if (!a.hasRealContent && b.hasRealContent) return 1;
    return b.date.getTime() - a.date.getTime();
  });
  
  // RSS feeds only have recent articles (last 24h-7 days)
  // For custom/month ranges, skip date filtering
  if (dateRange) {
    const daysDiff = (dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24);
    if (daysDiff > 7) {
      console.log('⚠️ Custom range >7 days: returning all RSS articles (RSS only has recent news)');
      return sortedArticles;
    }
  }
  
  return sortedArticles.filter(article => {
    if (!dateRange) return true;
    const articleTime = article.date.getTime();
    return articleTime >= dateRange.from.getTime() && articleTime <= dateRange.to.getTime();
  });}

/**
 * Remove duplicate articles based on title similarity
 */
function removeDuplicates(articles: NewsArticle[]): NewsArticle[] {
  const unique: NewsArticle[] = [];
  const seenTitles = new Set<string>();
  
  for (const article of articles) {
    // More aggressive normalization for better duplicate detection
    const normalizedTitle = article.title
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')  // Replace punctuation with spaces
      .replace(/\s+/g, ' ')     // Collapse multiple spaces
      .trim();
    
    // Create a shorter key for similarity matching (first 50 chars)
    const titleKey = normalizedTitle.substring(0, 50);
    
    // Check if we've seen a very similar title
    let isDuplicate = false;
    for (const seenTitle of seenTitles) {
      if (titleKey === seenTitle || 
          (titleKey.length > 20 && seenTitle.includes(titleKey.substring(0, 30))) ||
          (seenTitle.length > 20 && titleKey.includes(seenTitle.substring(0, 30)))) {
        isDuplicate = true;
        break;
      }
    }
    
    if (!isDuplicate && normalizedTitle.length > 10) {
      seenTitles.add(titleKey);
      unique.push(article);
    }
  }
  
  console.log(`🔄 RSS: Removed ${articles.length - unique.length} duplicates (${articles.length} → ${unique.length})`);
  return unique;
}

export async function generateRSSSummary(
  article: NewsArticle,
  language: Language
): Promise<NewsArticle> {
  try {
    const summaryResult = await generateLightweightSummary(
      article.title,
      article.content,
      article.summary || '',
      language
    );
    
    return {
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
  } catch (error) {
    console.error('Error generating RSS summary:', error);
    return article;
  }
}

function detectTopics(content: string, selectedTopics: Topic[]): Topic[] {
  const lowerContent = content.toLowerCase();
  const keywords: Record<Topic, string[]> = {
    all: [],
    economy: ['economy', 'gdp', 'rbi', 'budget', 'market', 'finance'],
    polity: ['government', 'parliament', 'politics', 'election', 'minister'],
    environment: ['environment', 'climate', 'pollution', 'green', 'carbon'],
    international: ['foreign', 'international', 'global', 'world', 'country'],
    science: ['technology', 'science', 'isro', 'research', 'innovation'],
    society: ['education', 'health', 'society', 'social', 'welfare'],
    history: ['history', 'heritage', 'ancient', 'historical'],
    geography: ['geography', 'natural', 'resources', 'region']
  };
  
  const detected: Topic[] = [];
  for (const [topic, words] of Object.entries(keywords)) {
    if (topic === 'all') continue;
    if (words.some(w => lowerContent.includes(w))) {
      detected.push(topic as Topic);
    }
  }
  
  return detected.length > 0 ? detected.slice(0, 2) : ['all'];
}
