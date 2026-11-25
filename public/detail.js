function bindCarousel(strip, controls) {
    const [previous, next] = controls.querySelectorAll('button');

    function updateControls() {
        const end = strip.scrollWidth - strip.clientWidth;
        controls.hidden = end <= 2;
        previous.setAttribute('aria-disabled', String(strip.scrollLeft <= 2));
        next.setAttribute('aria-disabled', String(strip.scrollLeft >= end - 2));
    }

    controls.addEventListener('click', event => {
        const button = event.target.closest('button');
        if (!button || button.getAttribute('aria-disabled') === 'true') return;
        const behavior = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
        strip.scrollBy({ left: Number(button.dataset.direction) * strip.clientWidth, behavior });
    });
    strip.addEventListener('scroll', updateControls, { passive: true });
    new ResizeObserver(updateControls).observe(strip);
    updateControls();
}

const gallery = document.querySelector('.detail-gallery');
if (gallery) bindCarousel(gallery.querySelector('.gallery-strip'), gallery.querySelector('.gallery-controls'));

async function loadRelatedApps() {
    const related = document.querySelector('.related-list');
    const response = await fetch('../');
    if (!response.ok) return;
    const home = new DOMParser().parseFromString(await response.text(), 'text/html');
    const items = [];
    for (const card of home.querySelectorAll('.app-card')) {
        const href = new URL(card.querySelector('.card-link').getAttribute('href'), response.url);
        if (href.pathname === location.pathname.replace(/index\.html$/, '')) continue;

        const item = document.createElement('li');
        const link = document.createElement('a');
        const icon = new Image(58, 58);
        icon.alt = '';
        icon.loading = 'lazy';
        icon.src = new URL(card.querySelector('.app-icon').getAttribute('src'), response.url);
        link.href = href;
        link.append(icon, card.querySelector('h3').textContent);
        item.append(link);
        items.push(item);
    }
    related.replaceChildren(...items);
    if (!items.length) return;
    const carousel = related.closest('.related-carousel');
    carousel.hidden = false;
    bindRelatedPages(carousel, related, items);
}

function bindRelatedPages(carousel, strip, items) {
    const bottom = carousel.querySelector('.related-bottom');
    const dots = carousel.querySelector('.related-pagination');
    const [previous, next] = bottom.querySelectorAll('[data-direction]');
    let offsets = [];
    let page = 0;

    function updatePage() {
        page = offsets.reduce((closest, offset, index) =>
            Math.abs(offset - strip.scrollLeft) < Math.abs(offsets[closest] - strip.scrollLeft) ? index : closest, 0);
        for (const [index, dot] of [...dots.children].entries()) {
            if (index === page) dot.setAttribute('aria-current', 'page');
            else dot.removeAttribute('aria-current');
        }
        previous.setAttribute('aria-disabled', String(page === 0));
        next.setAttribute('aria-disabled', String(page >= offsets.length - 1));
    }

    function goTo(index) {
        if (index < 0 || index >= offsets.length) return;
        const behavior = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
        strip.scrollTo({ left: offsets[index], behavior });
    }

    function measure() {
        const visible = Number(getComputedStyle(strip).getPropertyValue('--visible'));
        const max = strip.scrollWidth - strip.clientWidth;
        offsets = items.filter((_, index) => index % visible === 0)
            .map(item => Math.min(item.offsetLeft - items[0].offsetLeft, max));
        const buttons = offsets.map((_, index) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.setAttribute('aria-label', `App page ${index + 1} of ${offsets.length}`);
            button.addEventListener('click', () => goTo(index));
            return button;
        });
        dots.replaceChildren(...buttons);
        bottom.hidden = max <= 2;
        updatePage();
    }

    previous.addEventListener('click', () => goTo(page - 1));
    next.addEventListener('click', () => goTo(page + 1));
    strip.addEventListener('scroll', updatePage, { passive: true });
    new ResizeObserver(measure).observe(strip);
    measure();
}

loadRelatedApps().catch(() => {
    // The link to the complete catalog remains available if it cannot be loaded here.
});
