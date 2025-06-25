// MelodyHub - Main JavaScript File

// Music Search Class
class MusicSearch {
    constructor() {
        // Last.fm API - free, CORS-enabled, and comprehensive
        this.apiKey = '4a9f5581a9cdf20a699f540ac52a95c9'; // Public demo key from Last.fm docs
        this.baseUrl = 'https://ws.audioscrobbler.com/2.0/';
        
        // Enhanced fallback data for instant results
        this.fallbackArtists = {
            'taylor swift': {
                name: 'Taylor Swift',
                country: 'United States',
                genre: 'Pop, Country',
                formed: '2006',
                biography: 'American singer-songwriter known for narrative songwriting that often centers around her personal life.',
                image: 'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png',
                albums: ['Fearless', '1989', 'Folklore', 'Midnights'],
                topSongs: ['Shake It Off', 'Love Story', 'Anti-Hero', 'Blank Space'],
                listeners: '5000000',
                playcount: '800000000'
            },
            'ed sheeran': {
                name: 'Ed Sheeran',
                country: 'United Kingdom',
                genre: 'Pop, Folk',
                formed: '2004',
                biography: 'English singer-songwriter known for his acoustic guitar performances and melodic pop songs.',
                image: 'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png',
                albums: ['÷ (Divide)', '× (Multiply)', '+ (Plus)', '= (Equals)'],
                topSongs: ['Shape of You', 'Perfect', 'Thinking Out Loud', 'Photograph'],
                listeners: '4500000',
                playcount: '600000000'
            },
            'adele': {
                name: 'Adele',
                country: 'United Kingdom',
                genre: 'Soul, Pop',
                formed: '2006',
                biography: 'English singer-songwriter known for her powerful vocals and emotional ballads.',
                image: 'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png',
                albums: ['19', '21', '25', '30'],
                topSongs: ['Someone Like You', 'Hello', 'Rolling in the Deep', 'Easy On Me'],
                listeners: '4000000',
                playcount: '500000000'
            },
            'coldplay': {
                name: 'Coldplay',
                country: 'United Kingdom',
                genre: 'Rock, Pop',
                formed: '1996',
                biography: 'British rock band formed in London, known for their atmospheric sound.',
                image: 'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png',
                albums: ['Parachutes', 'A Rush of Blood to the Head', 'X&Y', 'Viva la Vida'],
                topSongs: ['Yellow', 'Fix You', 'Viva la Vida', 'Something Just Like This'],
                listeners: '3500000',
                playcount: '400000000'
            },
            'the weeknd': {
                name: 'The Weeknd',
                country: 'Canada',
                genre: 'R&B, Pop',
                formed: '2009',
                biography: 'Canadian singer, songwriter, and record producer known for his falsetto vocals.',
                image: 'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png',
                albums: ['House of Balloons', 'Beauty Behind the Madness', 'After Hours', 'Dawn FM'],
                topSongs: ['Blinding Lights', 'Can\'t Feel My Face', 'The Hills', 'Starboy'],
                listeners: '3000000',
                playcount: '350000000'
            }
        };
    }

    setupEventListeners() {
        const searchInput = document.getElementById('artistSearch');
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchArtist();
                }
            });
        }
    }

    async searchArtist() {
        const searchInput = document.getElementById('artistSearch');
        if (!searchInput) {
            console.error('Search input not found');
            return;
        }

        const query = searchInput.value.trim();
        if (!query) {
            this.showError('Please enter an artist name to search.');
            return;
        }

        this.showLoading(true);
        this.clearResults();

        try {
            // First, try Last.fm API (CORS-enabled and comprehensive)
            const lastFmUrl = `${this.baseUrl}?method=artist.search&artist=${encodeURIComponent(query)}&api_key=${this.apiKey}&format=json&limit=10`;
            
            console.log('Trying Last.fm API:', lastFmUrl);
            
            const response = await fetch(lastFmUrl);
            
            if (response.ok) {
                const data = await response.json();
                console.log('Last.fm API Response:', data);
                
                if (data && data.results && data.results.artistmatches && data.results.artistmatches.artist && data.results.artistmatches.artist.length > 0) {
                    // Get detailed info for the first few artists
                    const artists = Array.isArray(data.results.artistmatches.artist) 
                        ? data.results.artistmatches.artist.slice(0, 6)
                        : [data.results.artistmatches.artist];
                    
                    const detailedArtists = await this.getDetailedArtistInfo(artists);
                    this.displayResults(detailedArtists, query);
                    return;
                }
            }
            
            // If API didn't return results, try fallback data
            const fallbackResult = this.getFallbackArtist(query);
            if (fallbackResult) {
                console.log('Using enhanced fallback data for:', query);
                this.displayResults([fallbackResult], query);
                return;
            }

            // No results found
            this.showNoResults(query);

        } catch (error) {
            console.error('Error searching artist:', error);
            
            // Try fallback data on error
            const fallbackResult = this.getFallbackArtist(query);
            if (fallbackResult) {
                console.log('Using fallback data due to error:', query);
                this.displayResults([fallbackResult], query);
            } else {
                this.showError('Unable to search for artists at the moment. Please try again later.');
            }
        } finally {
            this.showLoading(false);
        }
    }

    async getDetailedArtistInfo(artists) {
        const detailedArtists = [];
        
        for (const artist of artists.slice(0, 4)) { // Limit to 4 to avoid rate limits
            try {
                const detailUrl = `${this.baseUrl}?method=artist.getinfo&artist=${encodeURIComponent(artist.name)}&api_key=${this.apiKey}&format=json`;
                const detailResponse = await fetch(detailUrl);
                
                if (detailResponse.ok) {
                    const detailData = await detailResponse.json();
                    
                    if (detailData && detailData.artist) {
                        const artistInfo = detailData.artist;
                        
                        // Get top tracks for this artist
                        const tracksUrl = `${this.baseUrl}?method=artist.gettoptracks&artist=${encodeURIComponent(artist.name)}&api_key=${this.apiKey}&format=json&limit=5`;
                        const tracksResponse = await fetch(tracksUrl);
                        let topTracks = [];
                        
                        if (tracksResponse.ok) {
                            const tracksData = await tracksResponse.json();
                            if (tracksData && tracksData.toptracks && tracksData.toptracks.track) {
                                const tracks = Array.isArray(tracksData.toptracks.track) 
                                    ? tracksData.toptracks.track 
                                    : [tracksData.toptracks.track];
                                topTracks = tracks.slice(0, 4).map(track => track.name);
                            }
                        }
                        
                        detailedArtists.push({
                            name: artistInfo.name,
                            biography: this.cleanBiography(artistInfo.bio?.summary || artistInfo.bio?.content || 'No biography available'),
                            listeners: artistInfo.stats?.listeners || '0',
                            playcount: artistInfo.stats?.playcount || '0',
                            image: this.getBestImage(artistInfo.image),
                            topSongs: topTracks,
                            url: artistInfo.url,
                            tags: artistInfo.tags?.tag ? artistInfo.tags.tag.slice(0, 3).map(tag => tag.name).join(', ') : 'Unknown',
                            mbid: artistInfo.mbid
                        });
                    }
                }
                
                // Small delay to respect rate limits
                await new Promise(resolve => setTimeout(resolve, 100));
                
            } catch (error) {
                console.log('Error getting detailed info for', artist.name, error);
                // Add basic info if detailed fetch fails
                detailedArtists.push({
                    name: artist.name,
                    biography: 'Artist information available on Last.fm',
                    listeners: artist.listeners || '0',
                    playcount: '0',
                    image: this.getBestImage(artist.image),
                    topSongs: [],
                    url: artist.url || '',
                    tags: 'Music',
                    mbid: artist.mbid || ''
                });
            }
        }
        
        return detailedArtists;
    }

    getBestImage(images) {
        if (!images || !Array.isArray(images)) return null;
        
        // Try to get the largest image available
        const sizeOrder = ['extralarge', 'large', 'medium', 'small'];
        for (const size of sizeOrder) {
            const img = images.find(img => img.size === size);
            if (img && img['#text'] && img['#text'].trim()) {
                return img['#text'];
            }
        }
        return null;
    }

    cleanBiography(bio) {
        if (!bio) return 'No biography available';
        
        // Remove HTML tags and clean up the text
        return bio
            .replace(/<[^>]*>/g, '') // Remove HTML tags
            .replace(/\s+/g, ' ')    // Replace multiple spaces with single space
            .trim()
            .substring(0, 200);      // Limit length
    }

    getFallbackArtist(query) {
        const normalizedQuery = query.toLowerCase().trim();
        return this.fallbackArtists[normalizedQuery] || null;
    }

    showNoResults(query) {
        const resultsContainer = document.getElementById('search-results');
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div class="text-center">
                    <div class="music-card">
                        <i class="fas fa-search fa-3x mb-3" style="color: var(--accent-color);"></i>
                        <h4>No Results Found</h4>
                        <p>We couldn't find any artists matching "${query}".</p>
                        <div class="mt-4">
                            <h5>Try searching for these popular artists:</h5>
                            <div class="row mt-3">
                                ${Object.keys(this.fallbackArtists).map(artist => `
                                    <div class="col-md-6 col-lg-4 mb-2">
                                        <button class="btn btn-outline-light btn-sm w-100" onclick="document.getElementById('artistSearch').value='${artist}'; searchArtist();">
                                            ${this.capitalizeWords(artist)}
                                        </button>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    capitalizeWords(str) {
        return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    displayResults(artists, query) {
        const resultsContainer = document.getElementById('search-results');
        if (!resultsContainer) {
            console.error('Results container not found');
            return;
        }
        
        if (!artists || artists.length === 0) {
            this.showNoResults(query);
            return;
        }

        let htmlContent = `<h2 class="mb-4">Search Results for "${query}"</h2><div class="row">`;

        artists.forEach((artist, index) => {
            const artistName = artist.name || 'Unknown Artist';
            const artistBio = artist.biography || 'No biography available';
            const artistListeners = artist.listeners ? this.formatNumber(artist.listeners) : 'N/A';
            const artistPlaycount = artist.playcount ? this.formatNumber(artist.playcount) : 'N/A';
            const artistImage = artist.image || null;
            const artistTopSongs = artist.topSongs || [];
            const artistTags = artist.tags || artist.genre || 'Music';
            const artistUrl = artist.url || '';

            htmlContent += `
                <div class="col-lg-6 col-xl-4 mb-4">
                    <div class="music-card">
                        <div class="text-center mb-3">
                            ${artistImage ? `
                                <img src="${artistImage}" alt="${artistName}" 
                                     class="img-fluid rounded-circle mb-3" 
                                     style="width: 120px; height: 120px; object-fit: cover;"
                                     onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                                <i class="fas fa-user-circle fa-4x mb-3" style="color: var(--secondary-color); display: none;"></i>
                            ` : `
                                <i class="fas fa-user-circle fa-4x mb-3" style="color: var(--secondary-color);"></i>
                            `}
                            <h5 class="mb-1">${this.escapeHtml(artistName)}</h5>
                            <small class="text-muted">Last.fm Artist</small>
                        </div>
                        
                        <div class="row mb-3">
                            <div class="col-6">
                                <p class="mb-1">
                                    <i class="fas fa-users me-2"></i>
                                    <strong>Listeners:</strong>
                                </p>
                                <small>${artistListeners}</small>
                            </div>
                            <div class="col-6">
                                <p class="mb-1">
                                    <i class="fas fa-play me-2"></i>
                                    <strong>Plays:</strong>
                                </p>
                                <small>${artistPlaycount}</small>
                            </div>
                        </div>
                        
                        <p class="mb-2">
                            <i class="fas fa-tags me-2"></i>
                            <strong>Genre:</strong> ${this.escapeHtml(artistTags)}
                        </p>
                        
                        ${artistTopSongs.length > 0 ? `
                            <div class="mb-3">
                                <h6><i class="fas fa-star me-2"></i>Top Tracks:</h6>
                                <div class="row">
                                    ${artistTopSongs.slice(0, 4).map(song => `
                                        <div class="col-6 mb-1">
                                            <small class="text-muted">• ${this.escapeHtml(song)}</small>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                        
                        ${artistBio && artistBio !== 'No biography available' ? `
                            <div class="mb-3">
                                <h6><i class="fas fa-info-circle me-2"></i>About:</h6>
                                <p class="small text-muted">${this.escapeHtml(this.truncateText(artistBio, 150))}...</p>
                            </div>
                        ` : ''}
                        
                        ${artistUrl ? `
                            <div class="text-center mt-3">
                                <a href="${artistUrl}" target="_blank" class="btn btn-outline-light btn-sm">
                                    <i class="fas fa-external-link-alt me-2"></i>View on Last.fm
                                </a>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        });

        htmlContent += '</div>';
        resultsContainer.innerHTML = htmlContent;
    }

    formatNumber(num) {
        if (!num) return 'N/A';
        const number = parseInt(num);
        if (number >= 1000000) {
            return (number / 1000000).toFixed(1) + 'M';
        } else if (number >= 1000) {
            return (number / 1000).toFixed(1) + 'K';
        }
        return number.toLocaleString();
    }

    truncateText(text, maxLength) {
        if (!text || text.length <= maxLength) return text;
        return text.substring(0, maxLength);
    }

    showLoading(show) {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = show ? 'block' : 'none';
        }
    }

    clearResults() {
        const resultsContainer = document.getElementById('search-results');
        if (resultsContainer) {
            resultsContainer.innerHTML = '';
        }
    }

    showError(message) {
        const resultsContainer = document.getElementById('search-results');
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    ${message}
                </div>
            `;
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Featured Content Class
class FeaturedContent {
    constructor() {
        this.featuredArtists = ['Taylor Swift', 'Ed Sheeran', 'Adele'];
    }

    async loadFeaturedArtists() {
        const container = document.getElementById('featured-artists');
        if (!container) return;

        container.innerHTML = '<div class="col-12 text-center"><div class="spinner"></div><p>Loading featured artists...</p></div>';

        try {
            // Use the same search functionality to get featured artists
            const musicSearch = new MusicSearch();
            const featuredData = [];
            
            for (const artistName of this.featuredArtists) {
                const artist = musicSearch.getFallbackArtist(artistName);
                if (artist) {
                    featuredData.push(artist);
                }
            }
            
            this.displayFeaturedArtists(featuredData);
        } catch (error) {
            console.error('Error loading featured artists:', error);
            container.innerHTML = `
                <div class="col-12">
                    <div class="music-card text-center">
                        <i class="fas fa-exclamation-triangle fa-2x mb-3" style="color: var(--accent-color);"></i>
                        <p>Unable to load featured artists at the moment.</p>
                    </div>
                </div>
            `;
        }
    }

    displayFeaturedArtists(artists) {
        const container = document.getElementById('featured-artists');
        if (!artists || artists.length === 0) {
            container.innerHTML = '<div class="col-12 text-center"><p>No featured artists available.</p></div>';
            return;
        }

        let htmlContent = '';
        artists.forEach(artist => {
            if (artist && artist.name) {
                htmlContent += `
                    <div class="col-lg-4 col-md-6 mb-4">
                        <div class="music-card text-center">
                            ${artist.image ? `
                                <img src="${artist.image}" alt="${artist.name}" 
                                     class="img-fluid rounded-circle mb-3" 
                                     style="width: 80px; height: 80px; object-fit: cover;"
                                     onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                                <i class="fas fa-star fa-2x mb-3" style="color: var(--accent-color); display: none;"></i>
                            ` : `
                                <i class="fas fa-star fa-2x mb-3" style="color: var(--accent-color);"></i>
                            `}
                            <h5>${this.escapeHtml(artist.name)}</h5>
                            ${artist.country ? `<p class="text-muted mb-2">${this.escapeHtml(artist.country)}</p>` : ''}
                            ${artist.topSongs && artist.topSongs.length > 0 ? `
                                <small class="text-muted">Known for: ${this.escapeHtml(artist.topSongs[0])}</small>
                            ` : ''}
                        </div>
                    </div>
                `;
            }
        });

        container.innerHTML = htmlContent || '<div class="col-12 text-center"><p>No featured artists available.</p></div>';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Contact Form Class
class ContactForm {
    constructor() {
        // Constructor is called when class is instantiated
    }

    initializeForm() {
        const form = document.getElementById('contact-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit();
            });
        }
    }

    handleSubmit() {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        // Simple form validation
        if (!name || !email || !subject || !message) {
            alert('Please fill in all fields.');
            return;
        }

        // Simulate form submission
        alert(`Thank you ${name}! Your message has been received. We'll get back to you soon.`);
        
        // Reset form
        document.getElementById('contact-form').reset();
    }
}