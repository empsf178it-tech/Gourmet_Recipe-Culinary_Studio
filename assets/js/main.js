/**
 * GOURMET RECIPE & CULINARY STUDIO - MASTER JAVASCRIPT
 * Vanilla JS ES6+ Interactive Architecture
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileMenu();
  initScrollAnimations();
  initRecipeFilters();
  initRecipeSearch();
  initFavoritesSystem();
  initIngredientChecklist();
  initRecipeCompletion();
  initFormsValidation();
  initAuthSystem();
  initPasswordToggle();
  initDashboardSystem();
  initBackToTop();
  initHeroLetterAnimation();
  initCardSpotlightEffect();
  initStatsCounterAnimation();
});

/* --------------------------------------------------------------------------
   01. HEADER SCROLL & MOBILE MENU SYSTEM
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.querySelector('.gourmet-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

function initMobileMenu() {
  const hamburgerBtn = document.querySelector('.mobile-hamburger');
  const menuOverlay = document.querySelector('.mobile-menu-overlay');
  const closeBtn = document.querySelector('.mobile-menu-close');

  if (!hamburgerBtn || !menuOverlay) return;

  function openMenu() {
    menuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menuOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburgerBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  // Close menu on clicking nav link
  menuOverlay.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // ESC Key closes menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuOverlay.classList.contains('active')) {
      closeMenu();
    }
  });
}

/* --------------------------------------------------------------------------
   02. SCROLL ANIMATIONS (INTERSECTION OBSERVER)
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.reveal-fade-up');
  if (!elements.length) return;

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  elements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   03. RECIPE CATEGORY FILTERS
   -------------------------------------------------------------------------- */
function initRecipeFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const recipeCards = document.querySelectorAll('.recipe-filter-item');

  if (!filterBtns.length || !recipeCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCategory = btn.getAttribute('data-filter');

      recipeCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterCategory === 'all' || cardCategory === filterCategory) {
          card.style.display = 'block';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   04. RECIPE SEARCH FUNCTIONALITY
   -------------------------------------------------------------------------- */
function initRecipeSearch() {
  const searchInput = document.getElementById('recipeSearchInput');
  const recipeCards = document.querySelectorAll('.recipe-filter-item');
  const noResultsMsg = document.getElementById('noResultsMessage');

  if (!searchInput || !recipeCards.length) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    let visibleCount = 0;

    recipeCards.forEach(card => {
      const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
      const category = card.querySelector('.card-category')?.textContent.toLowerCase() || '';

      if (title.includes(query) || category.includes(query)) {
        card.style.display = 'block';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (noResultsMsg) {
      noResultsMsg.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  });
}

/* --------------------------------------------------------------------------
   05. FAVORITES SYSTEM (LOCALSTORAGE)
   -------------------------------------------------------------------------- */
function getFavorites() {
  return JSON.parse(localStorage.getItem('gourmetFavorites') || '[]');
}

function saveFavorites(favs) {
  localStorage.setItem('gourmetFavorites', JSON.stringify(favs));
}

function initFavoritesSystem() {
  const favBtns = document.querySelectorAll('.btn-favorite');
  const currentFavs = getFavorites();

  favBtns.forEach(btn => {
    const recipeId = btn.getAttribute('data-id');
    if (!recipeId) return;

    if (currentFavs.includes(recipeId)) {
      btn.classList.add('active');
    }

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      let favs = getFavorites();
      if (favs.includes(recipeId)) {
        favs = favs.filter(id => id !== recipeId);
        btn.classList.remove('active');
        showToast('Recipe removed from favorites');
      } else {
        favs.push(recipeId);
        btn.classList.add('active');
        showToast('Recipe saved to favorites');
      }
      saveFavorites(favs);
      updateDashboardFavorites();
    });
  });
}

/* --------------------------------------------------------------------------
   06. INGREDIENT CHECKLIST & RECIPE COMPLETION
   -------------------------------------------------------------------------- */
function initIngredientChecklist() {
  const items = document.querySelectorAll('.ingredient-item');
  if (!items.length) return;

  const checkedIngredients = JSON.parse(localStorage.getItem('gourmetIngredients') || '{}');

  items.forEach((item, idx) => {
    const key = `ing_${idx}`;
    const checkbox = item.querySelector('input[type="checkbox"]');

    if (checkedIngredients[key]) {
      item.classList.add('checked');
      if (checkbox) checkbox.checked = true;
    }

    item.addEventListener('click', (e) => {
      if (e.target.tagName !== 'INPUT') {
        if (checkbox) checkbox.checked = !checkbox.checked;
      }
      if (checkbox && checkbox.checked) {
        item.classList.add('checked');
        checkedIngredients[key] = true;
        showToast('Ingredient checked off');
      } else {
        item.classList.remove('checked');
        delete checkedIngredients[key];
      }
      localStorage.setItem('gourmetIngredients', JSON.stringify(checkedIngredients));
    });
  });
}

function initRecipeCompletion() {
  const completeBtn = document.getElementById('markCompleteBtn');
  if (!completeBtn) return;

  const recipeId = completeBtn.getAttribute('data-id') || 'berry_tart';
  const completed = JSON.parse(localStorage.getItem('gourmetCompletedRecipes') || '[]');

  if (completed.includes(recipeId)) {
    completeBtn.classList.add('btn-success');
    completeBtn.innerHTML = '<i class="bi bi-check-circle-fill"></i> Completed';
  }

  completeBtn.addEventListener('click', () => {
    let doneList = JSON.parse(localStorage.getItem('gourmetCompletedRecipes') || '[]');
    if (doneList.includes(recipeId)) {
      doneList = doneList.filter(id => id !== recipeId);
      completeBtn.classList.remove('btn-success');
      completeBtn.innerHTML = '<i class="bi bi-check-circle"></i> Mark as Completed';
      showToast('Recipe marked as incomplete');
    } else {
      doneList.push(recipeId);
      completeBtn.classList.add('btn-success');
      completeBtn.innerHTML = '<i class="bi bi-check-circle-fill"></i> Completed';
      showToast('Congratulations! Recipe marked as completed 🎉');
    }
    localStorage.setItem('gourmetCompletedRecipes', JSON.stringify(doneList));
  });
}

/* --------------------------------------------------------------------------
   07. FORMS & VALIDATION (CONTACT & NEWSLETTER)
   -------------------------------------------------------------------------- */
function initFormsValidation() {
  // Contact Form
  const contactForm = document.getElementById('gourmetContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName')?.value.trim();
      const email = document.getElementById('contactEmail')?.value.trim();
      const subject = document.getElementById('contactSubject')?.value.trim();
      const message = document.getElementById('contactMessage')?.value.trim();

      if (!name || !email || !subject || !message) {
        showToast('Please fill out all required fields', 'error');
        return;
      }

      if (!validateEmail(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
      }

      contactForm.reset();
      showToast('Thank you! Your message has been received in this demo experience.');
    });
  }

  // Newsletter Form
  const newsletterForms = document.querySelectorAll('.gourmet-newsletter-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      const email = emailInput?.value.trim();

      if (!email || !validateEmail(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
      }

      if (emailInput) emailInput.value = '';
      showToast('Welcome! You are now subscribed to the Recipe Journal.');
    });
  });
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* --------------------------------------------------------------------------
   08. DEMO AUTHENTICATION & POPUP MODAL SYSTEM
   -------------------------------------------------------------------------- */
function initAuthSystem() {
  createAuthModalDOM();

  // Intercept click on any login / register links across all pages
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('a[href*="login.html"], a[href*="register.html"], [data-auth-trigger]');
    if (trigger) {
      const href = trigger.getAttribute('href') || '';
      const dataTrigger = trigger.getAttribute('data-auth-trigger');
      
      const mode = (href.includes('register') || dataTrigger === 'register') ? 'register' : 'login';
      
      if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
        e.preventDefault();
        openAuthModal(mode);
      }
    }
  });

  // Check URL hash for auto-open (e.g. #login or #register)
  if (window.location.hash === '#login') {
    openAuthModal('login');
  } else if (window.location.hash === '#register') {
    openAuthModal('register');
  }

  // Handle standalone page forms if on login.html or register.html directly
  const loginForm = document.getElementById('gourmetLoginForm');
  const registerForm = document.getElementById('gourmetRegisterForm');
  const logoutBtns = document.querySelectorAll('.btn-logout-action');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail')?.value.trim();
      processLogin(email);
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('regName')?.value.trim();
      const email = document.getElementById('regEmail')?.value.trim();
      processRegister(name, email);
    });
  }

  logoutBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('gourmetSession');
      showToast('Logged out successfully');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 800);
    });
  });
}

function processLogin(email) {
  if (!email) {
    showToast('Please enter your email address', 'error');
    return;
  }

  const user = {
    name: email.split('@')[0],
    email: email,
    favoriteCategory: 'French Patisserie'
  };

  localStorage.setItem('gourmetUser', JSON.stringify(user));
  localStorage.setItem('gourmetSession', 'active');

  closeAuthModal();
  showToast(`Welcome back, ${user.name}! Redirecting...`);
  setTimeout(() => {
    window.location.href = 'dashboard.html';
  }, 1000);
}

function processRegister(name, email, specialty = 'French Patisserie') {
  if (!name || !email) {
    showToast('Please fill in all required fields', 'error');
    return;
  }

  const user = {
    name: name,
    email: email,
    favoriteCategory: specialty
  };

  localStorage.setItem('gourmetUser', JSON.stringify(user));
  localStorage.setItem('gourmetSession', 'active');

  closeAuthModal();
  showToast('Account created successfully! Redirecting...');
  setTimeout(() => {
    window.location.href = 'dashboard.html';
  }, 1000);
}

function createAuthModalDOM() {
  if (document.getElementById('gourmetAuthModal')) return;

  const modalOverlay = document.createElement('div');
  modalOverlay.id = 'gourmetAuthModal';
  modalOverlay.className = 'gourmet-auth-modal-overlay';
  modalOverlay.setAttribute('aria-hidden', 'true');

  modalOverlay.innerHTML = `
    <div class="gourmet-auth-modal-dialog">
      <button type="button" class="gourmet-auth-modal-close" id="closeAuthModalBtn" aria-label="Close modal">
        <i class="bi bi-x-lg"></i>
      </button>
      
      <div class="gourmet-auth-header text-center mb-4">
        <div class="brand-symbol mx-auto mb-2" style="width: 44px; height: 44px;"><img src="assets/images/logo.svg" alt="Gourmet Studio emblem"></div>
        <h3 class="h4 text-white font-heading mb-1" id="authModalTitle">Welcome to Gourmet Studio</h3>
        <p class="small text-muted mb-0" id="authModalSub">Access your culinary progress & saved recipes</p>
      </div>

      <!-- Social Quick Login -->
      <div class="auth-social-buttons mb-3">
        <button type="button" class="btn-auth-social btn-auth-google" aria-label="Continue with Google" onclick="processLogin('google.user@gourmetstudio.com')">
          <i class="bi bi-google"></i>
          <span>Google</span>
        </button>
        <button type="button" class="btn-auth-social btn-auth-apple" aria-label="Continue with Apple" onclick="processLogin('apple.user@gourmetstudio.com')">
          <i class="bi bi-apple"></i>
          <span>Apple</span>
        </button>
        <button type="button" class="btn-auth-social btn-auth-facebook" aria-label="Continue with Facebook" onclick="processLogin('facebook.user@gourmetstudio.com')">
          <i class="bi bi-facebook"></i>
          <span>Facebook</span>
        </button>
      </div>

      <div class="auth-divider mb-3">
        <span>OR USE EMAIL</span>
      </div>

      <div class="gourmet-auth-tabs d-flex mb-4">
        <button type="button" class="auth-tab-btn active" data-tab="login"><i class="bi bi-box-arrow-in-right me-1"></i> Sign In</button>
        <button type="button" class="auth-tab-btn" data-tab="register"><i class="bi bi-person-plus me-1"></i> Create Account</button>
      </div>

      <!-- LOGIN FORM -->
      <form id="modalLoginForm" class="auth-tab-panel active">
        <div class="form-group mb-3">
          <label class="form-label text-white small" for="modalLoginEmail">Email Address</label>
          <input type="email" id="modalLoginEmail" class="form-control-gourmet" placeholder="santhosh@gourmetstudio.com" value="santhosh@gourmetstudio.com" required>
        </div>
        <div class="form-group mb-3">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <label class="form-label text-white small mb-0" for="modalLoginPassword">Password</label>
            <a href="#" class="small text-accent-gold text-decoration-none" onclick="alert('Demo password reset link sent!'); return false;">Forgot?</a>
          </div>
          <div class="password-input-wrap">
            <input type="password" id="modalLoginPassword" class="form-control-gourmet" placeholder="••••••••" value="demo1234" required>
            <button type="button" class="btn-toggle-password" data-target="modalLoginPassword" aria-label="Toggle password visibility">
              <i class="bi bi-eye"></i>
            </button>
          </div>
        </div>
        <div class="form-check mb-4">
          <input class="form-check-input" type="checkbox" id="modalRememberMe" checked>
          <label class="form-check-label small text-muted" for="modalRememberMe">Remember me on this device</label>
        </div>
        <button type="submit" class="btn-gourmet-primary w-100 py-3">Sign In <i class="bi bi-arrow-right ms-1"></i></button>
      </form>

      <!-- REGISTER FORM -->
      <form id="modalRegisterForm" class="auth-tab-panel">
        <div class="form-group mb-3">
          <label class="form-label text-white small" for="modalRegName">Full Name</label>
          <input type="text" id="modalRegName" class="form-control-gourmet" placeholder="e.g. Santhosh" required>
        </div>
        <div class="form-group mb-3">
          <label class="form-label text-white small" for="modalRegEmail">Email Address</label>
          <input type="email" id="modalRegEmail" class="form-control-gourmet" placeholder="santhosh@example.com" required>
        </div>
        <div class="form-group mb-3">
          <label class="form-label text-white small" for="modalRegPass">Password</label>
          <div class="password-input-wrap">
            <input type="password" id="modalRegPass" class="form-control-gourmet" placeholder="At least 6 characters" required>
            <button type="button" class="btn-toggle-password" data-target="modalRegPass" aria-label="Toggle password visibility">
              <i class="bi bi-eye"></i>
            </button>
          </div>
        </div>
        <div class="form-group mb-3">
          <label class="form-label text-white small" for="modalRegSpecialty">Preferred Specialty</label>
          <select id="modalRegSpecialty" class="form-control-gourmet">
            <option value="French Patisserie">French Patisserie</option>
            <option value="Artisan Breads">Artisan Breads & Sourdough</option>
            <option value="Chocolate Atelier">Chocolate & Confectionery</option>
            <option value="Tarts & Entremets">Tarts & Entremets</option>
          </select>
        </div>
        <button type="submit" class="btn-gourmet-primary w-100 py-3">Create Studio Account <i class="bi bi-person-check ms-1"></i></button>
      </form>
    </div>
  `;

  document.body.appendChild(modalOverlay);

  // Tab switching logic inside modal
  const tabBtns = modalOverlay.querySelectorAll('.auth-tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      switchAuthModalTab(targetTab);
    });
  });

  // Close handlers
  const closeBtn = document.getElementById('closeAuthModalBtn');
  if (closeBtn) closeBtn.addEventListener('click', closeAuthModal);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeAuthModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeAuthModal();
    }
  });

  // Modal Form Submissions
  const modalLoginForm = document.getElementById('modalLoginForm');
  if (modalLoginForm) {
    modalLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('modalLoginEmail')?.value.trim();
      processLogin(email);
    });
  }

  const modalRegisterForm = document.getElementById('modalRegisterForm');
  if (modalRegisterForm) {
    modalRegisterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('modalRegName')?.value.trim();
      const email = document.getElementById('modalRegEmail')?.value.trim();
      const specialty = document.getElementById('modalRegSpecialty')?.value;
      processRegister(name, email, specialty);
    });
  }
}

function openAuthModal(tab = 'login') {
  const modalOverlay = document.getElementById('gourmetAuthModal');
  if (!modalOverlay) return;

  switchAuthModalTab(tab);
  modalOverlay.classList.add('active');
  modalOverlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeAuthModal() {
  const modalOverlay = document.getElementById('gourmetAuthModal');
  if (!modalOverlay) return;

  modalOverlay.classList.remove('active');
  modalOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function switchAuthModalTab(tab) {
  const modalOverlay = document.getElementById('gourmetAuthModal');
  if (!modalOverlay) return;

  const tabBtns = modalOverlay.querySelectorAll('.auth-tab-btn');
  const panels = modalOverlay.querySelectorAll('.auth-tab-panel');
  const title = document.getElementById('authModalTitle');
  const sub = document.getElementById('authModalSub');

  tabBtns.forEach(btn => {
    if (btn.getAttribute('data-tab') === tab) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  panels.forEach(panel => {
    if (panel.id === (tab === 'login' ? 'modalLoginForm' : 'modalRegisterForm')) {
      panel.classList.add('active');
    } else {
      panel.classList.remove('active');
    }
  });

  if (title && sub) {
    if (tab === 'login') {
      title.textContent = 'Welcome Back';
      sub.textContent = 'Sign in to access saved recipes & masterclasses';
    } else {
      title.textContent = 'Join Gourmet Studio';
      sub.textContent = 'Create your account to unlock artisan features';
    }
  }
}

/* --------------------------------------------------------------------------
   08B. PASSWORD VISIBILITY TOGGLE (EYE ICON)
   -------------------------------------------------------------------------- */
function initPasswordToggle() {
  document.addEventListener('click', (e) => {
    const toggleBtn = e.target.closest('.btn-toggle-password');
    if (!toggleBtn) return;

    e.preventDefault();
    const targetId = toggleBtn.getAttribute('data-target');
    let input = targetId ? document.getElementById(targetId) : null;
    
    if (!input) {
      const parentWrap = toggleBtn.closest('.password-input-wrap');
      if (parentWrap) {
        input = parentWrap.querySelector('input');
      }
    }

    if (input) {
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';

      const icon = toggleBtn.querySelector('i');
      if (icon) {
        if (isPassword) {
          icon.classList.remove('bi-eye');
          icon.classList.add('bi-eye-slash');
        } else {
          icon.classList.remove('bi-eye-slash');
          icon.classList.add('bi-eye');
        }
      }
    }
  });
}

/* --------------------------------------------------------------------------
   09. DASHBOARD INITIALIZATION
   -------------------------------------------------------------------------- */
function initDashboardSystem() {
  const userNameHeading = document.getElementById('dashUserName');
  if (!userNameHeading) return;

  const user = JSON.parse(localStorage.getItem('gourmetUser') || '{"name":"Santhosh","email":"santhosh@gourmetstudio.com","favoriteCategory":"French Patisserie"}');
  userNameHeading.textContent = `Welcome back, ${user.name}.`;

  // Animate progress bars on load
  setTimeout(() => {
    document.querySelectorAll('.progress-bar-fill').forEach(bar => {
      const targetWidth = bar.getAttribute('data-width') || '75%';
      bar.style.width = targetWidth;
    });
  }, 300);

  updateDashboardFavorites();
}

function updateDashboardFavorites() {
  const countEl = document.getElementById('dashFavCount');
  if (countEl) {
    const favs = getFavorites();
    countEl.textContent = favs.length;
  }
}

/* --------------------------------------------------------------------------
   10. TOAST NOTIFICATION SYSTEM
   -------------------------------------------------------------------------- */
function showToast(message, type = 'info') {
  let container = document.querySelector('.gourmet-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'gourmet-toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'gourmet-toast';
  
  const icon = type === 'error' ? 'bi-exclamation-circle-fill' : 'bi-check-circle-fill';
  toast.innerHTML = `<i class="bi ${icon}" style="color: var(--accent-gold); font-size: 1.2rem;"></i> <span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 50);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

/* --------------------------------------------------------------------------
   11. BACK TO TOP BUTTON SYSTEM
   -------------------------------------------------------------------------- */
function initBackToTop() {
  let backBtn = document.getElementById('backToTop');
  if (!backBtn) {
    backBtn = document.createElement('button');
    backBtn.id = 'backToTop';
    backBtn.className = 'back-to-top';
    backBtn.setAttribute('aria-label', 'Back to top');
    backBtn.setAttribute('title', 'Back to Top');
    backBtn.innerHTML = '<i class="bi bi-arrow-up"></i>';
    document.body.appendChild(backBtn);
  }

  const toggleBackToTop = () => {
    if (window.scrollY > 250) {
      backBtn.classList.add('visible');
    } else {
      backBtn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', toggleBackToTop, { passive: true });
  toggleBackToTop();

  backBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* --------------------------------------------------------------------------
   12. HERO HEADLINE LETTER-BY-LETTER FALL ANIMATION
   -------------------------------------------------------------------------- */
function initHeroLetterAnimation() {
  const headline = document.querySelector('.hero-bloom-headline');
  if (!headline) return;

  let baseDelay = 0.12;
  const charStep = 0.038;

  function processTextNodes(element, startDelay, extraClass = '') {
    let currentDelay = startDelay;
    const nodes = Array.from(element.childNodes);

    nodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        if (!text || text.trim().length === 0) return;

        const fragment = document.createDocumentFragment();
        for (let i = 0; i < text.length; i++) {
          const char = text[i];
          const span = document.createElement('span');

          if (char === ' ') {
            span.className = 'char-space';
            span.innerHTML = '&nbsp;';
          } else {
            span.className = extraClass ? `char-fall ${extraClass}` : 'char-fall';
            span.style.animationDelay = `${currentDelay.toFixed(3)}s`;
            span.textContent = char;
            currentDelay += charStep;
          }
          fragment.appendChild(span);
        }
        node.parentNode.replaceChild(fragment, node);
      } else if (node.nodeType === Node.ELEMENT_NODE && !node.classList.contains('sparkle-icon')) {
        currentDelay = processTextNodes(node, currentDelay, extraClass);
      }
    });

    return currentDelay;
  }

  const line1 = headline.querySelector('.bloom-line.line-1');
  if (line1) {
    line1.style.opacity = '1';
    line1.style.filter = 'none';
    line1.style.transform = 'none';
    line1.style.animation = 'none';
    baseDelay = processTextNodes(line1, baseDelay);
  }

  baseDelay += 0.12; // Brief pause before line 2 drops

  const line2 = headline.querySelector('.bloom-line.line-2');
  if (line2) {
    line2.style.opacity = '1';
    line2.style.filter = 'none';
    line2.style.transform = 'none';
    line2.style.animation = 'none';
    baseDelay = processTextNodes(line2, baseDelay, 'gold-shimmer-char');
  }

  const sparkle = headline.querySelector('.sparkle-icon');
  if (sparkle) {
    sparkle.style.opacity = '0';
    sparkle.style.animation = `letterFallFromTop 0.65s cubic-bezier(0.215, 0.61, 0.355, 1) ${baseDelay.toFixed(3)}s forwards, sparkleRotatePulse 4s ease-in-out ${(baseDelay + 0.65).toFixed(3)}s infinite alternate`;
  }
}

/* --------------------------------------------------------------------------
   13. CARD CURSOR-FOLLOWING SPOTLIGHT AURA
   -------------------------------------------------------------------------- */
function initCardSpotlightEffect() {
  const cards = document.querySelectorAll('.gourmet-card, .hero-stats-card, .story-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* --------------------------------------------------------------------------
   14. STATS COUNTER COUNT-UP ANIMATION
   -------------------------------------------------------------------------- */
function initStatsCounterAnimation() {
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (!statNumbers.length) return;

  const animateCount = (stat) => {
    const target = parseInt(stat.getAttribute('data-target'), 10);
    const suffix = stat.getAttribute('data-suffix') || '';
    let count = 0;
    const duration = 1800;
    const stepTime = 20;
    const totalSteps = duration / stepTime;
    const increment = target / totalSteps;

    const timer = setInterval(() => {
      count += increment;
      if (count >= target) {
        count = target;
        clearInterval(timer);
      }
      stat.textContent = Math.floor(count) + suffix;
    }, stepTime);
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(stat => observer.observe(stat));
}

