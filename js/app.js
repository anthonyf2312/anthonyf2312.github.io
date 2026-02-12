/**
 * Insko Bot — Main Application
 * SPA-style hash routing, data fetching, and rendering.
 */

(() => {
  'use strict';

  // ══════════════════════════════════════════════════
  // Theme Management
  // ══════════════════════════════════════════════════
  const Theme = {
    init() {
      const saved = localStorage.getItem('insko-theme');
      const prefer = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
      this.set(saved || prefer);

      document.getElementById('themeToggle').addEventListener('click', () => {
        this.set(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
      });
    },
    set(theme) {
      document.documentElement.dataset.theme = theme;
      localStorage.setItem('insko-theme', theme);
    },
  };

  // ══════════════════════════════════════════════════
  // Router (hash-based)
  // ══════════════════════════════════════════════════
  const Router = {
    current: 'home',

    init() {
      window.addEventListener('hashchange', () => this.navigate());
      this.navigate();
    },

    navigate() {
      const hash = location.hash.replace('#', '') || 'home';
      const page = document.getElementById(`page-${hash}`);
      if (!page) return;

      // Hide all pages
      document.querySelectorAll('.page').forEach(p => p.classList.remove('page--active'));
      page.classList.add('page--active');

      // Update nav links
      document.querySelectorAll('.nav__link').forEach(link => {
        link.classList.toggle('active', link.dataset.page === hash);
      });

      // Close mobile menu
      document.getElementById('navLinks').classList.remove('open');

      // Load data for the page
      this.current = hash;
      Pages[hash]?.load();

      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  };

  // ══════════════════════════════════════════════════
  // Hamburger Menu
  // ══════════════════════════════════════════════════
  function initHamburger() {
    document.getElementById('hamburger').addEventListener('click', () => {
      document.getElementById('navLinks').classList.toggle('open');
    });
  }

  // ══════════════════════════════════════════════════
  // Helpers
  // ══════════════════════════════════════════════════
  function formatUptime(seconds) {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (d > 0) return `${d}d ${h}h ${m}m`;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  }

  function formatNumber(n) {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
    return n.toLocaleString();
  }

  function ratingEmoji(r) {
    if (r >= 9.0) return '🌟';
    if (r >= 8.0) return '⭐';
    if (r >= 7.0) return '✨';
    if (r >= 6.0) return '👍';
    if (r >= 5.0) return '🤔';
    if (r >= 4.0) return '😐';
    if (r >= 3.0) return '👎';
    return '💩';
  }

  function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return `${Math.floor(days / 30)}mo ago`;
  }

  function rankDisplay(rank) {
    if (rank === 1) return '<span class="rank-medal rank-medal--1">🥇</span>';
    if (rank === 2) return '<span class="rank-medal rank-medal--2">🥈</span>';
    if (rank === 3) return '<span class="rank-medal rank-medal--3">🥉</span>';
    return `<span style="font-weight:600;color:var(--text-muted)">#${rank}</span>`;
  }

  function levelTitle(level) {
    if (level >= 100) return 'Legendary';
    if (level >= 80) return 'Master';
    if (level >= 60) return 'Expert';
    if (level >= 40) return 'Veteran';
    if (level >= 25) return 'Skilled';
    if (level >= 15) return 'Regular';
    if (level >= 5) return 'Member';
    return 'Newcomer';
  }

  const badgeEmojis = {
    stargazer: '⭐', guardian: '🛡️', artist: '🎨', chatterbox: '💬',
    dedicated: '🔥', social_butterfly: '🦋', legendary: '👑', sko: '🎭',
    helping_hand: '🤝', consistent: '📅', voice_active: '🎙️', reactor: '⚡',
  };

  function renderBadgeIcons(badges) {
    if (!badges?.length) return '';
    return badges.map(id => badgeEmojis[id] || '🏅').join(' ');
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function showLoading(container, message = 'Loading...') {
    container.innerHTML = `<div class="loading-text">${message}</div>`;
  }

  function showError(container, message = 'Failed to load data') {
    container.innerHTML = `<div class="error-text">${message}</div>`;
  }

  // ══════════════════════════════════════════════════
  // Page Controllers
  // ══════════════════════════════════════════════════
  const Pages = {
    // ── HOME ─────────────────────────────────────────
    home: {
      loaded: false,
      async load() {
        this.loadStatus();
        if (!this.loaded) {
          this.loadFeatures();
          this.loadMusicStats();
          this.loaded = true;
        }
      },

      async loadStatus() {
        try {
          const data = await API.getStatus();

          const dot = document.getElementById('statusDot');
          const statusText = document.getElementById('statusText');
          dot.className = `status-bar__indicator ${data.online ? 'online' : 'offline'}`;
          statusText.textContent = data.online ? 'Online' : 'Offline';

          document.getElementById('uptimeText').textContent = formatUptime(data.uptime);
          document.getElementById('membersText').textContent = formatNumber(data.members);
          document.getElementById('dbText').textContent = data.database === 'connected' ? 'Connected' : 'Disconnected';
        } catch {
          document.getElementById('statusText').textContent = 'Offline';
          document.getElementById('statusDot').className = 'status-bar__indicator offline';
          document.getElementById('uptimeText').textContent = '—';
          document.getElementById('membersText').textContent = '—';
          document.getElementById('dbText').textContent = '—';
        }
      },

      async loadFeatures() {
        const grid = document.getElementById('featuresGrid');
        try {
          const data = await API.getFeatures();
          grid.innerHTML = data.features.map(f => `
            <div class="feature-card">
              <div class="feature-card__header">
                <div class="feature-card__emoji">${f.emoji}</div>
                <div class="feature-card__name">${f.name}</div>
              </div>
              <p class="feature-card__desc">${f.description}</p>
              <div class="feature-card__tags">
                ${f.highlights.map(h => `<span class="feature-card__tag">${h}</span>`).join('')}
              </div>
            </div>
          `).join('');
        } catch {
          // Use static fallback
          grid.innerHTML = `
            <div class="feature-card">
              <div class="feature-card__header">
                <div class="feature-card__emoji">🆔</div>
                <div class="feature-card__name">Passport & Profiles</div>
              </div>
              <p class="feature-card__desc">Personalised profile cards with levels, badges, and stats.</p>
            </div>
            <div class="feature-card">
              <div class="feature-card__header">
                <div class="feature-card__emoji">📊</div>
                <div class="feature-card__name">XP & Leveling</div>
              </div>
              <p class="feature-card__desc">Earn XP from messages, voice, and reactions. Level up to 100.</p>
            </div>
            <div class="feature-card">
              <div class="feature-card__header">
                <div class="feature-card__emoji">🏆</div>
                <div class="feature-card__name">Badges</div>
              </div>
              <p class="feature-card__desc">12 unique badges with 5 tiers each, auto-awarded.</p>
            </div>
            <div class="feature-card">
              <div class="feature-card__header">
                <div class="feature-card__emoji">🎵</div>
                <div class="feature-card__name">Music Ratings</div>
              </div>
              <p class="feature-card__desc">Rate songs, albums, and EPs. Browse community ratings.</p>
            </div>
            <div class="feature-card">
              <div class="feature-card__header">
                <div class="feature-card__emoji">🎧</div>
                <div class="feature-card__name">Last.fm Integration</div>
              </div>
              <p class="feature-card__desc">Listening stats, leaderboards, and taste comparisons.</p>
            </div>
            <div class="feature-card">
              <div class="feature-card__header">
                <div class="feature-card__emoji">📺</div>
                <div class="feature-card__name">YouTube Notifications</div>
              </div>
              <p class="feature-card__desc">Real-time alerts for uploads and live streams.</p>
            </div>
          `;
        }
      },

      async loadMusicStats() {
        const grid = document.getElementById('homeStatsGrid');
        try {
          const data = await API.getMusicStats();
          grid.innerHTML = `
            <div class="stat-card">
              <div class="stat-card__value">${formatNumber(data.totalRatings)}</div>
              <div class="stat-card__label">Total Ratings</div>
            </div>
            <div class="stat-card">
              <div class="stat-card__value">${formatNumber(data.totalSongs)}</div>
              <div class="stat-card__label">Songs Tracked</div>
            </div>
            <div class="stat-card">
              <div class="stat-card__value">${formatNumber(data.totalAlbums)}</div>
              <div class="stat-card__label">Albums Tracked</div>
            </div>
            <div class="stat-card">
              <div class="stat-card__value">${formatNumber(data.uniqueRaters)}</div>
              <div class="stat-card__label">Unique Raters</div>
            </div>
          `;
        } catch {
          grid.innerHTML = '<div class="loading-text">Stats unavailable while bot is offline</div>';
        }
      },
    },

    // ── COMMANDS ─────────────────────────────────────
    commands: {
      loaded: false,
      categories: [
        {
          id: 'general', name: 'Getting Started', emoji: '📚',
          commands: [
            { command: '/help', description: 'Open the interactive help menu with all user features.' },
          ],
        },
        {
          id: 'passport', name: 'Passport & Levels', emoji: '🆔',
          commands: [
            { command: '/passport view', description: "View your own or another member's passport profile." },
            { command: '/passport leaderboard', description: 'Show the top users by level and total XP.' },
            { command: '/passport setbackground', description: 'Set or reset your passport background image (Level 15+).' },
            { command: '/passporttemplate psd', description: 'Download a blank template for custom passport backgrounds.' },
            { command: '/level view', description: 'Check current level progress, XP details, and next milestone.' },
            { command: '/rewards', description: 'See all level rewards and your unlock progress.' },
            { command: '/privacy mydata', description: 'View your stored data and privacy controls.' },
          ],
        },
        {
          id: 'lastfm', name: 'Last.fm', emoji: '🎧',
          commands: [
            { command: '/lastfm link', description: 'Connect your Last.fm account to your Discord profile.' },
            { command: '/lastfm unlink', description: 'Disconnect your Last.fm account.' },
            { command: '/lastfm nowplaying', description: 'Show your current track with listening context.' },
            { command: '/lastfm recent', description: 'View your recently played tracks.' },
            { command: '/lastfm streak', description: 'Check your active listening streaks.' },
            { command: '/lastfm overview', description: 'Get a quick weekly overview of listening activity.' },
            { command: '/lastfm profile', description: 'View a Last.fm profile summary.' },
            { command: '/lastfm toptracks', description: 'Show your top tracks for a selected period.' },
            { command: '/lastfm topartists', description: 'Show your top artists for a selected period.' },
            { command: '/lastfm topalbums', description: 'Show your top albums for a selected period.' },
            { command: '/lastfm topgenres', description: 'Show your most listened genres.' },
            { command: '/lastfm whoknows', description: 'See who in the server listens to an artist the most.' },
            { command: '/lastfm whoknowstrack', description: 'See who in the server listens to a track the most.' },
            { command: '/lastfm whoknowsalbum', description: 'See who in the server listens to an album the most.' },
            { command: '/lastfm taste', description: 'Compare your music taste with another member.' },
          ],
        },
        {
          id: 'ratings', name: 'Music Ratings', emoji: '🎵',
          commands: [
            { command: '/rate', description: 'Rate a song, album, or EP on a 1.0 to 10.0 scale.' },
            { command: '/editrating', description: 'Edit one of your existing ratings.' },
            { command: '/ratings', description: 'Browse recent, top rated, or most popular community ratings.' },
          ],
        },
        {
          id: 'reactionbox', name: 'Reaction Box', emoji: '🎤',
          commands: [
            { command: '/reactionbox submit', description: 'Submit a song for Insko reaction consideration.' },
            { command: '/reactionbox status', description: 'View current reaction box cycle and status.' },
          ],
        },
        {
          id: 'community', name: 'Community', emoji: '⭐',
          commands: [
            { command: 'Apps → Report Message', description: 'Right-click a message and report it to moderators.' },
          ],
        },
      ],

      async load() {
        if (!this.loaded) {
          this.initSearch();
          this.loaded = true;
        }
        this.render(document.getElementById('commandSearch')?.value?.trim() ?? '');
      },

      initSearch() {
        const input = document.getElementById('commandSearch');
        if (!input) return;

        let timer = null;
        input.addEventListener('input', () => {
          if (timer) clearTimeout(timer);
          timer = setTimeout(() => this.render(input.value.trim()), 120);
        });
      },

      render(query) {
        const container = document.getElementById('commandDocs');
        const normalized = (query || '').toLowerCase();

        const filtered = this.categories
          .map((category) => ({
            ...category,
            commands: (category.commands || []).filter((cmd) => {
              if (!normalized) return true;
              const commandText = String(cmd.command || '').toLowerCase();
              const descriptionText = String(cmd.description || '').toLowerCase();
              return commandText.includes(normalized) || descriptionText.includes(normalized);
            }),
          }))
          .filter((category) => category.commands.length > 0);

        if (!filtered.length) {
          container.innerHTML = '<div class="loading-text">No matching commands found</div>';
          return;
        }

        container.innerHTML = filtered.map((category) => `
          <article class="command-category">
            <header class="command-category__header">
              <div class="command-category__title-wrap">
                <span class="command-category__emoji">${escapeHtml(category.emoji || '📌')}</span>
                <h3 class="command-category__title">${escapeHtml(category.name || 'Commands')}</h3>
              </div>
              <span class="command-category__count">${category.commands.length} commands</span>
            </header>
            <div class="command-list">
              ${category.commands.map((cmd) => `
                <div class="command-item">
                  <div class="command-item__name">${escapeHtml(cmd.command || '')}</div>
                  <p class="command-item__desc">${escapeHtml(cmd.description || '')}</p>
                </div>
              `).join('')}
            </div>
          </article>
        `).join('');
      },
    },

    // ── LEADERBOARD ──────────────────────────────────
    leaderboard: {
      page: 1,
      loaded: false,
      searchQuery: '',

      async load() {
        if (!this.loaded) {
          this.initSearch();
          this.loaded = true;
        }
        this.fetchPage(1);
      },

      initSearch() {
        const input = document.getElementById('userSearch');
        const btn = document.getElementById('userSearchBtn');

        let timer = null;

        const doSearch = () => {
          const q = input.value.trim();
          this.searchQuery = q;
          // Hide user card — search now filters the table directly
          const result = document.getElementById('userResult');
          if (result) { result.classList.add('hidden'); result.innerHTML = ''; }
          this.fetchPage(1);
        };

        input.addEventListener('input', () => {
          if (timer) clearTimeout(timer);
          timer = setTimeout(doSearch, 250);
        });

        btn.addEventListener('click', doSearch);
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') { if (timer) clearTimeout(timer); doSearch(); }
        });
      },

      async searchUser(query) {
        const result = document.getElementById('userResult');
        result.classList.remove('hidden');
        result.innerHTML = '<div class="loading-text">Searching...</div>';

        try {
          const data = await API.getUser(query);
          if (!data.found) {
            result.innerHTML = '<div class="loading-text">No user found</div>';
            return;
          }

          const u = data.user;
          const name = u.displayName || u.userId;
          result.innerHTML = `
            <div class="user-result__header">
              <div>
                <div class="user-result__name">${name}</div>
                <div class="user-result__rank">Rank #${u.rank} · Level ${u.level} · ${levelTitle(u.level)}</div>
              </div>
            </div>
            <div class="user-result__stats">
              <div class="user-result__stat">
                <div class="user-result__stat-value">${formatNumber(u.totalXp)}</div>
                <div class="user-result__stat-label">Total XP</div>
              </div>
              <div class="user-result__stat">
                <div class="user-result__stat-value">${formatNumber(u.messages)}</div>
                <div class="user-result__stat-label">Messages</div>
              </div>
              <div class="user-result__stat">
                <div class="user-result__stat-value">${Math.round(u.voiceMinutes / 60)}h</div>
                <div class="user-result__stat-label">Voice Hours</div>
              </div>
              <div class="user-result__stat">
                <div class="user-result__stat-value">${u.currentStreak}</div>
                <div class="user-result__stat-label">Current Streak</div>
              </div>
              <div class="user-result__stat">
                <div class="user-result__stat-value">${formatNumber(u.starsReceived)}</div>
                <div class="user-result__stat-label">Stars Received</div>
              </div>
              <div class="user-result__stat">
                <div class="user-result__stat-value">${renderBadgeIcons(u.badges) || 'None'}</div>
                <div class="user-result__stat-label">Badges</div>
              </div>
            </div>
          `;
        } catch (err) {
          result.innerHTML = `<div class="error-text">${err.message}</div>`;
        }
      },

      async fetchPage(page) {
        this.page = page;
        const body = document.getElementById('leaderboardBody');
        const pagination = document.getElementById('leaderboardPagination');
        const search = this.searchQuery || '';

        body.innerHTML = `<tr><td colspan="7"><div class="loading-text">${search ? 'Searching...' : 'Loading leaderboard...'}</div></td></tr>`;

        try {
          const data = await API.getLeaderboard(page, 15, search);

          if (!data.entries.length && search) {
            body.innerHTML = `<tr><td colspan="7"><div class="loading-text">No members found matching "${escapeHtml(search)}"</div></td></tr>`;
            pagination.innerHTML = '';
            return;
          }

          body.innerHTML = data.entries.map(e => `
            <tr>
              <td>${rankDisplay(e.rank)}</td>
              <td style="font-weight:500">${e.displayName || e.userId}</td>
              <td>
                <span style="font-weight:600">${e.level}</span>
                <span style="color:var(--text-muted);font-size:0.78rem;margin-left:4px">${levelTitle(e.level)}</span>
              </td>
              <td>${formatNumber(e.totalXp)}</td>
              <td>${formatNumber(e.messages)}</td>
              <td class="hide-mobile">${Math.round(e.voiceMinutes / 60)}h</td>
              <td class="hide-mobile">${renderBadgeIcons(e.badges)}</td>
            </tr>
          `).join('');

          // Pagination
          if (data.pages > 1) {
            let html = '';
            html += `<button class="pagination__btn" ${page <= 1 ? 'disabled' : ''} onclick="Pages.leaderboard.fetchPage(${page - 1})">‹ Prev</button>`;

            for (let i = 1; i <= data.pages; i++) {
              if (data.pages > 7 && Math.abs(i - page) > 2 && i !== 1 && i !== data.pages) {
                if (i === page - 3 || i === page + 3) html += '<span style="color:var(--text-muted);padding:0 4px">...</span>';
                continue;
              }
              html += `<button class="pagination__btn ${i === page ? 'active' : ''}" onclick="Pages.leaderboard.fetchPage(${i})">${i}</button>`;
            }

            html += `<button class="pagination__btn" ${page >= data.pages ? 'disabled' : ''} onclick="Pages.leaderboard.fetchPage(${page + 1})">Next ›</button>`;
            pagination.innerHTML = html;
          } else {
            pagination.innerHTML = '';
          }
        } catch (err) {
          body.innerHTML = `<tr><td colspan="7"><div class="error-text">${err.message}</div></td></tr>`;
        }
      },
    },

    // ── BADGES ───────────────────────────────────────
    badges: {
      loaded: false,
      async load() {
        if (this.loaded) return;
        this.loaded = true;

        const grid = document.getElementById('badgeGrid');
        showLoading(grid, 'Loading badges...');

        try {
          const data = await API.getBadges();

          grid.innerHTML = data.badges.map(badge => `
            <div class="badge-card">
              <div class="badge-card__header">
                <span class="badge-card__emoji">${badge.emoji}</span>
                <span class="badge-card__name">${badge.name}</span>
              </div>
              <p class="badge-card__desc">${badge.description}</p>
              <div class="badge-card__tiers">
                ${badge.tiers.map(t => `
                  <div class="badge-tier">
                    <div style="display:flex;align-items:center">
                      <span class="badge-tier__number">${badge.noTiers ? '★' : t.tier}</span>
                      <span class="badge-tier__name">${t.name}</span>
                    </div>
                    <span class="badge-tier__req">${t.description}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('');
        } catch (err) {
          showError(grid, err.message);
        }
      },
    },

    // ── RATINGS ──────────────────────────────────────
    ratings: {
      currentTab: 'recent',
      currentType: 'all',
      loaded: false,

      async load() {
        if (!this.loaded) {
          this.initTabs();
          this.initFilters();
          this.loaded = true;
        }
        this.fetchRatings();
      },

      initTabs() {
        document.querySelectorAll('#page-ratings .tab').forEach(tab => {
          tab.addEventListener('click', () => {
            document.querySelectorAll('#page-ratings .tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            this.currentTab = tab.dataset.tab;
            this.fetchRatings();
          });
        });
      },

      initFilters() {
        document.querySelectorAll('#page-ratings .chip').forEach(chip => {
          chip.addEventListener('click', () => {
            document.querySelectorAll('#page-ratings .chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            this.currentType = chip.dataset.type;
            this.fetchRatings();
          });
        });
      },

      async fetchRatings() {
        const list = document.getElementById('ratingsList');
        showLoading(list, 'Loading ratings...');

        try {
          let data;
          switch (this.currentTab) {
            case 'recent':
              data = await API.getRecentRatings(this.currentType, 20);
              this.renderRecent(list, data.ratings);
              break;
            case 'top':
              data = await API.getTopRated(this.currentType, 20);
              this.renderTopOrPopular(list, data.items, 'rating');
              break;
            case 'popular':
              data = await API.getMostPopular(this.currentType, 20);
              this.renderTopOrPopular(list, data.items, 'count');
              break;
          }
        } catch (err) {
          showError(list, err.message);
        }
      },

      renderRecent(container, ratings) {
        if (!ratings?.length) {
          container.innerHTML = '<div class="loading-text">No ratings found</div>';
          return;
        }

        container.innerHTML = ratings.map(r => `
          <div class="rating-card">
            ${r.albumArt
              ? `<img class="rating-card__art" src="${r.albumArt}" alt="${r.title}" loading="lazy">`
              : `<div class="rating-card__art rating-card__art--placeholder">${ratingEmoji(r.rating)}</div>`
            }
            <div class="rating-card__info">
              <div class="rating-card__title">${r.title}</div>
              <div class="rating-card__artist">${r.artist}</div>
              <div class="rating-card__meta">
                <span class="rating-card__type">${r.type}</span>
                <span>· @${r.userId} · ${timeAgo(r.date)}</span>
              </div>
            </div>
            <div class="rating-card__score">
              <div class="rating-card__rating">${r.rating.toFixed(1)}</div>
              <div class="rating-card__avg">avg ${r.averageRating.toFixed(1)} (${r.ratingCount})</div>
            </div>
          </div>
        `).join('');
      },

      renderTopOrPopular(container, items, mode) {
        if (!items?.length) {
          container.innerHTML = '<div class="loading-text">No items found</div>';
          return;
        }

        container.innerHTML = items.map((item, i) => `
          <div class="rating-card">
            ${item.albumArt
              ? `<img class="rating-card__art" src="${item.albumArt}" alt="${item.title}" loading="lazy">`
              : `<div class="rating-card__art rating-card__art--placeholder">${rankDisplay(i + 1)}</div>`
            }
            <div class="rating-card__info">
              <div class="rating-card__title">${item.title}</div>
              <div class="rating-card__artist">${item.artist}</div>
              <div class="rating-card__meta">
                <span class="rating-card__type">${item.type}</span>
              </div>
            </div>
            <div class="rating-card__score">
              <div class="rating-card__rating">${mode === 'rating' ? item.averageRating.toFixed(1) : item.ratingCount}</div>
              <div class="rating-card__avg">${mode === 'rating' ? `${item.ratingCount} ratings` : `avg ${item.averageRating.toFixed(1)}`}</div>
            </div>
          </div>
        `).join('');
      },
    },

    // ── MUSIC STATS ──────────────────────────────────
    music: {
      loaded: false,
      async load() {
        if (this.loaded) return;
        this.loaded = true;

        this.loadStats();
        this.loadTopArtists();
        this.loadTopSongs();
      },

      async loadStats() {
        const grid = document.getElementById('musicStatsGrid');

        try {
          const data = await API.getMusicStats();
          grid.innerHTML = `
            <div class="stat-card">
              <div class="stat-card__value">${formatNumber(data.totalRatings)}</div>
              <div class="stat-card__label">Total Ratings</div>
            </div>
            <div class="stat-card">
              <div class="stat-card__value">${formatNumber(data.totalSongs)}</div>
              <div class="stat-card__label">Songs</div>
            </div>
            <div class="stat-card">
              <div class="stat-card__value">${formatNumber(data.totalAlbums)}</div>
              <div class="stat-card__label">Albums & EPs</div>
            </div>
            <div class="stat-card">
              <div class="stat-card__value">${formatNumber(data.uniqueRaters)}</div>
              <div class="stat-card__label">Unique Raters</div>
            </div>
            ${data.topRatedSong ? `
              <div class="stat-card" style="grid-column:span 2">
                <div class="stat-card__value">${ratingEmoji(data.topRatedSong.rating)} ${data.topRatedSong.rating.toFixed(1)}</div>
                <div class="stat-card__label">Top Rated: ${data.topRatedSong.title} — ${data.topRatedSong.artist}</div>
              </div>
            ` : ''}
          `;
        } catch {
          grid.innerHTML = '<div class="loading-text">Stats unavailable while bot is offline</div>';
        }
      },

      async loadTopArtists() {
        const list = document.getElementById('topArtistsList');
        showLoading(list, 'Loading artists...');

        try {
          const data = await API.getTopArtists();
          if (!data.artists?.length) {
            list.innerHTML = '<div class="loading-text">No rated artists yet</div>';
            return;
          }

          list.innerHTML = data.artists.map((a, i) => `
            <div class="music-item">
              <div class="music-item__rank">${i + 1}</div>
              <div class="music-item__info">
                <div class="music-item__name">${a.artist}</div>
                <div class="music-item__detail">${a.totalRatings} ratings · ${a.songCount} songs · ${a.albumCount} albums</div>
              </div>
              <div class="music-item__rating">${a.avgRating.toFixed(1)}</div>
            </div>
          `).join('');
        } catch (err) {
          showError(list, err.message);
        }
      },

      async loadTopSongs() {
        const list = document.getElementById('topSongsList');
        showLoading(list, 'Loading songs...');

        try {
          const data = await API.getTopSongs();
          if (!data.songs?.length) {
            list.innerHTML = '<div class="loading-text">No rated songs yet</div>';
            return;
          }

          list.innerHTML = data.songs.map((s, i) => `
            <div class="music-item">
              <div class="music-item__rank">${i + 1}</div>
              <div class="music-item__info">
                <div class="music-item__name">${s.title}</div>
                <div class="music-item__detail">${s.artist}${s.album ? ` · ${s.album}` : ''}</div>
              </div>
              <div class="music-item__rating">${s.averageRating.toFixed(1)}</div>
            </div>
          `).join('');
        } catch (err) {
          showError(list, err.message);
        }
      },
    },
  };

  // Make Pages globally accessible for onclick handlers in pagination
  window.Pages = Pages;

  // ══════════════════════════════════════════════════
  // Auto-refresh status every 60 seconds
  // ══════════════════════════════════════════════════
  setInterval(() => {
    if (Router.current === 'home') {
      Pages.home.loadStatus();
    }
  }, 60_000);

  // ══════════════════════════════════════════════════
  // Initialize
  // ══════════════════════════════════════════════════
  Theme.init();
  initHamburger();
  Router.init();
})();
