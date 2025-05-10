# JSTF North - Church Website Overhaul (2025 Version)

Welcome to the completely overhauled website code for JSTF North! This website is designed with a modern, welcoming, and informal feel, aiming to effectively inform your congregation and attract new visitors. It uses HTML, CSS (leveraging the Bootstrap 5 framework for responsiveness), JavaScript for interactivity, and **Swiper.js** for advanced "Infinite Cover View" sliders. The color palette is Purple, White, and Gold.

## Website File Structure

Your website files are organized as follows:

JSTF_North_Website_Overhaul/
│
├── index.html             // Homepage
├── about.html             // About Us, Mission, Beliefs, Ministry Team Slider
├── leadership.html        // Apostle, Bishops (Cover Flow Slider), Pastor
├── ministries.html        // Detailed Ministry Page with Cover Flow Slider
├── events.html            // Embedded Google Calendar & Featured Events
├── sermons.html           // Live Stream, YouTube Playlist for Past Sermons, Photo Gallery Placeholder
├── contact.html           // Visit Info, Map, Contact/Prayer Form
│
├── style.css              // Main stylesheet (Theme, Swiper.js custom styles)
├── script.js              // JavaScript (Interactivity, Animations, Swiper Init)
│
├── README.md              // This instruction file
│
└── assets/                // YOU CREATE THIS FOLDER for your images
└── images/            // Sub-folder for all your website images
├── logo.png       // (Example: your church logo)
└── ...            // (Other images: leaders, events, backgrounds, etc.)


## Key Features

* **Modern & Responsive Design:** Built with Bootstrap 5 and Swiper.js.
* **Welcoming Theme:** Purple, White, and Gold colors; "Poppins" and "Open Sans" fonts.
* **"Infinite Cover View" Sliders:** Advanced, autoplaying, and touch-friendly sliders for Board of Bishops and Ministry sections, built with Swiper.js. Pauses on hover.
* **Engaging Animations:** Subtle scroll-triggered entrance animations for sections.
* **Hierarchical Leadership Display.**
* **Google Calendar Integration.**
* **"One-and-Done" Sermon Archives:** Via embedded YouTube Playlist.
* **Persistent Live Stream Section.**
* **Content Placeholders & Clear Guidance.**
* **Contact/Prayer Request Form.**

## Getting Started & Local Preview

1.  **Download Files:** Save all `.html`, `style.css`, `script.js`, and `README.md` into a single main folder.
2.  **Create `assets/images/` Folders:** Inside the main folder, create `assets`, and inside `assets`, create `images`.
3.  **Internet Connection Required for Preview:** Because this version uses Swiper.js and Bootstrap/FontAwesome from CDNs (Content Delivery Networks), you'll need an active internet connection to see the styling and sliders working correctly when you open `index.html` in your browser.
4.  **Preview:** Open `index.html` in your web browser.

## Content Updates & Customization Guide

**1. Adding Your Logo:**
    * Save your logo (e.g., `logo.png`) into `assets/images/`.
    * In each `.html` file, find the commented-out logo placeholder in the `<nav>` (and optionally footer).
    * Uncomment the `<img>` tag line and update the `src`. Comment out or remove the text-based brand name.

**2. Adding Photos (Leaders, Events, Ministries, etc.):**
    * Most image spots use a `div` with class `placeholder-image-container` and a commented-out `<img>` tag.
    * **To add an image:**
        1.  Save your photo into `assets/images/`.
        2.  Delete the placeholder `div`.
        3.  Uncomment the associated `<img>` tag and update its `src` and `alt` text.

**3. Editing Text Content:**
    * Open `.html` files in a text editor and edit content within HTML tags.

**4. Leadership & Ministry Sliders (Cover Flow):**
    * (`leadership.html` - Bishops; `about.html` - Ministry Team; `ministries.html` - Main Ministries)
    * These sections now use **Swiper.js**. Each leader/ministry card is a `<div class="swiper-slide">` containing your styled card.
    * Update bios, titles, and photos within these cards as per step 2.
    * **Autoplay & Behavior:** Configured in `script.js` within the `new Swiper(...)` initialization blocks. You can adjust `delay` for autoplay speed. The `pauseOnMouseEnter: true` option in the Swiper initialization (in `script.js`) handles the pause on hover.
    * **Cover Flow Effect:** The visual "cover flow" (rotation, depth, etc.) is primarily controlled by the `coverflowEffect` options in the Swiper initialization in `script.js`. You can tweak these values if you're comfortable.
    * **Slides Per View:** The `slidesPerView` and `breakpoints` options in the Swiper initializations in `script.js` control how many slides (or parts of slides) are visible at different screen sizes for the cover flow effect.

**5. Events Calendar (`events.html`):**
    * Google Calendar `iframe src` is set. Edit events in your Google Calendar account.

**6. Sermons & Media Page (`sermons.html`):**
    * **Live Stream:** Replace placeholder `div` in `live-stream-player-container` with your persistent `<iframe>` from YouTube Channel Live or Twitch (see HTML comments).
    * **Past Sermons (YouTube Playlist):**
        1.  Create/manage your sermon Playlist on YouTube.
        2.  Get the **Playlist ID** (the string after `list=` in the playlist URL).
        3.  In `sermons.html`, update the `<iframe> src` in `Youtubelist-container`, replacing `YOUR_PLAYLIST_ID_HERE` with your ID. Example format: `src="https://www.youtube.com/watch?v=j9iq4PXPY94"`
    * **Photo Gallery:** Replace placeholder `divs` with your photos or an embedded gallery.

**7. Contact Page Map & Form (`contact.html`):**
    * Update Google Maps `<iframe> src` with your church's embed code.
    * Contact Form `action` URL is set.

**8. Swiper.js:**
    * This site now relies on Swiper.js for the cover flow sliders. The library is linked via CDN in the `<head>` of `leadership.html`, `about.html`, and `ministries.html`. Ensure an internet connection for it to load.
    * Customization of the slider behavior (autoplay speed, number of visible slides, coverflow effect parameters) is done in `script.js` within the `new Swiper(...)` blocks.

**Deployment (Example: GitHub Pages - Free)**
    * Same as before: Create GitHub Repo, upload all files (including `assets` folder), enable GitHub Pages. Ensure your live site has HTTPS if you encounter any mixed content issues with embeds.

This completes the full set of files with the new Swiper.js "Infinite Cover View" sliders for the leadership and ministries sections. Remember to test thoroughly after adding your content!

Sources and related content
