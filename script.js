// Simple site script: loads editable data from the JSON block and wires up UI interactions.

document.addEventListener('DOMContentLoaded', function(){
  // Load site data
  let dataEl = document.getElementById('site-data');
  let data = {};
  try { data = JSON.parse(dataEl.textContent); } catch(e) { console.warn('Invalid site-data JSON', e); }

  // Populate basic fields
  document.getElementById('hero-title').textContent = data.ebookTitle || document.getElementById('hero-title').textContent;
  document.getElementById('hero-author').innerHTML = 'by <strong>' + (data.authorName || 'RUTH YAKUBU') + '</strong>';
  document.getElementById('hero-desc').textContent = data.shortDescription || document.getElementById('hero-desc').textContent;
  document.getElementById('price-text').textContent = data.priceText || document.getElementById('price-text').textContent;
  document.getElementById('price-text-2').textContent = data.priceText || document.getElementById('price-text-2').textContent;

  // Cover & author photos
  if (data.coverImage) {
    let c = document.getElementById('cover-img');
    c.src = data.coverImage;
    c.alt = 'Ebook cover: ' + (data.ebookTitle || '');
    let mini = document.querySelector('.mini-cover img');
    if (mini) mini.src = data.coverImage;
  }
  if (data.authorPhoto) {
    let a = document.getElementById('author-photo');
    a.src = data.authorPhoto;
  }
  if (data.authorBio) {
    document.getElementById('author-bio').textContent = data.authorBio;
  }

  // Buy links
  let buyEls = document.querySelectorAll('#buy-cta, #buy-now');
  buyEls.forEach(function(el){
    if (data.buyLink) el.href = data.buyLink;
  });

  // Populate testimonials
  let tcont = document.getElementById('testimonials-list');
  tcont.innerHTML = '';
  (data.testimonials || []).forEach(function(t){
    let div = document.createElement('div');
    div.className = 'testimonial';
    div.innerHTML = '<p class="quote">“' + (t.quote || '') + '”</p><p class="muted">— ' + (t.name || '') + '</p>';
    tcont.appendChild(div);
  });

  // Populate FAQ
  let fcont = document.getElementById('faq-list');
  fcont.innerHTML = '';
  (data.faqs || []).forEach(function(f, i){
    let item = document.createElement('div');
    item.className = 'faq-item';
    item.innerHTML = '<div class="faq-q" aria-expanded="false"><strong>' + (f.q || '') + '</strong><span aria-hidden>+</span></div><div class="faq-a">' + (f.a || '') + '</div>';
    fcont.appendChild(item);
  });

  // FAQ toggle
  document.querySelectorAll('.faq-item .faq-q').forEach(function(q){
    q.addEventListener('click', function(){
      let expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !expanded);
      let a = this.nextElementSibling;
      if (a) a.style.display = expanded ? 'none' : 'block';
      this.querySelector('span').textContent = expanded ? '+' : '−';
    });
  });

  // Year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Mobile nav toggle
  let navToggle = document.getElementById('nav-toggle');
  let nav = document.getElementById('main-nav');
  navToggle && navToggle.addEventListener('click', function(){
    let expanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', !expanded);
    nav.classList.toggle('show');
  });

  // Smooth anchor scrolling
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      let target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth', block:'start'});
        // close mobile nav
        nav && nav.classList.remove('show');
        navToggle && navToggle.setAttribute('aria-expanded','false');
      }
    });
  });

  // Optional: basic contact form handler (mailto fallback)
  let contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(){
      // The form uses mailto action by default; for a production site use a server or service (Formspree, Netlify Forms).
      alert('This form uses your email app to send the message. For an integrated contact form, connect a server or a form service.');
    });
  }
});
