const themeToggle = document.querySelector('.theme-toggle');
const themeKey = 'imango-home-theme';

function setHomeTheme(theme) {
    document.documentElement.dataset.theme = theme;
    themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
}

try {
    if (localStorage.getItem(themeKey) === 'dark') setHomeTheme('dark');
} catch {
    // The switch still works if browser storage is unavailable.
}
themeToggle.addEventListener('click', () => {
    const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    setHomeTheme(theme);
    try {
        localStorage.setItem(themeKey, theme);
    } catch {
        // Keep the current theme for this page even when it cannot be saved.
    }
});
themeToggle.hidden = false;
