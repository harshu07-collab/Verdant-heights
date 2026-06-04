<?php
/**
 * Template Name: Verdant Heights Landing
 * Description: Ultra-luxury real estate landing page with interactive 3D viewer, mortgage calculator, tour booking, and full-page animations.
 */
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo('charset'); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script type="importmap">
  {
    "imports": {
      "three": "https://unpkg.com/three@0.162.0/build/three.module.js",
      "three/addons/": "https://unpkg.com/three@0.162.0/examples/jsm/"
    }
  }
  </script>
  <?php wp_head(); ?>
</head>
<body <?php body_class('vh-landing'); ?>>
<?php wp_body_open(); ?>

<!-- SVG DEFS -->
<svg width="0" height="0" style="position:absolute">
  <defs>
    <linearGradient id="logoGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#c9a84c"/>
      <stop offset="50%" stop-color="#d4af37"/>
      <stop offset="100%" stop-color="#e8d48b"/>
    </linearGradient>
    <linearGradient id="logoGoldFill" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#c9a84c"/>
      <stop offset="40%" stop-color="#d4af37"/>
      <stop offset="100%" stop-color="#e8d48b"/>
    </linearGradient>
    <linearGradient id="plGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#c9a84c"/>
      <stop offset="50%" stop-color="#d4af37"/>
      <stop offset="100%" stop-color="#e8d48b"/>
    </linearGradient>
    <linearGradient id="plGoldFill" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#c9a84c"/>
      <stop offset="40%" stop-color="#d4af37"/>
      <stop offset="100%" stop-color="#e8d48b"/>
    </linearGradient>
  </defs>
</svg>

<!-- CURSOR -->
<div class="cursor-dot" id="cursorDot"></div>
<div class="cursor-ring" id="cursorRing"></div>
<div class="cursor-glow" id="cursorGlow"></div>

<!-- PRELOADER -->
<div class="preloader" id="preloader">
  <div class="preloader-logo-wrap">
    <svg class="preloader-logo-svg" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <polygon class="pl-frame" points="40,4 76,40 40,76 4,40"/>
      <polygon class="pl-inner" points="40,14 66,40 40,66 14,40" fill="none"/>
      <line class="pl-inner" x1="40" y1="14" x2="40" y2="66"/>
      <line class="pl-inner" x1="14" y1="40" x2="66" y2="40"/>
      <text class="pl-vh" x="40" y="46" text-anchor="middle" font-family="Playfair Display,serif" font-size="22" font-weight="700" fill="url(#plGoldFill)">VH</text>
      <path class="pl-inner" d="M37,18 Q40,12 43,18" fill="none"/>
    </svg>
    <div class="preloader-brand">VERDANT HEIGHTS</div>
  </div>
  <div class="preloader-ring"></div>
  <div class="preloader-bar"><span></span></div>
  <div class="preloader-tagline">Where Luxury Meets the Skyline</div>
</div>

<!-- PROGRESS BAR -->
<div class="progress-bar" id="progressBar"></div>

<!-- LIGHTBOX -->
<div class="lightbox" id="lightbox">
  <button class="lightbox-close" id="lbClose"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
  <button class="lightbox-nav prev" id="lbPrev"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg></button>
  <button class="lightbox-nav next" id="lbNext"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg></button>
  <div class="lightbox-img-wrapper"><img id="lbImage" src="" alt=""></div>
  <div class="lightbox-caption" id="lbCaption"><h4 id="lbTitle"></h4><p id="lbDesc"></p></div>
  <div class="lightbox-counter" id="lbCounter"></div>
  <div class="lightbox-thumbnails" id="lbThumbnails"></div>
</div>

<!-- NAV -->
<nav class="nav" id="nav">
  <a href="#" class="logo">
    <svg class="logo-svg" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <polygon class="logo-frame" points="24,2 46,24 24,46 2,24"/>
      <polygon class="logo-frame" points="24,8 40,24 24,40 8,24" opacity="0.4"/>
      <line class="logo-line" x1="24" y1="8" x2="24" y2="40"/>
      <line class="logo-line" x1="8" y1="24" x2="40" y2="24"/>
      <path class="logo-leaf" d="M22,12 Q24,6 26,12 Q24,10 22,12Z"/>
      <text class="logo-vh" x="24" y="28" text-anchor="middle" font-family="Playfair Display,serif" font-size="13" font-weight="700" fill="url(#logoGoldFill)">VH</text>
    </svg>
    <span class="logo-glow"></span>
    Verdant<span>Heights</span>
  </a>
  <ul class="nav-links" id="navLinks">
    <li><a href="#highlights" onclick="closeNav()">Highlights</a></li>
    <li><a href="#amenities" onclick="closeNav()">Amenities</a></li>
    <li><a href="#gallery" onclick="closeNav()">Gallery</a></li>
    <li><a href="#features" onclick="closeNav()">Features</a></li>
    <li><a href="#viewer3d" onclick="closeNav()">3D Model</a></li>
    <li><a href="#testimonials" onclick="closeNav()">Reviews</a></li>
    <li><a href="#floorplans" onclick="closeNav()">Floor Plans</a></li>
    <li><a href="#calculator" onclick="closeNav()">Calculator</a></li>
    <li><a href="#booking" onclick="closeNav()">Book Tour</a></li>
    <li><a href="#contact" onclick="closeNav()">Contact</a></li>
    <li><a href="#booking" class="nav-cta" onclick="closeNav()"><span style="position:relative;z-index:1">Tour</span></a></li>
  </ul>
  <button class="hamburger" id="hamburger" aria-label="Menu"><span></span><span></span><span></span></button>
</nav>

<!-- HERO -->
<section class="hero" id="hero">
  <div class="hero-bg"><img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=85" alt="Luxury modern building exterior at dusk with warm interior lighting" loading="eager"></div>
  <div class="hero-overlay"></div>
  <div class="hero-decor">
    <div class="geo-line geo-line-h"></div><div class="geo-line geo-line-h2"></div><div class="geo-line-v"></div>
    <div class="diamond diamond-1"></div><div class="diamond diamond-2"></div><div class="diamond diamond-3"></div><div class="diamond diamond-4"></div>
    <div class="light-streak"></div><div class="light-streak light-streak-2"></div>
    <div class="corner-accent corner-tl"></div><div class="corner-accent corner-br"></div>
  </div>
  <div class="hero-content">
    <div class="hero-badge"><span class="dot"></span> Now Selling &mdash; Phase II</div>
    <h1>
      <span class="line">Where <span class="gradient">Luxury</span></span>
      <span class="line">Meets the</span>
      <span class="line"><span class="gradient">Skyline</span></span>
    </h1>
    <p>Exclusive residences in the heart of the city. Uncompromising elegance, world-class amenities, and panoramic views that take your breath away.</p>
    <div class="hero-actions">
      <a href="#contact" class="btn btn-primary btn-magnetic" data-ripple><span class="btn-shine"></span><span>Schedule Private Tour</span> <span class="arrow">&rarr;</span></a>
      <a href="#gallery" class="btn btn-secondary btn-magnetic" data-ripple><span>View Gallery</span> <span class="arrow">&rarr;</span></a>
    </div>
  </div>
  <div class="hero-scroll"><div class="scroll-indicator"></div><span>Explore</span></div>
</section>

<!-- HIGHLIGHTS -->
<section class="highlights section-padding" id="highlights">
  <div class="float-particle" style="top:15%;left:10%;animation-delay:0s"></div>
  <div class="float-particle" style="top:60%;right:8%;animation-delay:3s"></div>
  <div class="float-particle" style="bottom:20%;left:45%;animation-delay:5s"></div>
  <div class="container">
    <div class="highlights-header reveal">
      <div class="section-label" style="justify-content:center;"><span class="line"></span> Project Highlights <span class="line right"></span></div>
      <h2 class="section-title">Redefining Urban Luxury</h2>
      <p class="section-desc">Meticulously designed spaces with premium finishes, setting a new benchmark for sophisticated living.</p>
    </div>
    <div class="highlights-grid stagger-children" id="highlightGrid">
      <div class="highlight-card" data-tilt>
        <div class="shine"></div>
        <div class="highlight-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#c9a84c" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 21v-6h6v6"/><path d="M9 10h.01"/><path d="M15 10h.01"/><path d="M9 14h.01"/><path d="M15 14h.01"/></svg></div>
        <div class="highlight-number" data-target="42">0</div>
        <div class="highlight-label">Stories of Elegance</div>
      </div>
      <div class="highlight-card" data-tilt>
        <div class="shine"></div>
        <div class="highlight-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#c9a84c" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/><path d="M12 3v4"/><circle cx="12" cy="9" r="0.5" fill="#c9a84c"/></svg></div>
        <div class="highlight-number" data-target="186">0</div>
        <div class="highlight-label">Luxury Residences</div>
      </div>
      <div class="highlight-card" data-tilt>
        <div class="shine"></div>
        <div class="highlight-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#c9a84c" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c-4 0-8-2-8-6 0-3 2-5 4-6.5C10 8 12 4 12 2c0 2 2 6 4 7.5 2 1.5 4 3.5 4 6.5 0 4-4 6-8 6z"/><path d="M12 22v-6"/><path d="M9 18l3-3 3 3"/></svg></div>
        <div class="highlight-number" data-target="35000">0</div>
        <div class="highlight-label">Sq Ft Private Gardens</div>
      </div>
      <div class="highlight-card" data-tilt>
        <div class="shine"></div>
        <div class="highlight-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#c9a84c" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="6" width="14" height="10" rx="1"/><path d="M15 10h4l3 3v3h-7"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/><path d="M8 18.5h7"/><path d="M1 16h14"/></svg></div>
        <div class="highlight-number" data-target="320">0</div>
        <div class="highlight-label">Parking Spaces</div>
      </div>
    </div>
  </div>
</section>

<!-- 3D VIEWER -->
<section class="viewer-3d section-padding" id="viewer3d">
  <div class="viewer-3d-bg"></div>
  <div class="container" style="display:flex;flex-direction:column;align-items:center;gap:36px">
    <div class="reveal" style="text-align:center">
      <div class="section-label" style="justify-content:center"><span class="line"></span> Interactive Experience <span class="line right"></span></div>
      <h2 class="section-title">Explore the Tower</h2>
      <p class="section-desc" style="margin:0 auto">Interact with our architectural vision &mdash; rotate, zoom, and discover every detail of the Verdant Heights tower.</p>
    </div>
    <div class="viewer-3d-canvas-wrap reveal-scale" id="viewer3dWrap">
      <canvas id="canvas3d"></canvas>
      <div class="viewer-3d-scanline"></div>
      <div class="viewer-3d-vignette"></div>
      <div class="viewer-3d-corner tl"></div><div class="viewer-3d-corner tr"></div>
      <div class="viewer-3d-corner bl"></div><div class="viewer-3d-corner br"></div>
      <div class="viewer-3d-info"><h3>Verdant Heights</h3><p>42-Story Luxury Tower</p></div>
      <div class="viewer-3d-controls">
        <span><span class="ctrl-dot"></span>Drag to Rotate</span>
        <span><span class="ctrl-dot"></span>Scroll to Zoom</span>
        <span><span class="ctrl-dot"></span>Right-Click to Pan</span>
      </div>
      <div class="viewer-3d-loading" id="viewer3dLoading">
        <div class="loader-ring"></div>
        <span>Rendering Tower</span>
      </div>
    </div>
  </div>
</section>

<!-- AMENITIES -->
<section class="amenities section-padding" id="amenities">
  <div class="amenities-bg-glow"></div><div class="amenities-bg-glow-2"></div>
  <div class="container">
    <div class="amenities-inner">
      <div class="amenities-visual reveal-left tilt" data-tilt data-tilt-scale="1.02">
        <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=85" alt="Rooftop infinity pool with panoramic city skyline views" loading="lazy">
        <div class="overlay-grad"></div>
        <div class="badge-float"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" stroke-width="2" stroke-linecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> Skyline Infinity Pool</div>
      </div>
      <div class="reveal-right">
        <div class="section-label"><span class="line"></span> World-Class Amenities</div>
        <h2 class="section-title">Elevate Your<br>Every Moment</h2>
        <p class="section-desc" style="margin-bottom:8px">Every detail crafted to enrich your lifestyle &mdash; from wellness and leisure to entertainment and relaxation.</p>
        <div class="amenities-grid stagger-children">
          <div class="amenity-item"><div class="amenity-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#c9a84c" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h20"/><path d="M2 12c0 4 4 7 10 7s10-3 10-7"/><path d="M6 12V8a6 6 0 0 1 12 0v4"/><path d="M4 16c1 2 4 3 8 3s7-1 8-3"/></svg></div><span class="amenity-text">Infinity Edge Pool</span></div>
          <div class="amenity-item"><div class="amenity-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#c9a84c" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4v16"/><path d="M18 4v16"/><path d="M6 8h4"/><path d="M14 8h4"/><path d="M6 16h4"/><path d="M14 16h4"/><circle cx="12" cy="12" r="3"/><path d="M10 12h4"/></svg></div><span class="amenity-text">Fitness &amp; Wellness</span></div>
          <div class="amenity-item"><div class="amenity-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#c9a84c" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3C6.5 3 4 5 4 8c0 5 5 11 5 11s5-6 5-11c0-3-2.5-5-5-5z"/><path d="M15 3c2.5 0 5 2 5 5 0 5-5 11-5 11"/><path d="M9 10h6"/><circle cx="12" cy="7" r="1.5" fill="none"/></svg></div><span class="amenity-text">Spa &amp; Sauna Suite</span></div>
          <div class="amenity-item"><div class="amenity-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#c9a84c" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c-3 0-5 2-5 5 0 4 5 11 5 11s5-7 5-11c0-3-2-5-5-5z"/><circle cx="12" cy="8" r="2"/><path d="M8 14c-2 1-4 1-5 0"/><path d="M16 14c2 1 4 1 5 0"/></svg></div><span class="amenity-text">Rooftop Gardens</span></div>
          <div class="amenity-item"><div class="amenity-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#c9a84c" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 18v3"/><path d="M7 10l3 2-3 2"/><path d="M13 10h4"/></svg></div><span class="amenity-text">Private Cinema</span></div>
          <div class="amenity-item"><div class="amenity-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#c9a84c" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><path d="M6 1v3"/><path d="M10 1v3"/><path d="M14 1v3"/><path d="M8 13c0 1.5 1.5 3 4 3s4-1.5 4-3"/></svg></div><span class="amenity-text">Wine &amp; Cigar Lounge</span></div>
          <div class="amenity-item"><div class="amenity-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#c9a84c" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="12" rx="2"/><circle cx="8" cy="13" r="2.5"/><circle cx="16" cy="13" r="2.5"/><path d="M10.5 13h3"/><path d="M12 7v-4"/><path d="M8 3h8"/></svg></div><span class="amenity-text">Games &amp; Social Room</span></div>
          <div class="amenity-item"><div class="amenity-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#c9a84c" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div><span class="amenity-text">Concierge Service</span></div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- GALLERY -->
<section class="gallery section-padding" id="gallery">
  <div class="container">
    <div class="gallery-header reveal">
      <div class="section-label" style="justify-content:center;"><span class="line"></span> Gallery <span class="line right"></span></div>
      <h2 class="section-title">A Glimpse of Refined Living</h2>
      <p class="section-desc">Explore the architectural brilliance and meticulously curated interiors that define Verdant Heights.</p>
    </div>
    <div class="gallery-filter reveal">
      <button class="active" data-filter="all">All</button>
      <button data-filter="exterior">Exterior</button>
      <button data-filter="interior">Interior</button>
      <button data-filter="amenity">Amenities</button>
    </div>
    <div class="gallery-grid stagger-children" id="galleryGrid">
      <div class="gallery-item" data-category="exterior" data-tilt>
        <div class="img-reveal"></div>
        <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=700&q=85" alt="Grand facade at dusk" loading="lazy">
        <div class="zoom-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#c9a84c" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg></div>
        <div class="gallery-overlay"><h4>Grand Facade</h4><p>Architectural brilliance at twilight</p></div>
      </div>
      <div class="gallery-item" data-category="interior" data-tilt>
        <div class="img-reveal"></div>
        <img src="https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=700&q=85" alt="Elegant living room" loading="lazy">
        <div class="zoom-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#c9a84c" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg></div>
        <div class="gallery-overlay"><h4>Grand Living Suite</h4><p>Sophisticated living spaces</p></div>
      </div>
      <div class="gallery-item" data-category="amenity" data-tilt>
        <div class="img-reveal"></div>
        <img src="https://images.unsplash.com/photo-1576013551627-0cc20b0a1abb?w=700&q=85" alt="Skyline pool" loading="lazy">
        <div class="zoom-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#c9a84c" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg></div>
        <div class="gallery-overlay"><h4>Infinity Edge Pool</h4><p>Panoramic skyline views</p></div>
      </div>
      <div class="gallery-item" data-category="interior" data-tilt>
        <div class="img-reveal"></div>
        <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700&q=85" alt="Gourmet kitchen" loading="lazy">
        <div class="zoom-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#c9a84c" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg></div>
        <div class="gallery-overlay"><h4>Gourmet Chef Kitchen</h4><p>Premium imported finishes</p></div>
      </div>
      <div class="gallery-item" data-category="amenity" data-tilt>
        <div class="img-reveal"></div>
        <img src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=700&q=85" alt="State-of-the-art gym" loading="lazy">
        <div class="zoom-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#c9a84c" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg></div>
        <div class="gallery-overlay"><h4>Fitness Pavilion</h4><p>State-of-the-art equipment</p></div>
      </div>
      <div class="gallery-item" data-category="exterior" data-tilt>
        <div class="img-reveal"></div>
        <img src="https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=700&q=85" alt="Night illumination" loading="lazy">
        <div class="zoom-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#c9a84c" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg></div>
        <div class="gallery-overlay"><h4>Night Illumination</h4><p>City panorama after dark</p></div>
      </div>
      <div class="gallery-item" data-category="interior" data-tilt>
        <div class="img-reveal"></div>
        <img src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=700&q=85" alt="Master bedroom" loading="lazy">
        <div class="zoom-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#c9a84c" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg></div>
        <div class="gallery-overlay"><h4>Master Bedroom</h4><p>A sanctuary of comfort</p></div>
      </div>
    </div>
  </div>
</section>

<!-- FEATURES -->
<section class="features-showcase section-padding" id="features">
  <div class="container">
    <div class="features-showcase-header reveal">
      <div class="section-label" style="justify-content:center;"><span class="line"></span> Signature Features <span class="line right"></span></div>
      <h2 class="section-title">Crafted for the Discerning</h2>
      <p class="section-desc">Every element thoughtfully designed to deliver an unparalleled living experience.</p>
    </div>
    <div class="features-grid stagger-children">
      <div class="feature-card">
        <div class="feature-card-img"><img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700&q=85" alt="Luxury smart home kitchen" loading="lazy"></div>
        <div class="feature-card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#c9a84c" stroke-width="1.3" stroke-linecap="round"><path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/></svg></div>
        <div class="feature-card-content"><h4>Smart Home Integration</h4><p>Full Crestron automation with voice control for lighting, climate, security, and entertainment systems.</p></div>
      </div>
      <div class="feature-card">
        <div class="feature-card-img"><img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=700&q=85" alt="Premium architectural detail" loading="lazy"></div>
        <div class="feature-card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#c9a84c" stroke-width="1.3" stroke-linecap="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg></div>
        <div class="feature-card-content"><h4>Italian Marble Finishes</h4><p>Hand-selected Calacatta and Statuario marble imported from Tuscany for kitchens, bathrooms, and foyers.</p></div>
      </div>
      <div class="feature-card">
        <div class="feature-card-img"><img src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=700&q=85" alt="Luxury bathroom with city views" loading="lazy"></div>
        <div class="feature-card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#c9a84c" stroke-width="1.3" stroke-linecap="round"><path d="M2 12h20"/><path d="M2 12c0 4 4 7 10 7s10-3 10-7"/><path d="M6 12V8a6 6 0 0 1 12 0v4"/><path d="M4 16c1 2 4 3 8 3s7-1 8-3"/></svg></div>
        <div class="feature-card-content"><h4>Panoramic Views</h4><p>Floor-to-ceiling windows with triple-pane glass offering unobstructed 270-degree skyline panoramas.</p></div>
      </div>
    </div>
  </div>
</section>

<!-- SECTION DIVIDER -->
<div class="section-divider-ornament"><div class="div-line"></div><div class="div-dot"></div><div class="div-diamond"></div><div class="div-dot"></div><div class="div-line"></div></div>

<!-- TESTIMONIALS -->
<section class="testimonials section-padding" id="testimonials">
  <div class="float-particle" style="top:10%;left:20%;animation-delay:1s"></div>
  <div class="float-particle" style="bottom:30%;right:15%;animation-delay:4s"></div>
  <div class="container">
    <div class="testimonials-header reveal">
      <div class="section-label" style="justify-content:center;"><span class="line"></span> Resident Stories <span class="line right"></span></div>
      <h2 class="section-title">Lived &amp; Loved</h2>
      <p class="section-desc">Hear from those who call Verdant Heights home &mdash; experiences that speak louder than words.</p>
    </div>
    <div class="testimonials-grid stagger-children">
      <div class="testimonial-card">
        <div class="testimonial-stars"><svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>
        <p class="testimonial-text">The attention to detail here is extraordinary. From the double-glazed windows that eliminate street noise to the 24-hour concierge who remembers your name &mdash; this isn't just living, it's being truly cared for.</p>
        <div class="testimonial-author"><div class="testimonial-avatar">EK</div><div class="testimonial-info"><h5>Eleanor Kensington</h5><p>Suite Resident, Floor 28</p></div></div>
      </div>
      <div class="testimonial-card">
        <div class="testimonial-stars"><svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>
        <p class="testimonial-text">I've lived in luxury buildings across five cities and none compare. The rooftop pool at sunset, the private dining room, the wine cellar &mdash; it's a five-star resort that happens to be my home.</p>
        <div class="testimonial-author"><div class="testimonial-avatar">JR</div><div class="testimonial-info"><h5>James Rothschild</h5><p>Penthouse Resident, Floor 40</p></div></div>
      </div>
      <div class="testimonial-card">
        <div class="testimonial-stars"><svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>
        <p class="testimonial-text">As an architect myself, I appreciate the craftsmanship here. The smart home integration, the Crestron systems, the triple-pane glass &mdash; it's engineering artistry at its finest.</p>
        <div class="testimonial-author"><div class="testimonial-avatar">MV</div><div class="testimonial-info"><h5>Marcus Vanderbilt</h5><p>Duplex Resident, Floor 35</p></div></div>
      </div>
    </div>
  </div>
</section>

<!-- SECTION DIVIDER -->
<div class="section-divider-ornament"><div class="div-line"></div><div class="div-dot"></div><div class="div-diamond"></div><div class="div-dot"></div><div class="div-line"></div></div>

<!-- LEAD FORM -->
<section class="lead-form section-padding" id="contact">
  <div class="container">
    <div class="form-wrapper">
      <div class="form-content reveal-left">
        <div class="section-label"><span class="line"></span> Begin Your Journey</div>
        <h2 class="section-title">Your Dream Home<br>Awaits You</h2>
        <p class="section-desc">Submit your details and our premium concierge team will arrange an exclusive private viewing tailored to your preferences.</p>
        <ul class="benefits">
          <li><span class="check"><svg viewBox="0 0 24 24" fill="none" stroke="#c9a84c" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span> Curated tour of select residences</li>
          <li><span class="check"><svg viewBox="0 0 24 24" fill="none" stroke="#c9a84c" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span> Exclusive pre-launch pricing &amp; offers</li>
          <li><span class="check"><svg viewBox="0 0 24 24" fill="none" stroke="#c9a84c" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span> Immersive virtual walkthrough</li>
          <li><span class="check"><svg viewBox="0 0 24 24" fill="none" stroke="#c9a84c" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span> Dedicated relationship manager</li>
        </ul>
      </div>
      <div class="reveal-right">
        <div class="form-card" id="formCard">
          <div id="formContainer">
            <h3>Schedule an Exclusive Tour</h3>
            <p class="form-sub">Fill in your details and we'll respond within 24 hours.</p>
            <form id="leadForm" novalidate>
              <div class="form-row">
                <div class="form-group">
                  <label for="firstName">First Name</label>
                  <input type="text" id="firstName" required placeholder="John">
                  <div class="form-error-msg" id="firstNameError">Please enter your first name</div>
                </div>
                <div class="form-group">
                  <label for="lastName">Last Name</label>
                  <input type="text" id="lastName" required placeholder="Doe">
                  <div class="form-error-msg" id="lastNameError">Please enter your last name</div>
                </div>
              </div>
              <div class="form-group">
                <label for="email">Email Address</label>
                <input type="email" id="email" required placeholder="john@example.com">
                <div class="form-error-msg" id="emailError">Please enter a valid email address</div>
              </div>
              <div class="form-group">
                <label for="phone">Phone Number</label>
                <input type="tel" id="phone" required placeholder="+1 (555) 000-0000">
                <div class="form-error-msg" id="phoneError">Please enter a valid phone number</div>
              </div>
              <div class="form-group">
                <label for="propertyType">Property Type</label>
                <select id="propertyType">
                  <option value="">Select property type</option>
                  <option value="studio">Studio Residence</option>
                  <option value="1bhk">1 Bedroom</option>
                  <option value="2bhk">2 Bedroom</option>
                  <option value="3bhk">3 Bedroom Suite</option>
                  <option value="penthouse">Penthouse Collection</option>
                </select>
              </div>
              <div class="form-group">
                <label for="message">Message <span style="font-weight:300;text-transform:none;color:var(--text-muted)">(Optional)</span></label>
                <textarea id="message" placeholder="Any specific preferences or requirements..."></textarea>
              </div>
              <button type="submit" class="btn btn-primary" data-ripple><span class="btn-shine"></span><span>Book Your Private Tour</span> <span class="arrow">&rarr;</span></button>
            </form>
          </div>
          <div class="form-success" id="formSuccess">
            <div class="success-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#c9a84c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
            <h4>Thank You for Your Interest</h4>
            <p>Your request has been received. Our concierge team will contact you within 24 hours to schedule your exclusive private tour.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- SECTION DIVIDER -->
<div class="section-divider-ornament"><div class="div-line"></div><div class="div-dot"></div><div class="div-diamond"></div><div class="div-dot"></div><div class="div-line"></div></div>

<!-- FLOOR PLANS -->
<section class="floor-plans section-padding" id="floorplans">
  <div class="container">
    <div class="fp-header reveal">
      <div class="section-label" style="justify-content:center"><span class="line"></span> Residence Layouts <span class="line right"></span></div>
      <h2 class="section-title">Interactive Floor Plans</h2>
      <p class="section-desc">Explore our thoughtfully designed residences &mdash; click any room to discover its features and dimensions.</p>
    </div>
    <div class="fp-tabs reveal">
      <button class="fp-tab active" data-plan="penthouse">Penthouse</button>
      <button class="fp-tab" data-plan="3bed">3 Bedroom</button>
      <button class="fp-tab" data-plan="2bed">2 Bedroom</button>
      <button class="fp-tab" data-plan="studio">Studio</button>
    </div>
    <div class="fp-viewer reveal">
      <div class="fp-svg-wrap" id="fpSvgWrap">
        <svg id="fpSvg" viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg">
          <rect class="room" data-room="living" x="10" y="10" width="140" height="100" rx="3"/>
          <text class="room-label" x="80" y="65">Living Room</text>
          <rect class="room" data-room="kitchen" x="160" y="10" width="130" height="60" rx="3"/>
          <text class="room-label" x="225" y="45">Kitchen</text>
          <rect class="room" data-room="dining" x="160" y="80" width="130" height="30" rx="3"/>
          <text class="room-label" x="225" y="100">Dining</text>
          <rect class="room" data-room="master" x="10" y="120" width="120" height="90" rx="3"/>
          <text class="room-label" x="70" y="170">Master Suite</text>
          <rect class="room" data-room="bedroom2" x="140" y="120" width="70" height="90" rx="3"/>
          <text class="room-label" x="175" y="170">Bedroom 2</text>
          <rect class="room" data-room="bath" x="220" y="120" width="70" height="45" rx="3"/>
          <text class="room-label" x="255" y="147">Bath</text>
          <rect class="room" data-room="balcony" x="220" y="175" width="70" height="35" rx="3"/>
          <text class="room-label" x="255" y="197">Balcony</text>
        </svg>
      </div>
      <div class="fp-details" id="fpDetails">
        <div class="fp-detail-card">
          <h4>Penthouse Collection</h4>
          <p>An extraordinary residence spanning the upper floors with double-height ceilings, private terrace, and 360-degree panoramic views.</p>
          <div class="fp-specs">
            <div class="fp-spec"><span class="fp-spec-val">4,200</span><span class="fp-spec-label">Sq Ft</span></div>
            <div class="fp-spec"><span class="fp-spec-val">3</span><span class="fp-spec-label">Bedrooms</span></div>
            <div class="fp-spec"><span class="fp-spec-val">3.5</span><span class="fp-spec-label">Bathrooms</span></div>
            <div class="fp-spec"><span class="fp-spec-val">$4.2M</span><span class="fp-spec-label">Starting From</span></div>
          </div>
        </div>
        <div class="fp-detail-card" id="fpRoomInfo">
          <h4>Click a Room</h4>
          <p>Select any room on the floor plan to view its specific dimensions, features, and premium finishes.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- SECTION DIVIDER -->
<div class="section-divider-ornament"><div class="div-line"></div><div class="div-dot"></div><div class="div-diamond"></div><div class="div-dot"></div><div class="div-line"></div></div>

<!-- MORTGAGE CALCULATOR -->
<section class="mortgage-calc section-padding" id="calculator">
  <div class="container">
    <div class="mc-header reveal">
      <div class="section-label" style="justify-content:center"><span class="line"></span> Financial Planning <span class="line right"></span></div>
      <h2 class="section-title">Mortgage Calculator</h2>
      <p class="section-desc">Estimate your monthly investment with our interactive calculator &mdash; plan your path to luxury living.</p>
    </div>
    <div class="mc-container reveal">
      <div class="mc-inputs">
        <div class="mc-field">
          <label>Property Price</label>
          <input type="range" id="mcPrice" min="500000" max="10000000" value="2500000" step="50000">
          <div class="mc-val" id="mcPriceVal">$2,500,000</div>
        </div>
        <div class="mc-field">
          <label>Down Payment</label>
          <input type="range" id="mcDown" min="10" max="50" value="20" step="1">
          <div class="mc-val" id="mcDownVal">20%</div>
        </div>
        <div class="mc-field">
          <label>Interest Rate</label>
          <input type="range" id="mcRate" min="2" max="10" value="6.5" step="0.1">
          <div class="mc-val" id="mcRateVal">6.5%</div>
        </div>
        <div class="mc-field">
          <label>Loan Term</label>
          <input type="range" id="mcTerm" min="10" max="30" value="25" step="1">
          <div class="mc-val" id="mcTermVal">25 Years</div>
        </div>
      </div>
      <div class="mc-results">
        <div class="mc-monthly">
          <div class="mc-monthly-label">Estimated Monthly Payment</div>
          <div class="mc-monthly-val" id="mcMonthly">$13,375</div>
        </div>
        <div class="mc-breakdown">
          <div class="mc-break-item"><div class="label">Loan Amount</div><div class="val" id="mcLoanAmt">$2,000,000</div></div>
          <div class="mc-break-item"><div class="label">Total Interest</div><div class="val" id="mcTotalInt">$2,012,500</div></div>
          <div class="mc-break-item"><div class="label">Total Payment</div><div class="val" id="mcTotalPay">$4,012,500</div></div>
          <div class="mc-break-item"><div class="label">Down Payment</div><div class="val" id="mcDownAmt">$500,000</div></div>
        </div>
        <a href="#contact" class="btn btn-primary" data-ripple style="justify-content:center"><span class="btn-shine"></span><span>Speak with Financial Advisor</span> <span class="arrow">&rarr;</span></a>
      </div>
    </div>
  </div>
</section>

<!-- SECTION DIVIDER -->
<div class="section-divider-ornament"><div class="div-line"></div><div class="div-dot"></div><div class="div-diamond"></div><div class="div-dot"></div><div class="div-line"></div></div>

<!-- TOUR BOOKING -->
<section class="tour-booking section-padding" id="booking">
  <div class="container">
    <div class="tb-header reveal">
      <div class="section-label" style="justify-content:center"><span class="line"></span> Schedule Your Visit <span class="line right"></span></div>
      <h2 class="section-title">Book a Private Tour</h2>
      <p class="section-desc">Select your preferred date, time, and tour type &mdash; our concierge team will prepare an exclusive experience just for you.</p>
    </div>
    <div class="tb-container reveal">
      <div class="tb-calendar" id="tbCalendar">
        <div class="tb-cal-header"><h4 id="tbMonthYear">June 2026</h4><div class="tb-cal-nav"><button id="tbPrev" aria-label="Previous month">&lsaquo;</button><button id="tbNext" aria-label="Next month">&rsaquo;</button></div></div>
        <div class="tb-cal-grid" id="tbCalGrid"></div>
      </div>
      <div class="tb-slots">
        <h4>Available Time Slots</h4>
        <p style="font-size:13px;color:var(--text-muted)">Select a date to view available times</p>
        <div class="tb-slot-list" id="tbSlotList"><div class="tb-slot disabled" style="opacity:0.3;pointer-events:none"><span class="dot"></span>Select a date first</div></div>
        <div class="tb-tour-type">
          <label>Tour Type</label>
          <div class="tb-type-options">
            <div class="tb-type-opt selected" data-type="in-person">In-Person Private Tour</div>
            <div class="tb-type-opt" data-type="virtual">Virtual Walkthrough (Video Call)</div>
            <div class="tb-type-opt" data-type="self-guided">Self-Guided with Audio Guide</div>
          </div>
        </div>
        <div class="tb-confirm">
          <p id="tbConfirmText">Select a date and time to continue</p>
          <button class="btn btn-primary" id="tbBookBtn" data-ripple disabled style="opacity:0.5;justify-content:center"><span class="btn-shine"></span><span>Confirm Booking</span> <span class="arrow">&rarr;</span></button>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- SECTION DIVIDER -->
<div class="section-divider-ornament"><div class="div-line"></div><div class="div-dot"></div><div class="div-diamond"></div><div class="div-dot"></div><div class="div-line"></div></div>

<!-- CTA -->
<section class="cta" id="cta">
  <div class="cta-glow1"></div><div class="cta-glow2"></div>
  <div class="container reveal-scale">
    <div class="section-label" style="justify-content:center;"><span class="line"></span> Limited Availability <span class="line right"></span></div>
    <h2 class="section-title">Secure Your Place<br>Among the Skies</h2>
    <p class="section-desc" style="text-align:center;">Phase II launching soon. Register now to access exclusive pre-launch pricing and reserve your preferred residence before the public release.</p>
    <div class="cta-actions">
      <a href="#contact" class="btn btn-primary" data-ripple><span class="btn-shine"></span><span>Register Interest</span> <span class="arrow">&rarr;</span></a>
      <a href="#" class="btn btn-secondary" data-ripple><span>Download Brochure</span> <span class="arrow">&rarr;</span></a>
    </div>
  </div>
</section>

<!-- FOOTER -->
<footer class="footer">
  <div class="footer-logo" style="display:flex;align-items:center;gap:10px">
    <svg width="28" height="28" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <polygon points="24,2 46,24 24,46 2,24" fill="none" stroke="rgba(201,168,76,0.4)" stroke-width="1"/>
      <polygon points="24,8 40,24 24,40 8,24" fill="none" stroke="rgba(201,168,76,0.2)" stroke-width="0.8"/>
      <text x="24" y="28" text-anchor="middle" font-family="Playfair Display,serif" font-size="13" font-weight="700" fill="rgba(201,168,76,0.5)">VH</text>
    </svg>
    <span style="font-family:var(--font-display);font-size:14px;color:rgba(201,168,76,0.3);letter-spacing:2px;font-weight:600">VERDANT HEIGHTS</span>
  </div>
  <div>&copy; <?php echo date('Y'); ?> Verdant Heights. All rights reserved.</div>
  <div class="footer-links">
    <a href="#">Privacy Policy</a>
    <a href="#">Terms of Service</a>
    <a href="#">Cookie Policy</a>
  </div>
  <div class="footer-social">
    <a href="#" aria-label="Instagram"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>
    <a href="#" aria-label="Facebook"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
    <a href="#" aria-label="YouTube"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg></a>
  </div>
</footer>

<script type="module" src="<?php echo esc_url(get_template_directory_uri() . '/assets/three-viewer.js'); ?>"></script>
<?php wp_footer(); ?>
</body>
</html>
