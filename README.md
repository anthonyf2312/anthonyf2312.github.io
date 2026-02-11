# Insko Bot — Website

The official website for Insko Bot, hosted on GitHub Pages.

## Setup

1. **Copy your bot images** into the `assets/` folder:
   - `profile.png` — Bot avatar (1024×1024)
   - `banner.png` — Bot banner (680×240)

2. **Update the API URL** in `js/api.js` if your Cybrancee server URL changes:
   ```js
   const BASE_URL = 'http://87.106.63.126:5028';
   ```

3. **Push to GitHub** as your GitHub Pages repository:
   ```bash
   git init
   git add .
   git commit -m "Initial website"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

4. **Enable GitHub Pages** in the repo Settings → Pages → Source: `main` branch, `/ (root)`.

## Architecture

```
GitHub Pages (static site)  ←→  Bot API (Cybrancee)
   index.html                    /api/status
   css/style.css                 /api/leaderboard
   js/api.js                     /api/user
   js/app.js                     /api/badges
   assets/                       /api/ratings/*
                                 /api/music/*
                                 /api/features
```

The website fetches live data from the bot's HTTP server via REST API endpoints.
CORS headers are included on all API responses to allow cross-origin requests.

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/status` | Bot status, uptime, member count |
| `GET /api/leaderboard?page=1&limit=15` | XP leaderboard (paginated) |
| `GET /api/user?q=userId` | Search user by Discord user ID |
| `GET /api/badges` | All badge definitions with tiers |
| `GET /api/ratings/recent?type=all&limit=20` | Recent community ratings |
| `GET /api/ratings/top?type=all&limit=20` | Top rated songs/albums |
| `GET /api/ratings/popular?type=all&limit=20` | Most rated songs/albums |
| `GET /api/music/top-artists` | Top rated artists |
| `GET /api/music/top-songs` | Highest rated songs |
| `GET /api/music/stats` | Overall music statistics |
| `GET /api/features` | Feature list for homepage |

## Customisation

- **Theme colours**: Edit CSS variables in `css/style.css` under `:root`
- **Light/dark mode**: Automatic based on OS preference, with manual toggle
- **Font**: Inter from Google Fonts
