# Treasure Leaderboard

A leaderboard tracking who has planted the most treasures in the Nostr geocaching ecosystem.

## About

This application displays a real-time leaderboard of treasure planters on Nostr, showing who has created the most geocache listings (kind 37516 events). It uses the Nostr protocol to query geocaching data and ranks users by their treasure planting activity.

## Features

- **Real-time Leaderboard**: See top treasure planters ranked by number of treasures planted
- **User Profiles**: View profile information for each planter including name, avatar, and NIP-05 verification
- **Statistics Dashboard**: Total treasures, total planters, and average treasures per planter
- **Beautiful UI**: Modern, responsive design with gradient backgrounds and smooth animations
- **Decentralized**: Powered by the Nostr protocol - no central server or database

## How It Works

The application queries Nostr relays for kind 37516 events (Geocache listings) and aggregates them by author pubkey to create the leaderboard. Each treasure listing represents a geocache that has been "planted" or hidden by a user.

## Development

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run test     # Run tests and build
```

## Built With

- React 18
- TailwindCSS 3
- Nostrify
- Vite
- shadcn/ui

## Nostr Event Kinds Used

- **37516**: Geocache listing (treasures planted)
- **0**: User metadata (profile information)

Built with [Shakespeare](https://shakespeare.diy)
