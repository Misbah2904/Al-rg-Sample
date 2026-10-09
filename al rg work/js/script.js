/**
 * AL-RG FOOD PARADISE - Official Vanilla JavaScript
 * Chhatrapati Sambhajinagar, Maharashtra
 * Pure Vanilla JS - High Performance, Zero Dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ------------------------------------------------------------------------
     1. SCROLL PROGRESS BAR & HEADER SCROLLED STATE
     ------------------------------------------------------------------------ */
  const header = document.querySelector('.site-header');
  const scrollProgress = document.getElementById('scroll-progress');
  const backToTopBtn = document.querySelector('.back-to-top-btn');

  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // Progress Bar
    if (scrollProgress && docHeight > 0) {
      const scrollPercent = (scrollTop / docHeight) * 100;
      scrollProgress.style.width = `${scrollPercent}%`;
    }

    // Header Scrolled Class
    if (header) {
      if (scrollTop > 60) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Back To Top Button
    if (backToTopBtn) {
      if (scrollTop > 500) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // Parallax on Hero bg if present
    const parallaxBg = document.querySelector('.hero-bg-layer');
    if (parallaxBg && scrollTop < window.innerHeight) {
      parallaxBg.style.transform = `translateY(${scrollTop * 0.28}px) scale(1.05)`;
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ------------------------------------------------------------------------
     2. MOBILE NAVIGATION DRAWER & HAMBURGER TOGGLE
     ------------------------------------------------------------------------ */
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mobileNavDrawer = document.querySelector('.mobile-nav-drawer');
  const mobileNavBackdrop = document.querySelector('.mobile-nav-backdrop');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const toggleMobileNav = (open) => {
    const shouldOpen = open !== undefined ? open : !mobileNavDrawer.classList.contains('open');
    if (hamburgerBtn) hamburgerBtn.classList.toggle('active', shouldOpen);
    if (mobileNavDrawer) mobileNavDrawer.classList.toggle('open', shouldOpen);
    if (mobileNavBackdrop) mobileNavBackdrop.classList.toggle('open', shouldOpen);
    document.body.style.overflow = shouldOpen ? 'hidden' : '';
  };

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => toggleMobileNav());
  }

  if (mobileNavBackdrop) {
    mobileNavBackdrop.addEventListener('click', () => toggleMobileNav(false));
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => toggleMobileNav(false));
  });

  /* ------------------------------------------------------------------------
     3. SCROLL TRIGGERED REVEAL ANIMATIONS (IntersectionObserver)
     ------------------------------------------------------------------------ */
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.12
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  /* ------------------------------------------------------------------------
     4. GALLERY FILTERING & LIGHTBOX MODAL
     ------------------------------------------------------------------------ */
  const galleryFilterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.masonry-item');
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-image');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let currentGalleryList = [];
  let currentImageIndex = 0;

  // Gallery filtering
  if (galleryFilterBtns.length > 0 && galleryItems.length > 0) {
    galleryFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        galleryFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        galleryItems.forEach(item => {
          const category = item.getAttribute('data-category');
          if (filter === 'all' || category === filter || category.includes(filter)) {
            item.style.display = 'inline-block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            }, 20);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  // Lightbox Functionality
  const updateLightboxContent = (index) => {
    if (!currentGalleryList[index]) return;
    currentImageIndex = index;
    const item = currentGalleryList[index];
    const imgEl = item.querySelector('img');
    const titleEl = item.querySelector('.masonry-title, .gallery-item-title');
    const categoryEl = item.querySelector('.masonry-badge, .gallery-item-category');

    const src = imgEl ? (imgEl.getAttribute('data-full') || imgEl.src) : '';
    const alt = imgEl ? imgEl.alt : 'AL-RG Food Paradise';
    const titleText = titleEl ? titleEl.textContent : alt;
    const catText = categoryEl ? ` - ${categoryEl.textContent}` : '';

    if (lightboxImg) {
      lightboxImg.src = src;
      lightboxImg.alt = alt;
    }
    if (lightboxCaption) {
      lightboxCaption.textContent = `${titleText}${catText}`;
    }
  };

  const openLightbox = (itemsList, clickedIndex) => {
    currentGalleryList = Array.from(itemsList).filter(item => item.style.display !== 'none');
    currentImageIndex = currentGalleryList.indexOf(itemsList[clickedIndex]);
    if (currentImageIndex === -1) currentImageIndex = 0;

    updateLightboxContent(currentImageIndex);
    if (lightbox) {
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeLightbox = () => {
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  const nextImage = () => {
    if (currentGalleryList.length === 0) return;
    const nextIdx = (currentImageIndex + 1) % currentGalleryList.length;
    updateLightboxContent(nextIdx);
  };

  const prevImage = () => {
    if (currentGalleryList.length === 0) return;
    const prevIdx = (currentImageIndex - 1 + currentGalleryList.length) % currentGalleryList.length;
    updateLightboxContent(prevIdx);
  };

  // Attach Lightbox triggers
  const allClickableImages = document.querySelectorAll('.masonry-item, .gallery-preview-item');
  allClickableImages.forEach((item, index) => {
    item.addEventListener('click', () => {
      openLightbox(allClickableImages, index);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', nextImage);
  if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  });

  // Touch swipe support for lightbox (mobile)
  if (lightbox) {
    let touchStartX = 0;
    let touchStartY = 0;

    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
      const deltaX = e.changedTouches[0].screenX - touchStartX;
      const deltaY = e.changedTouches[0].screenY - touchStartY;
      // Only trigger swipe if horizontal movement > 50px and more horizontal than vertical
      if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX < 0) nextImage();
        else prevImage();
      }
    }, { passive: true });
  }

  /* ------------------------------------------------------------------------
     5. MENU FILTERING & SMOOTH TAB NAVIGATION
     ------------------------------------------------------------------------ */
  const menuTabs = document.querySelectorAll('.menu-tab-btn');
  const menuCategories = document.querySelectorAll('.menu-category-section');

  if (menuTabs.length > 0) {
    menuTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        menuTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const category = tab.getAttribute('data-category');
        if (category === 'all') {
          menuCategories.forEach(cat => cat.style.display = 'block');
        } else {
          menuCategories.forEach(cat => {
            if (cat.id === category) {
              cat.style.display = 'block';
              // Smooth scroll into view
              const yOffset = -140;
              const y = cat.getBoundingClientRect().top + window.pageYOffset + yOffset;
              window.scrollTo({ top: y, behavior: 'smooth' });
            } else {
              cat.style.display = 'none';
            }
          });
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
     6. CONTACT & TABLE INQUIRY FORM VALIDATION & INTERACTION
     ------------------------------------------------------------------------ */
  const contactForm = document.getElementById('restaurant-inquiry-form');
  const toastNotification = document.getElementById('form-toast');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      // Inputs
      const nameInput = document.getElementById('inquiry-name');
      const phoneInput = document.getElementById('inquiry-phone');
      const guestsInput = document.getElementById('inquiry-guests');
      const preferenceInput = document.getElementById('inquiry-preference');
      const messageInput = document.getElementById('inquiry-message');

      // Clear previous error states
      contactForm.querySelectorAll('.form-group').forEach(fg => fg.classList.remove('has-error'));

      // Validate Name
      if (!nameInput || nameInput.value.trim().length < 2) {
        showError(nameInput, 'Please provide your full name.');
        isValid = false;
      }

      // Validate Phone (Indian 10-digit number format)
      const phoneVal = phoneInput ? phoneInput.value.trim().replace(/\D/g, '') : '';
      if (phoneVal.length < 10) {
        showError(phoneInput, 'Please enter a valid 10-digit mobile number.');
        isValid = false;
      }

      if (!isValid) return;

      // Success feedback
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Send Inquiry';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Submitting...</span>';
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }

        // Show Toast Notification
        if (toastNotification) {
          toastNotification.classList.add('active');
          setTimeout(() => {
            toastNotification.classList.remove('active');
          }, 6000);
        }

        // Generate WhatsApp link for instant direct message to 9975812323
        const guestCount = guestsInput ? guestsInput.value : '2-4';
        const seating = preferenceInput ? preferenceInput.value : 'Water Dining / Gazebo';
        const msg = messageInput ? messageInput.value.trim() : 'Looking forward to dining with family.';
        
        const whatsappText = encodeURIComponent(
          `Hello AL-RG Food Paradise! I would like to inquire about visiting:\n` +
          `Name: ${nameInput.value.trim()}\n` +
          `Phone: ${phoneVal}\n` +
          `Guests: ${guestCount}\n` +
          `Seating: ${seating}\n` +
          `Message: ${msg}`
        );

        // Update WhatsApp action link if exists in toast
        const whatsappActionBtn = document.getElementById('toast-whatsapp-btn');
        if (whatsappActionBtn) {
          whatsappActionBtn.href = `https://wa.me/919975812323?text=${whatsappText}`;
        }

        contactForm.reset();
      }, 700);
    });

    function showError(inputEl, message) {
      if (!inputEl) return;
      const group = inputEl.closest('.form-group');
      if (group) {
        group.classList.add('has-error');
        const feedback = group.querySelector('.form-feedback');
        if (feedback) feedback.textContent = message;
      }
    }
  }

});
