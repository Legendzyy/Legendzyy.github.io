const root = document.documentElement;
const languageButton = document.querySelector('.language-button');
const currentLanguage = document.querySelector('.language-current');
const otherLanguage = document.querySelector('.language-other');
const menuButton = document.querySelector('.menu-button');
const navLinks = document.querySelector('.nav-links');
const siteHeader = document.querySelector('.site-header');

function setLanguage(language) {
  const normalized = language === 'en' ? 'en' : 'zh';
  root.lang = normalized === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('[data-zh][data-en]').forEach((element) => {
    element.textContent = element.dataset[normalized];
  });
  currentLanguage.textContent = normalized === 'zh' ? '中' : 'EN';
  otherLanguage.textContent = normalized === 'zh' ? 'EN' : '中';
  languageButton.setAttribute('aria-label', normalized === 'zh' ? 'Switch to English' : '切换到中文');
  document.title = normalized === 'zh'
    ? '张艺耀 | 计算机视觉与边缘 AI'
    : 'Yiyao Zhang | Computer Vision & Embedded AI';
  localStorage.setItem('preferred-language', normalized);
}

languageButton.addEventListener('click', () => {
  setLanguage(root.lang.startsWith('zh') ? 'en' : 'zh');
});

menuButton.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});

window.addEventListener('scroll', () => {
  siteHeader.classList.toggle('scrolled', window.scrollY > 12);
}, { passive: true });

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const sections = [...document.querySelectorAll('main section[id]')];
const navigationItems = [...navLinks.querySelectorAll('a')];
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navigationItems.forEach((item) => {
      item.classList.toggle('active', item.getAttribute('href') === `#${entry.target.id}`);
    });
  });
}, { rootMargin: '-25% 0px -65% 0px' });

sections.forEach((section) => sectionObserver.observe(section));

const savedLanguage = localStorage.getItem('preferred-language');
setLanguage(savedLanguage || (navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en'));
