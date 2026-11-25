const filters = document.querySelector('.filters');
const categoryButtons = [...filters.querySelectorAll('[data-filter]')];
const platformsGroup = filters.querySelector('.platform-filters');
const status = document.querySelector('#filter-status');
const emptyState = document.querySelector('.empty-state');
const cards = [...document.querySelectorAll('.app-card')].map(card => ({
    element: card,
    kind: card.dataset.kind,
    platforms: new Map([...card.querySelectorAll('[data-platform]')].map(badge => [
        badge.dataset.platform, badge
    ]))
}));
const platforms = new Map(cards.flatMap(card => [...card.platforms]));
const platformLabel = badge => badge.textContent.trim();
let category = 'all';
let platform = '';

for (const [value, badge] of [...platforms].sort((a, b) => platformLabel(a[1]).localeCompare(platformLabel(b[1])))) {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.platformFilter = value;
    button.setAttribute('aria-pressed', 'false');
    button.append(badge.querySelector('svg').cloneNode(true), platformLabel(badge));
    platformsGroup.append(button);
}
const platformButtons = [...platformsGroup.querySelectorAll('button')];

function updateFilters() {
    let count = 0;
    for (const card of cards) {
        const matchesCategory = category === 'all' || card.kind === category;
        const matchesPlatform = !platform || card.platforms.has(platform);
        card.element.hidden = !(matchesCategory && matchesPlatform);
        if (!card.element.hidden) count++;
    }
    for (const button of categoryButtons) {
        button.setAttribute('aria-pressed', String(button.dataset.filter === category));
    }
    for (const button of platformButtons) {
        button.setAttribute('aria-pressed', String(button.dataset.platformFilter === platform));
    }
    emptyState.hidden = count !== 0;
    status.textContent = count === 1 ? '1 title shown.' : `${count} titles shown.`;
}

for (const button of categoryButtons) {
    button.addEventListener('click', () => {
        category = button.dataset.filter;
        updateFilters();
    });
}
for (const button of platformButtons) {
    button.addEventListener('click', () => {
        platform = button.dataset.platformFilter;
        updateFilters();
    });
}
emptyState.querySelector('button').addEventListener('click', () => {
    category = 'all';
    platform = '';
    updateFilters();
    platformButtons[0].focus();
});
filters.hidden = false;
