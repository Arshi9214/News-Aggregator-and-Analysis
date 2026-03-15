import { BookOpen, Zap, Globe, Shield, ArrowRight, CheckCircle, Smartphone } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
              <BookOpen className="h-16 w-16 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            AI News Analyzer
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mt-2">
              for UPSC & Competitive Exams
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Get instant AI-powered summaries of current affairs from The Hindu, Indian Express, and TOI etc. 
            Available in 11 Indian languages. Perfect competitive exam preparation.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onGetStarted}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-semibold rounded-xl hover:shadow-xl transition-all hover:scale-105"
            >
              Get Started Free
              <ArrowRight className="h-5 w-5" />
            </button>
            <a
              href="https://github.com/Arshi9214/News-Aggregator-and-Analysis/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-blue-600 text-blue-600 text-lg font-semibold rounded-xl hover:shadow-xl transition-all hover:scale-105"
            >
              <Smartphone className="h-5 w-5" />
              Download App
            </a>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="p-3 bg-blue-100 rounded-lg w-fit mb-4">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">AI-Powered Summaries</h3>
            <p className="text-gray-600 text-sm">
              Get instant summaries and key takeaways from lengthy news articles using advanced AI.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="p-3 bg-indigo-100 rounded-lg w-fit mb-4">
              <Globe className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">11 Indian Languages</h3>
            <p className="text-gray-600 text-sm">
              Read news in English, Hindi, Tamil, Bengali, Telugu, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Urdu.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="p-3 bg-green-100 rounded-lg w-fit mb-4">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Trusted Sources</h3>
            <p className="text-gray-600 text-sm">
              Aggregates news from The Hindu, Indian Express, Times of India, NDTV, and more.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="p-3 bg-orange-100 rounded-lg w-fit mb-4">
              <Shield className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">PDF Analysis</h3>
            <p className="text-gray-600 text-sm">
              Upload and analyze PDF documents with AI-powered insights and summaries.
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-20 bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Perfect for Competitive Exam Preparation
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Daily Current Affairs</h4>
                <p className="text-gray-600 text-sm">Stay updated with latest news from trusted sources</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Historical Archives</h4>
                <p className="text-gray-600 text-sm">Access news archives from 1997 onwards</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Topic-wise Filtering</h4>
                <p className="text-gray-600 text-sm">Filter by Economy, Polity, Environment, Science, and more</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Bookmark & Export</h4>
                <p className="text-gray-600 text-sm">Save important articles and export to PDF</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Cross-Device Sync</h4>
                <p className="text-gray-600 text-sm">Access your data from any device</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Free to Use</h4>
                <p className="text-gray-600 text-sm">No subscription required, completely free</p>
              </div>
            </div>
          </div>
        </div>

        {/* App Download Banner */}
        <div className="mt-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8 md:p-12 text-center text-white">
          <Smartphone className="h-12 w-12 mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl font-bold mb-3">Take it on the go!</h2>
          <p className="text-blue-100 mb-6 max-w-xl mx-auto">
            Download the AI News Analyzer mobile app and stay updated with current affairs anytime, anywhere.
          </p>
          <a
            href="https://github.com/Arshi9214/News-Aggregator-and-Analysis/releases"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-xl hover:shadow-xl transition-all hover:scale-105"
          >
            <Smartphone className="h-5 w-5" />
            Download Android App (.apk)
          </a>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to ace your competitive exams?
          </h2>
          <p className="text-gray-600 mb-8">
            Join other aspirants using AI News Analyzer for their preparation
          </p>
          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-semibold rounded-xl hover:shadow-xl transition-all hover:scale-105"
          >
            Start Analyzing News Now
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>

        {/* Footer */}
        <div className="mt-20 text-center text-gray-500 text-sm">
          <p>Made with ❤️ for competitive exam aspirants in India</p>
        </div>
      </div>
    </div>
  );
}
