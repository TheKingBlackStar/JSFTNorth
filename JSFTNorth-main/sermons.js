// Sermons page functionality - Display sermons from Firebase
import { getFirestore, collection, query, orderBy, limit, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const db = getFirestore();

let allSermons = [];
let showingArchive = false;

// Display sermons on the sermons page
const sermonsContainer = document.getElementById('sermons-container');

if (sermonsContainer) {
    const sermonsQuery = query(collection(db, 'sermons'), orderBy('createdAt', 'desc'));
    
    onSnapshot(sermonsQuery, (snapshot) => {
        allSermons = [];
        
        snapshot.forEach((docSnap) => {
            allSermons.push({
                id: docSnap.id,
                ...docSnap.data()
            });
        });
        
        displaySermons();
    }, (error) => {
        console.error('Error loading sermons:', error);
        sermonsContainer.innerHTML = '<div class="col-12 text-center"><p class="text-danger">Error loading sermons. Please try again later.</p></div>';
    });
}

function displaySermons() {
    if (!sermonsContainer) return;
    
    let html = '';
    
    if (allSermons.length === 0) {
        html = '<div class="col-12 text-center"><p class="text-muted">No sermons available yet. Check back soon!</p></div>';
    } else {
        const sermonsToShow = showingArchive ? allSermons : allSermons.slice(0, 5);
        
        sermonsToShow.forEach((sermon) => {
            const videoId = extractYouTubeId(sermon.youtubeLink);
            
            if (videoId) {
                html += `
                    <div class="col-md-6 col-lg-4 mb-4">
                        <div class="card h-100 shadow-sm">
                            <div class="card-body">
                                <h5 class="card-title">${sermon.title}</h5>
                                <div class="ratio ratio-16x9">
                                    <iframe src="https://www.youtube.com/embed/${videoId}" title="${sermon.title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }
        });
        
        // Add archive button if there are more than 5 sermons
        if (allSermons.length > 5) {
            html += `
                <div class="col-12 text-center mt-4">
                    <button id="archiveToggle" class="btn btn-primary btn-lg">
                        ${showingArchive ? 'Show Latest 5 Sermons' : 'View All Sermons Archive'}
                    </button>
                </div>
            `;
        }
    }
    
    sermonsContainer.innerHTML = html;
    
    // Attach event listener to archive toggle button
    const archiveToggle = document.getElementById('archiveToggle');
    if (archiveToggle) {
        archiveToggle.addEventListener('click', () => {
            showingArchive = !showingArchive;
            displaySermons();
            // Scroll to sermons section
            document.getElementById('past-sermons').scrollIntoView({ behavior: 'smooth' });
        });
    }
}

function extractYouTubeId(url) {
    if (!url) return '';
    
    try {
        if (url.includes('v=')) {
            let videoId = url.split('v=')[1];
            const ampersandPosition = videoId.indexOf('&');
            if (ampersandPosition !== -1) {
                videoId = videoId.substring(0, ampersandPosition);
            }
            return videoId;
        } else if (url.includes('youtu.be/')) {
            return url.split('youtu.be/')[1].split('?')[0];
        }
    } catch (error) {
        console.error('Error parsing YouTube URL:', error);
    }
    
    return '';
}
