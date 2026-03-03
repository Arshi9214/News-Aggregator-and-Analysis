import { useState, useEffect } from 'react';
import { Database, Download, Upload, Trash2, BarChart3, RefreshCw } from 'lucide-react';
import DatabaseService from '../utils/database';
import { toast } from 'sonner';

interface DatabaseSettingsProps {
  language: 'en' | 'hi';
  themeMode?: 'light' | 'dark' | 'newspaper';
  onStatsChange?: () => void;
}

export function DatabaseSettings({ language, themeMode, onStatsChange }: DatabaseSettingsProps) {
  const [stats, setStats] = useState({
    articlesCount: 0,
    bookmarkedCount: 0,
    pdfsCount: 0,
    searchHistoryCount: 0,
    dbSize: '0 KB'
  });
  const [loading, setLoading] = useState(false);

  const t = {
    en: {
      title: 'Database Management',
      stats: 'Database Statistics',
      articles: 'Articles',
      bookmarks: 'Bookmarks',
      pdfs: 'PDFs',
      searches: 'Search History',
      size: 'Database Size',
      export: 'Export Data',
      import: 'Import Data',
      clear: 'Clear Old Articles',
      clearAll: 'Clear All Data',
      refresh: 'Refresh Stats'
    },
    hi: {
      title: 'डेटाबेस प्रबंधन',
      stats: 'डेटाबेस आंकड़े',
      articles: 'लेख',
      bookmarks: 'बुकमार्क',
      pdfs: 'पीडीएफ',
      searches: 'खोज इतिहास',
      size: 'डेटाबेस आकार',
      export: 'डेटा निर्यात',
      import: 'डेटा आयात',
      clear: 'पुराने लेख साफ़ करें',
      clearAll: 'सभी डेटा साफ़ करें',
      refresh: 'आंकड़े रीफ्रेश करें'
    }
  };

  // Load stats on component mount
  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await DatabaseService.getDatabaseStats();
      setStats(data);
      onStatsChange?.();
    } catch (error) {
      toast.error('Failed to load database stats');
    } finally {
      setLoading(false);
    }
  };

  const exportData = async () => {
    setLoading(true);
    try {
      const data = await DatabaseService.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `news-analyzer-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Data exported successfully!');
    } catch (error) {
      toast.error('Failed to export data');
    } finally {
      setLoading(false);
    }
  };

  const clearOldArticles = async () => {
    if (!confirm('Clear articles older than 30 days?')) return;
    
    setLoading(true);
    try {
      const deletedCount = await DatabaseService.clearOldArticles(30);
      toast.success(`Deleted ${deletedCount} old articles`);
      await loadStats();
    } catch (error) {
      toast.error('Failed to clear old articles');
    } finally {
      setLoading(false);
    }
  };

  const clearAllData = async () => {
    if (!confirm('This will delete ALL data. Are you sure?')) return;
    
    setLoading(true);
    try {
      await DatabaseService.clearAllData();
      toast.success('All data cleared');
      await loadStats();
    } catch (error) {
      toast.error('Failed to clear data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`rounded-lg p-6 border ${
      themeMode === 'newspaper'
        ? 'bg-[#f9f3e8] border-[#8b7355]'
        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
    }`}>
      <div className="flex items-center gap-3 mb-6">
        <Database className={`h-6 w-6 ${
          themeMode === 'newspaper' ? 'text-[#5a4a3a]' : 'text-blue-600 dark:text-blue-400'
        }`} />
        <h3 className={`text-xl font-semibold ${
          themeMode === 'newspaper' ? 'text-[#2c1810]' : 'text-gray-900 dark:text-white'
        }`}>
          {t[language].title}
        </h3>
      </div>

      {/* Statistics */}
      <div className={`rounded-lg p-4 mb-6 ${
        themeMode === 'newspaper'
          ? 'bg-[#f4e8d0]'
          : 'bg-gray-50 dark:bg-gray-700'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <h4 className={`font-medium ${
            themeMode === 'newspaper' ? 'text-[#3d2817]' : 'text-gray-900 dark:text-white'
          }`}>
            {t[language].stats}
          </h4>
          <button
            onClick={loadStats}
            disabled={loading}
            className={`p-2 rounded-lg transition-colors ${
              themeMode === 'newspaper'
                ? 'hover:bg-[#e8dcc8] text-[#5a4a3a]'
                : 'hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400'
            }`}
            title="Refresh database statistics"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${
              themeMode === 'newspaper' ? 'text-[#2c1810]' : 'text-gray-900 dark:text-white'
            }`}>
              {stats.articlesCount}
            </div>
            <div className={`text-sm ${
              themeMode === 'newspaper' ? 'text-[#5a4a3a]' : 'text-gray-600 dark:text-gray-400'
            }`}>
              {t[language].articles}
            </div>
          </div>
          
          <div className="text-center">
            <div className={`text-2xl font-bold ${
              themeMode === 'newspaper' ? 'text-[#2c1810]' : 'text-gray-900 dark:text-white'
            }`}>
              {stats.bookmarkedCount}
            </div>
            <div className={`text-sm ${
              themeMode === 'newspaper' ? 'text-[#5a4a3a]' : 'text-gray-600 dark:text-gray-400'
            }`}>
              {t[language].bookmarks}
            </div>
          </div>
          
          <div className="text-center">
            <div className={`text-2xl font-bold ${
              themeMode === 'newspaper' ? 'text-[#2c1810]' : 'text-gray-900 dark:text-white'
            }`}>
              {stats.pdfsCount}
            </div>
            <div className={`text-sm ${
              themeMode === 'newspaper' ? 'text-[#5a4a3a]' : 'text-gray-600 dark:text-gray-400'
            }`}>
              {t[language].pdfs}
            </div>
          </div>
          
          <div className="text-center">
            <div className={`text-2xl font-bold ${
              themeMode === 'newspaper' ? 'text-[#2c1810]' : 'text-gray-900 dark:text-white'
            }`}>
              {stats.searchHistoryCount}
            </div>
            <div className={`text-sm ${
              themeMode === 'newspaper' ? 'text-[#5a4a3a]' : 'text-gray-600 dark:text-gray-400'
            }`}>
              {t[language].searches}
            </div>
          </div>
          
          <div className="text-center">
            <div className={`text-2xl font-bold ${
              themeMode === 'newspaper' ? 'text-[#2c1810]' : 'text-gray-900 dark:text-white'
            }`}>
              {stats.dbSize}
            </div>
            <div className={`text-sm ${
              themeMode === 'newspaper' ? 'text-[#5a4a3a]' : 'text-gray-600 dark:text-gray-400'
            }`}>
              {t[language].size}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <button
          onClick={exportData}
          disabled={loading}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors font-medium ${
            themeMode === 'newspaper'
              ? 'bg-[#8b7355] hover:bg-[#6b5744] text-[#f9f3e8] disabled:bg-[#b8a785]'
              : 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-400'
          }`}
        >
          <Download className="h-4 w-4" />
          {t[language].export}
        </button>

        <button
          onClick={clearOldArticles}
          disabled={loading}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors font-medium ${
            themeMode === 'newspaper'
              ? 'bg-[#e8dcc8] hover:bg-[#d4c5a9] text-[#3d2817] border border-[#8b7355] disabled:opacity-50'
              : 'bg-yellow-600 hover:bg-yellow-700 text-white disabled:bg-yellow-400'
          }`}
        >
          <RefreshCw className="h-4 w-4" />
          {t[language].clear}
        </button>

        <button
          onClick={clearAllData}
          disabled={loading}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors font-medium ${
            themeMode === 'newspaper'
              ? 'bg-[#8b4513] hover:bg-[#6b3410] text-[#f9f3e8] disabled:opacity-50'
              : 'bg-red-600 hover:bg-red-700 text-white disabled:bg-red-400'
          }`}
        >
          <Trash2 className="h-4 w-4" />
          {t[language].clearAll}
        </button>

        <div className={`relative flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed ${
          themeMode === 'newspaper'
            ? 'border-[#8b7355] text-[#5a4a3a]'
            : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400'
        }`}>
          <Upload className="h-4 w-4" />
          <span className="text-sm">{t[language].import}</span>
          <input
            type="file"
            accept=".json"
            className="absolute inset-0 opacity-0 cursor-pointer z-10"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                try {
                  const text = await file.text();
                  const data = JSON.parse(text);
                  await DatabaseService.importData(data);
                  toast.success('Data imported successfully!');
                  await loadStats();
                } catch (error) {
                  toast.error('Failed to import data');
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}