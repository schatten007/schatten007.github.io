type SearchEntry = { title: string; description: string; type: string; href: string; keywords: string };

const mobileToggle = document.querySelector<HTMLButtonElement>('.mobile-toggle');
const mobileNav = document.querySelector<HTMLElement>('#mobile-nav');
function closeMobileMenu() {
  if (mobileNav) mobileNav.hidden = true;
  mobileToggle?.setAttribute('aria-expanded', 'false');
  mobileToggle?.setAttribute('aria-label', 'Open navigation');
}
mobileToggle?.addEventListener('click', () => {
  if (!mobileNav) return;
  const open = mobileNav.hidden;
  mobileNav.hidden = !open;
  mobileToggle.setAttribute('aria-expanded', String(open));
  mobileToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
mobileNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMobileMenu));
window.matchMedia('(min-width: 721px)').addEventListener('change', closeMobileMenu);
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && mobileNav && !mobileNav.hidden) {
    closeMobileMenu();
    mobileToggle?.focus();
  }
});

const dialog = document.querySelector<HTMLDialogElement>('.search-dialog');
const input = document.querySelector<HTMLInputElement>('#site-search');
const results = document.querySelector<HTMLElement>('.search-results');
const summary = document.querySelector<HTMLElement>('.search-summary');
const entries: SearchEntry[] = JSON.parse(document.querySelector('#search-data')?.textContent || '[]');
let searchOpener: HTMLElement | null = null;

function renderSearch() {
  if (!results || !summary || !input) return;
  const words = input.value.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  const matches = entries.filter(entry => {
    const haystack = `${entry.title} ${entry.description} ${entry.type} ${entry.keywords}`.toLocaleLowerCase();
    return words.every(word => haystack.includes(word));
  });
  results.replaceChildren();
  summary.textContent = words.length ? `${matches.length} ${matches.length === 1 ? 'RESULT' : 'RESULTS'}` : 'TYPE TO SEARCH';
  if (!matches.length) {
    const empty = document.createElement('p');
    empty.className = 'search-empty';
    empty.textContent = 'Nothing found. Try “CV”, “schema”, or “jobs”.';
    results.append(empty);
    return;
  }
  for (const entry of matches) {
    const link = document.createElement('a');
    link.href = entry.href;
    link.className = 'search-result';
    const type = document.createElement('span');
    type.className = 'mono search-result-type';
    type.textContent = entry.type;
    const content = document.createElement('span');
    const title = document.createElement('strong');
    title.textContent = entry.title;
    const description = document.createElement('small');
    description.textContent = entry.description;
    content.append(title, description);
    const arrow = document.createElement('span');
    arrow.textContent = '↗';
    arrow.setAttribute('aria-hidden', 'true');
    link.append(type, content, arrow);
    results.append(link);
  }
}

function openSearch() {
  if (!dialog || !input) return;
  searchOpener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  input.value = '';
  renderSearch();
  dialog.showModal();
  document.body.classList.add('dialog-open');
  input.focus();
}
document.querySelectorAll('.search-trigger').forEach(button => button.addEventListener('click', openSearch));
document.querySelector('[data-close-search]')?.addEventListener('click', () => dialog?.close());
dialog?.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  searchOpener?.focus();
});
dialog?.addEventListener('click', event => { if (event.target === dialog) {
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
} });
input?.addEventListener('input', renderSearch);
dialog?.addEventListener('keydown', event => {
  // A populated search input consumes Escape in some browsers; close explicitly.
  if (event.key === 'Escape') {
    event.preventDefault();
    dialog.close();
    return;
  }
  const links = Array.from(results?.querySelectorAll('a') ?? []);
  const index = links.indexOf(document.activeElement as HTMLAnchorElement);
  if (event.key === 'ArrowDown' && links.length) {
    event.preventDefault();
    links[(index + 1) % links.length].focus();
  } else if (event.key === 'ArrowUp' && links.length) {
    event.preventDefault();
    if (index <= 0) input?.focus(); else links[index - 1].focus();
  } else if (event.key === 'Enter' && event.target === input && links.length) {
    event.preventDefault();
    links[0].click();
  }
});
document.addEventListener('keydown', event => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    if (dialog?.open) dialog.close(); else openSearch();
  }
});

const filterButtons = document.querySelectorAll<HTMLButtonElement>('[data-filter]');
const projectCards = document.querySelectorAll<HTMLElement>('.work-grid [data-category]');
filterButtons.forEach(button => button.addEventListener('click', () => {
  const category = button.dataset.filter;
  let count = 0;
  filterButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  projectCards.forEach(card => {
    card.hidden = category !== 'All' && card.dataset.category !== category;
    if (!card.hidden) count++;
  });
  const status = document.querySelector('[data-filter-status]');
  if (status) status.textContent = `${count} ${count === 1 ? 'project' : 'projects'}${category === 'All' ? '' : ` in ${category}`}`;
}));

const copyButton = document.querySelector<HTMLButtonElement>('[data-copy-link]');
copyButton?.addEventListener('click', async () => {
  const status = document.querySelector('[data-copy-status]');
  try {
    await navigator.clipboard.writeText(copyButton.dataset.copyLink || window.location.origin);
    if (status) status.textContent = 'Link copied.';
  } catch {
    if (status) status.textContent = `${copyButton.dataset.copyLink || window.location.origin} — select and copy this address.`;
  }
});

const motionButton = document.querySelector<HTMLButtonElement>('[data-toggle-motion]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
function setMotion(paused: boolean, persist = false) {
  document.documentElement.dataset.motion = paused ? 'paused' : 'running';
  motionButton?.setAttribute('aria-pressed', String(paused));
  motionButton?.setAttribute('aria-label', paused ? 'Play animations' : 'Pause animations');
  const icon = motionButton?.querySelector('[data-motion-icon]');
  const text = motionButton?.querySelector('[data-motion-text]');
  if (icon) icon.textContent = paused ? '▷' : 'Ⅱ';
  if (text) text.textContent = paused ? 'Motion off' : 'Motion on';
  if (persist) {
    try { localStorage.setItem('save-point-motion', paused ? 'paused' : 'running'); } catch { /* Keep the control usable without storage. */ }
  }
}
motionButton?.addEventListener('click', () => setMotion(document.documentElement.dataset.motion !== 'paused', true));
reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) setMotion(true); });
setMotion(document.documentElement.dataset.motion === 'paused');

document.querySelector('[data-print-cv]')?.addEventListener('click', () => window.print());

// Scroll progress is decorative; the article itself is server-rendered.
const progress = document.querySelector<HTMLElement>('.reading-progress');
if (progress) {
  const updateProgress = () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${total > 0 ? Math.min(1, window.scrollY / total) : 0})`;
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}
