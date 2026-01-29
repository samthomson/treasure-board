import { useNostr } from '@nostrify/react';
import { useQuery } from '@tanstack/react-query';
import type { NostrEvent } from '@nostrify/nostrify';

interface TreasurePlanter {
  pubkey: string;
  count: number;
  treasures: NostrEvent[];
}

/**
 * Hook to fetch all geocache listings (kind 37516) and calculate leaderboard
 */
export function useTreasures() {
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['treasures'],
    queryFn: async () => {
      // Query all geocache listings (kind 37516)
      const events = await nostr.query([
        {
          kinds: [37516], // Geocache listing
          limit: 1000, // Get a large number to build comprehensive leaderboard
        }
      ]);

      // Group by author pubkey and count
      const planterMap = new Map<string, TreasurePlanter>();

      events.forEach((event) => {
        const existing = planterMap.get(event.pubkey);
        if (existing) {
          existing.count++;
          existing.treasures.push(event);
        } else {
          planterMap.set(event.pubkey, {
            pubkey: event.pubkey,
            count: 1,
            treasures: [event],
          });
        }
      });

      // Convert to array and sort by count (descending)
      const leaderboard = Array.from(planterMap.values()).sort(
        (a, b) => b.count - a.count
      );

      return {
        leaderboard,
        totalTreasures: events.length,
        totalPlanters: leaderboard.length,
      };
    },
  });
}
