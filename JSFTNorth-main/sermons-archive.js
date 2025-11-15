// Sermons Archive with search and optional tag filtering
import { getFirestore, collection, query, orderBy, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const db = getFirestore();

const listEl = document.getElementById('sermonArchiveContainer');
const searchEl = document.getElementById('sermonSearch');
const tagFiltersEl = document.getElementById('tagFilters');

let allSermons = [];
let activeTag = null;
let searchText = '';

function extractYouTubeId(url) {
  if (!url) return '';
  try {
    if (url.includes('v=')) {
      let id = url.split('v=')[1];
      const amp = id.indexOf('&');
      if (amp !== -1) id = id.substring(0, amp);
      return id;
    } else if (url.includes('youtu.be/')) {
      return url.split('youtu.be/')[1].split('?')[0];
    }
  } catch {}
  return '';
}

function renderTags() {
  const tagSet = new Set();
  allSermons.forEach(s => Array.isArray(s.tags) && s.tags.forEach(t => tagSet.add(t)));
  const tags = Array.from(tagSet).sort((a,b) => a.localeCompare(b));
  if (tags.length === 0) { tagFiltersEl.innerHTML = ''; return; }
  const pills = [`<span class="me-2 small">Filter by tag:</span>`,
    `<button class="btn btn-sm ${activeTag ? 'btn-outline-secondary' : 'btn-secondary'} me-2" data-tag="">All</button>`
  ];
  tags.forEach(t => {
    const active = activeTag === t ? 'btn-secondary' : 'btn-outline-secondary';
    pills.push(`<button class="btn btn-sm ${active} me-2" data-tag="${t}">${t}</button>`);
  });
  tagFiltersEl.innerHTML = pills.join('');
  tagFiltersEl.querySelectorAll('button[data-tag]').forEach(btn => {
    btn.addEventListener('click', () => {
      activeTag = btn.dataset.tag || null;
      renderList();
      renderTags();
    });
  });
}

function renderList() {
  if (!listEl) return;
  const q = searchText.trim().toLowerCase();
  const filtered = allSermons.filter(s => {
    const matchesText = !q || (s.title || '').toLowerCase().includes(q) || (Array.isArray(s.tags) && s.tags.some(t => t.toLowerCase().includes(q)));
    const matchesTag = !activeTag || (Array.isArray(s.tags) && s.tags.includes(activeTag));
    return matchesText && matchesTag;
  });

  if (filtered.length === 0) {
    listEl.innerHTML = '<div class="col-12 text-center text-muted">No sermons match your search.</div>';
    return;
  }

  let html = '';
  filtered.forEach(s => {
    const id = extractYouTubeId(s.youtubeLink);
    const dateText = s.createdAt?.toDate ? s.createdAt.toDate().toLocaleDateString() : '';
    const tags = Array.isArray(s.tags) && s.tags.length ? s.tags.map(t => `<span class=\"badge bg-light text-dark me-1\">${t}</span>`).join('') : '';
    if (id) {
      html += `
        <div class="col-md-6 col-lg-4 mb-4">
          <div class="card h-100 shadow-sm">
            <div class="card-body">
              <h5 class="card-title">${s.title || ''}</h5>
              <div class="ratio ratio-16x9 mb-2">
                <iframe src="https://www.youtube.com/embed/${id}" title="${s.title || ''}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
              </div>
              <div class="d-flex justify-content-between align-items-center">
                <small class="text-muted">${dateText}</small>
                <div>${tags}</div>
              </div>
            </div>
          </div>
        </div>`;
    }
  });
  listEl.innerHTML = html;
}

// Live data
const qAll = query(collection(db, 'sermons'), orderBy('createdAt', 'desc'));
onSnapshot(qAll, (snap) => {
  allSermons = [];
  snap.forEach(doc => allSermons.push({ id: doc.id, ...doc.data() }));
  renderTags();
  renderList();
});

if (searchEl) {
  searchEl.addEventListener('input', (e) => {
    searchText = e.target.value || '';
    renderList();
  });
}
