import { useSeoMeta } from '@unhead/react';
import { useParams, Link } from 'react-router-dom';
import { nip19 } from 'nostr-tools';
import { useNostr } from '@nostrify/react';
import { useQuery } from '@tanstack/react-query';
import { useAuthor } from '@/hooks/useAuthor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { genUserName } from '@/lib/genUserName';
import { ArrowLeft, Map, MapPin } from 'lucide-react';
import type { NostrEvent } from '@nostrify/nostrify';
import NotFound from './NotFound';

function TreasureCard({ treasure }: { treasure: NostrEvent }) {
  // Extract treasure details from tags
  const nameTag = treasure.tags.find(([name]) => name === 'name')?.[1];
  const locationTag = treasure.tags.find(([name]) => name === 'location')?.[1];
  const dTag = treasure.tags.find(([name]) => name === 'd')?.[1];
  
  const treasureName = nameTag || dTag || 'Unnamed Treasure';
  
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-purple-600" />
          {treasureName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {locationTag && (
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Map className="w-4 h-4" />
            {locationTag}
          </p>
        )}
        {treasure.content && (
          <p className="text-sm whitespace-pre-wrap break-words line-clamp-3">
            {treasure.content}
          </p>
        )}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-muted-foreground">
            {new Date(treasure.created_at * 1000).toLocaleDateString()}
          </span>
          {dTag && (
            <Badge variant="outline" className="text-xs">
              ID: {dTag.slice(0, 8)}...
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function UserTreasures() {
  const { npub } = useParams<{ npub: string }>();
  const { nostr } = useNostr();

  // Decode npub to get pubkey
  let pubkey: string;
  try {
    if (!npub) throw new Error('No npub provided');
    const decoded = nip19.decode(npub);
    if (decoded.type !== 'npub') {
      throw new Error('Invalid npub');
    }
    pubkey = decoded.data;
  } catch (error) {
    return <NotFound />;
  }

  const author = useAuthor(pubkey);
  const metadata = author.data?.metadata;
  const displayName = metadata?.name || genUserName(pubkey);
  const profileImage = metadata?.picture;

  // Query user's treasures
  const { data: treasures, isLoading, error } = useQuery({
    queryKey: ['user-treasures', pubkey],
    queryFn: async () => {
      const events = await nostr.query([
        {
          kinds: [37516], // Geocache listing
          authors: [pubkey],
          limit: 100,
        }
      ]);
      // Sort by created_at descending (newest first)
      return events.sort((a, b) => b.created_at - a.created_at);
    },
  });

  useSeoMeta({
    title: `${displayName}'s Treasures - Treasure Leaderboard`,
    description: `View all geocaches and treasures planted by ${displayName} on Nostr.`,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Leaderboard
            </Button>
          </Link>
        </div>

        {/* User Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profileImage} alt={displayName} />
                <AvatarFallback className="text-2xl">
                  {displayName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-3xl font-bold">{displayName}</h1>
                {metadata?.nip05 && (
                  <p className="text-muted-foreground">{metadata.nip05}</p>
                )}
                {metadata?.about && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {metadata.about}
                  </p>
                )}
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600">
                  {treasures?.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  {treasures?.length === 1 ? 'Treasure' : 'Treasures'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Treasures Grid */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Map className="w-6 h-6" />
            Planted Treasures
          </h2>

          {error ? (
            <Card className="border-dashed border-2">
              <CardContent className="py-12 px-8 text-center">
                <div className="max-w-sm mx-auto space-y-6">
                  <p className="text-muted-foreground">
                    Failed to load treasures. Please check your relay connections and try again.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : isLoading ? (
            <LoadingSkeleton />
          ) : treasures?.length === 0 ? (
            <Card className="border-dashed border-2">
              <CardContent className="py-12 px-8 text-center">
                <div className="max-w-sm mx-auto space-y-6">
                  <MapPin className="w-16 h-16 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">
                    This user hasn't planted any treasures yet.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {treasures?.map((treasure) => (
                <TreasureCard key={treasure.id} treasure={treasure} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
