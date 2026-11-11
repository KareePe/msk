(function () {
  'use strict';

  // ใส่ลิงก์ LINE Official Account ของบริษัทที่นี่ (เช่น https://lin.ee/xxxxxxx)
  var LINE_URL = 'https://line.me/ti/p/nKMrUMu_K6';

  document.querySelectorAll('.js-line-link').forEach(function (a) {
    a.href = LINE_URL;
    if (LINE_URL !== '#') {
      a.target = '_blank';
      a.rel = 'noopener';
    }
  });

  // ---------- Carousel ----------
  document.querySelectorAll('[data-carousel]').forEach(function (root) {
    var track = root.querySelector('.carousel-track');
    var prev = root.querySelector('.prev');
    var next = root.querySelector('.next');

    function step() {
      var card = track.children[0];
      var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return card ? card.getBoundingClientRect().width + gap : track.clientWidth;
    }

    function update() {
      var max = track.scrollWidth - track.clientWidth - 2;
      var noScroll = max <= 0;
      prev.disabled = noScroll || track.scrollLeft <= 2;
      next.disabled = noScroll || track.scrollLeft >= max;
      root.classList.toggle('is-static', noScroll);
    }

    prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); });
    next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: 'smooth' }); });
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  });

  // ---------- Preloader + AOS ----------
  var preloader = document.getElementById('preloader');
  var started = false;

  function startAnimations() {
    if (started) return;
    started = true;
    if (preloader) {
      preloader.classList.add('is-hidden');
      setTimeout(function () { preloader.remove(); }, 600);
    }
    if (window.AOS) {
      AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 60,
        disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
      });
    } else {
      // CDN โหลดไม่ได้: แสดงเนื้อหาทั้งหมดตามปกติ
      document.querySelectorAll('[data-aos]').forEach(function (el) { el.removeAttribute('data-aos'); });
    }
  }

  if (document.readyState === 'complete') startAnimations();
  else window.addEventListener('load', startAnimations);
  setTimeout(startAnimations, 4000); // กันกรณีรูปบางรูปโหลดช้ามาก

  // ---------- Back to top: แสดงเมื่อเลื่อนผ่าน #hero ----------
  var toTop = document.getElementById('back-to-top');
  var hero = document.getElementById('hero');
  if (toTop && hero) {
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        toTop.classList.toggle('is-visible', !entries[0].isIntersecting);
      }).observe(hero);
    } else {
      window.addEventListener('scroll', function () {
        toTop.classList.toggle('is-visible', window.scrollY > hero.offsetHeight);
      }, { passive: true });
    }
    toTop.addEventListener('click', function () {
      var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
      var logo = document.querySelector('.site-header .logo');
      if (logo) logo.focus({ preventScroll: true });
    });
  }

  // ---------- FAQ: เปิดได้ทีละข้อ ----------
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (!item.open) return;
      faqItems.forEach(function (other) {
        if (other !== item) other.open = false;
      });
    });
  });
})();
