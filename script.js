const root = document.documentElement;
const languageButton = document.querySelector('.language-button');
const languageCurrent = document.querySelector('.language-current');
const languageOther = document.querySelector('.language-other');
const menuButton = document.querySelector('.menu-button');
const navLinks = document.querySelector('.nav-links');
const newsToggle = document.querySelector('.news-toggle');
const newsItems = [...document.querySelectorAll('.news-list > article')];
const foldedNewsItems = newsItems.slice(4);

function setLanguage(language) {
  const value = language === 'en' ? 'en' : 'zh';
  root.lang = value === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('[data-zh][data-en]').forEach((element) => {
    element.textContent = element.dataset[value];
  });
  languageCurrent.textContent = value === 'zh' ? '中文' : 'EN';
  languageOther.textContent = value === 'zh' ? 'EN' : '中文';
  languageButton.setAttribute('aria-label', value === 'zh' ? 'Switch to English' : '切换到中文');
  document.title = value === 'zh'
    ? '张艺耀 | 计算机视觉与可靠 AI'
    : 'Yiyao Zhang | Computer Vision & Reliable AI';
  localStorage.setItem('preferred-language', value);
}

languageButton.addEventListener('click', () => {
  setLanguage(root.lang.startsWith('zh') ? 'en' : 'zh');
});

menuButton.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});

if (newsToggle && foldedNewsItems.length) {
  const showLabel = newsToggle.querySelector('.news-show');
  const hideLabel = newsToggle.querySelector('.news-hide');

  foldedNewsItems.forEach((item) => { item.hidden = true; });
  newsToggle.hidden = false;

  newsToggle.addEventListener('click', () => {
    const expanded = newsToggle.getAttribute('aria-expanded') === 'true';
    newsToggle.setAttribute('aria-expanded', String(!expanded));
    foldedNewsItems.forEach((item) => { item.hidden = expanded; });
    showLabel.hidden = !expanded;
    hideLabel.hidden = expanded;
  });
}

const sections = [...document.querySelectorAll('main section[id]')];
const items = [...navLinks.querySelectorAll('a')];
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    items.forEach((item) => item.classList.toggle('active', item.hash === `#${entry.target.id}`));
  });
}, { rootMargin: '-20% 0px -70% 0px' });

sections.forEach((section) => observer.observe(section));

const savedLanguage = localStorage.getItem('preferred-language');
setLanguage(savedLanguage || (navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en'));
