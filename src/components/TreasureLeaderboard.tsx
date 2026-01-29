import { useTreasures } from '@/hooks/useTreasures';
import { useAuthor } from '@/hooks/useAuthor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { genUserName } from '@/lib/genUserName';
import { Trophy, Map, Users } from 'lucide-react';

interface LeaderboardRowProps {
  rank: number;
  pubkey: string;
  count: number;
}

function LeaderboardRow({ rank, pubkey, count }: LeaderboardRowProps) {
  const author = useAuthor(pubkey);
  const metadata = author.data?.metadata;
  
  const displayName = metadata?.name || genUserName(pubkey);
  const profileImage = metadata?.picture;
  
  // Medal colors for top 3
  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'text-yellow-500';
      case 2:
        return 'text-gray-400';
      case 3:
        return 'text-amber-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 border-b last:border-b-0 hover:bg-muted/50 transition-colors">
      <div className={`text-2xl font-bold w-12 text-center ${getMedalColor(rank)}`}>
        {rank <= 3 ? <Trophy className="w-8 h-8 mx-auto" /> : `#${rank}`}
      </div>
      
      <Avatar className="h-12 w-12">
        <AvatarImage src={profileImage} alt={displayName} />
        <AvatarFallback>{displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate">{displayName}</p>
        {metadata?.nip05 && (
          <p className="text-xs text-muted-foreground truncate">{metadata.nip05}</p>
        )}
      </div>
      
      <Badge variant="secondary" className="text-lg px-4 py-2">
        {count} {count === 1 ? 'treasure' : 'treasures'}
      </Badge>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4">
          <Skeleton className="h-8 w-12" />
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-8 w-24" />
        </div>
      ))}
    </div>
  );
}

export function TreasureLeaderboard() {
  const { data, isLoading, error } = useTreasures();

  if (error) {
    return (
      <Card className="border-dashed border-2">
        <CardContent className="py-12 px-8 text-center">
          <div className="max-w-sm mx-auto space-y-6">
            <p className="text-muted-foreground">
              Failed to load leaderboard. Please check your relay connections and try again.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Treasures</CardTitle>
            <Map className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{data?.totalTreasures || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Treasure Planters</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{data?.totalPlanters || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average per Planter</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">
                {data?.totalPlanters
                  ? (data.totalTreasures / data.totalPlanters).toFixed(1)
                  : 0}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Trophy className="w-6 h-6" />
            Treasure Planter Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <LoadingSkeleton />
          ) : data?.leaderboard.length === 0 ? (
            <div className="py-12 px-8 text-center">
              <p className="text-muted-foreground">
                No treasures found yet. Be the first to plant one!
              </p>
            </div>
          ) : (
            <div>
              {data?.leaderboard.map((planter, index) => (
                <LeaderboardRow
                  key={planter.pubkey}
                  rank={index + 1}
                  pubkey={planter.pubkey}
                  count={planter.count}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
