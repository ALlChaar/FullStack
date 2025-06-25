# MelodyHub - Music Discovery Website

**Developer:** Charbel Al Chaar

## 🎵 Project Description

MelodyHub is a modern, responsive music discovery platform that allows users to explore artists, discover new music, and learn about their favorite musicians. Built with a focus on user experience and modern web technologies, the application provides an intuitive interface for music enthusiasts to search for artists and access detailed information about their music, biography, and statistics.

The platform features a sleek dark theme with gradient accents, smooth animations, and a fully responsive design that works seamlessly across desktop and mobile devices. Users can search for any artist and receive comprehensive information including top tracks, listener statistics, genres, and biographical details.

## 🔌 API Integration

**Primary API:** [Last.fm API](https://www.last.fm/api)
- **API Key:** Public demo key from Last.fm documentation
- **Endpoints Used:**
  - `artist.search` - Search for artists by name
  - `artist.getinfo` - Get detailed artist information
  - `artist.gettoptracks` - Retrieve top tracks for an artist
- **Features:** CORS-enabled, comprehensive music database, real-time data
- **Fallback System:** Local data for popular artists (Taylor Swift, Ed Sheeran, Adele, Coldplay, The Weeknd) ensures functionality even when API is unavailable

## 🗂️ Navigation System Implementation

### Tabbed Navigation with JavaScript

The project implements a sophisticated navigation system using **ES6 classes** and **manual routing** with anchor links. Here's how it works:

#### 1. **File-Based Navigation Structure**
```javascript
// Each page is a separate HTML file with consistent navigation
index.html      // Home page
discover.html   // Music discovery page  
about.html      // About page with contact form
```

#### 2. **Dynamic Content Loading (Original Implementation)**
The original single-page application used a `Navigation` class for dynamic content switching:

```javascript
class Navigation {
    constructor() {
        this.currentPage = 'home';
        this.pages = {};
        this.initializeNavigation();
        this.loadPages();
    }

    navigateTo(page) {
        // Hide all page content
        const container = document.getElementById('page-container');
        
        // Load new page template
        container.innerHTML = this.pages[page];
        
        // Update active navigation state
        this.updateActiveNav(page);
        
        // Initialize page-specific functionality
        this.initializePageFunctionality(page);
    }
}
```

#### 3. **Current Multi-File Implementation**
The refactored version uses standard HTML navigation with enhanced JavaScript:

```html
<!-- Consistent navigation across all pages -->
<nav class="navbar navbar-expand-lg navbar-dark navbar-custom fixed-top">
    <div class="container">
        <a class="navbar-brand" href="index.html">
            <i class="fas fa-music me-2"></i>MelodyHub
        </a>
        <div class="collapse navbar-collapse">
            <ul class="navbar-nav ms-auto">
                <li class="nav-item">
                    <a class="nav-link active" href="index.html">
                        <i class="fas fa-home me-1"></i>Home
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="discover.html">
                        <i class="fas fa-search me-1"></i>Discover
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="about.html">
                        <i class="fas fa-info-circle me-1"></i>About
                    </a>
                </li>
            </ul>
        </div>
    </div>
</nav>
```

#### 4. **Page-Specific JavaScript Initialization**
Each page initializes its required functionality:

```javascript
// Home Page (index.html)
document.addEventListener('DOMContentLoaded', function() {
    const featuredContent = new FeaturedContent();
    featuredContent.loadFeaturedArtists();
});

// Discover Page (discover.html)
document.addEventListener('DOMContentLoaded', function() {
    const musicSearch = new MusicSearch();
    musicSearch.setupEventListeners();
    window.searchArtist = () => musicSearch.searchArtist();
});

// About Page (about.html)
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = new ContactForm();
    contactForm.initializeForm();
});
```

#### 5. **Navigation Features**
- **Smooth Transitions:** CSS transitions for hover effects and page changes
- **Active State Management:** Visual indication of current page
- **Responsive Design:** Mobile-friendly hamburger menu using Bootstrap
- **Icon Integration:** Font Awesome icons for visual enhancement
- **Gradient Branding:** Custom gradient text for brand identity

#### 6. **Advanced Navigation Enhancements**
```css
/* Smooth hover effects */
.nav-link {
    transition: all 0.3s ease;
    position: relative;
}

.nav-link:hover {
    color: var(--accent-color) !important;
    transform: translateY(-2px);
}

/* Active page styling */
.nav-link.active {
    color: var(--secondary-color) !important;
}
```

## 🛠️ Technologies Used

- **HTML5:** Semantic markup structure
- **CSS3:** Custom styling with CSS variables and animations
- **JavaScript ES6+:** Classes, async/await, modern syntax
- **Bootstrap 5:** Responsive grid system and components
- **Font Awesome:** Icon library for enhanced UI
- **Last.fm API:** Music data integration

## 🚀 Features

- ✅ **Responsive Design:** Works on all device sizes
- ✅ **API Integration:** Real-time music data from Last.fm
- ✅ **Search Functionality:** Find any artist with detailed information
- ✅ **Featured Artists:** Curated content on home page
- ✅ **Contact Form:** Interactive contact form with validation
- ✅ **Loading States:** Smooth loading animations
- ✅ **Error Handling:** Graceful fallback for API failures
- ✅ **Modern UI:** Dark theme with gradient accents

## 📁 Project Structure

```
MelodyHub/
├── README.md
├── index.html          # Home page
├── discover.html       # Music discovery page
├── about.html          # About page
├── css/
│   └── styles.css      # Main stylesheet
└── js/
    └── main.js         # Main JavaScript file
```

## 🎯 Getting Started

1. Clone or download the project files
2. Create the folder structure as shown above
3. Place each file in its respective directory
4. Open `index.html` in your web browser
5. Start discovering music!

## 📱 Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Modern mobile browsers

---

*Built with ❤️ by Charbel Al Chaar for the best Dr*
Aam bemzah aam jarrib chou3our l nerdiyye
