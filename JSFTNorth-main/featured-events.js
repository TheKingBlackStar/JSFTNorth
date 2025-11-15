import { db } from './firebase-config.js';
import { collection, query, orderBy, limit, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const container = document.getElementById('featuredEventsContainerEventsPage');
if (container) {
  const q = query(collection(db, 'featuredEvents'), orderBy('date', 'asc'), limit(8));
  onSnapshot(q, (snapshot) => {
    if (snapshot.empty) {
      container.innerHTML = '<div class="col-12 text-center text-muted">No featured events yet</div>';
      return;
    }
    let html = '';
    snapshot.forEach(docSnap => {
      const fe = docSnap.data();
      const image = fe.imageUrl ? fe.imageUrl : '';
      html += `
        <div class="col-md-4 col-lg-3 mb-4">
          <div class="card h-100 shadow-sm rounded-4 border-0">
            <div class="ratio ratio-4x3 bg-light rounded-top position-relative" style="${image ? `background:url('${image}') center/cover no-repeat;` : ''}">
              ${!image ? '<div class=\"d-flex h-100 w-100 align-items-center justify-content-center text-purple-600 fw-semibold\" style=\"font-size:.85rem;\">Event Image</div>' : ''}
            </div>
            <div class="card-body d-flex flex-column">
              <h5 class="fw-bold mb-1">${fe.title || 'Untitled'}</h5>
              <div class="small text-muted mb-2"><i class="far fa-calendar me-1"></i>${fe.date || ''} • ${fe.category || 'event'}</div>
              <p class="flex-grow-1 mb-3 small">${fe.description || ''}</p>
              <a href="calendars.html" class="btn btn-outline-primary rounded-pill w-100 btn-sm">Learn More</a>
            </div>
          </div>
        </div>`;
    });
    container.innerHTML = html;
  }, (error) => {
    console.error('Featured events load error:', error);
    container.innerHTML = '<div class="col-12 text-danger">Failed to load featured events</div>';
  });
}
