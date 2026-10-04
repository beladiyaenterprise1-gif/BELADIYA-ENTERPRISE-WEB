// Beladiya Enterprise - site interactions (vanilla JS)
(function () {
  // Mobile menu
  var nav = document.querySelector('.nav');
  var btn = document.querySelector('.menu-btn');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Highlight the current page in the nav
  var page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });

  // Footer year
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Reveal on scroll
  var items = document.querySelectorAll('.reveal');
  // Show anything already on screen right away (and very tall blocks), so content never stays hidden
  function revealVisible() {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    items.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) el.classList.add('in');
    });
  }
  revealVisible();
  window.addEventListener('load', revealVisible);
  setTimeout(function () { items.forEach(function (el) { el.classList.add('in'); }); }, 2500);
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // Subtle light-follow on glass cards (pointer devices only)
  if (window.matchMedia('(hover:hover)').matches) {
    document.querySelectorAll('.card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var x = ((e.clientX - r.left) / r.width) * 100;
        var y = ((e.clientY - r.top) / r.height) * 100;
        card.style.background = 'radial-gradient(circle at ' + x + '% ' + y + '%, rgba(255,255,255,.35), var(--glass) 55%)';
      });
      card.addEventListener('mouseleave', function () { card.style.background = ''; });
    });
  }

  // Contact form: submits to Formspree via fetch once the action URL is set
  var form = document.getElementById('contact-form');
  if (form) {
    var status = form.querySelector('.form-status');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var action = form.getAttribute('action') || '';
      if (!action || action.indexOf('YOUR_FORM_ID') !== -1) {
        status.className = 'form-status err';
        status.textContent = 'The form is not connected yet. Add your Formspree URL to the form action.';
        return;
      }
      var submit = form.querySelector('button[type="submit"]');
      submit.disabled = true; submit.textContent = 'Sending...';
      fetch(action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            status.className = 'form-status ok';
            status.textContent = 'Thank you! Your message has been sent. We will get back to you soon.';
          } else { throw new Error('bad'); }
        })
        .catch(function () {
          status.className = 'form-status err';
          status.textContent = 'Something went wrong. Please email us at beladiyaenterprise1@gmail.com.';
        })
        .finally(function () { submit.disabled = false; submit.textContent = 'Send Message'; });
    });
  }
})();
