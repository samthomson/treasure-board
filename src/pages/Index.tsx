import { useSeoMeta } from '@unhead/react';
import { TreasureLeaderboard } from '@/components/TreasureLeaderboard';
import { Map, Sparkles } from 'lucide-react';

const Index = () => {
  useSeoMeta({
    title: 'Treasure Leaderboard - Nostr Geocaching Rankings',
    description: 'See who has planted the most treasures on Nostr! Track the top geocache creators and treasure hunters in the decentralized geocaching community.',
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 -z-10" />
        <div className="absolute inset-0 bg-grid-pattern opacity-5 -z-10" />
        
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-full backdrop-blur-sm border border-purple-200 dark:border-purple-800">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                Powered by Nostr Protocol
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Treasure Leaderboard
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Discover the top treasure planters in the decentralized geocaching community
            </p>
            
            <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
              <Map className="w-5 h-5" />
              <span className="text-sm">
                Real-world treasure hunting on the open web
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-16">
        <div className="max-w-5xl mx-auto -mt-8">
          <TreasureLeaderboard />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>
              Built with{' '}
              <a
                href="https://shakespeare.diy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
              >
                Shakespeare
              </a>
              {' '}• Using{' '}
              <a
                href="https://nostr.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
              >
                Nostr Protocol
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
