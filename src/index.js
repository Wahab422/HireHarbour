/* eslint-disable @typescript-eslint/no-unused-vars */
import barba from '@barba/core';
import barbaPrefetch from '@barba/prefetch';
import { restartWebflow } from '@finsweet/ts-utils';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
barba.use(barbaPrefetch);
gsap.registerPlugin(ScrollTrigger);
gsap.config({
  nullTargetWarn: false,
});
gsap.defaults({
  ease: 'power3.out',
});
let lenis;
// handle Global Code
function handleGlobalCode() {
  // Mirror Click
  let mirrorTriggerBtns = document.querySelectorAll('[mirrorTriggerBtn]');
  if (mirrorTriggerBtns.length > 0) {
    mirrorTriggerBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        let targetElement = document.querySelector(btn.getAttribute('mirrorTriggerBtn'));
        targetElement.click();
      });
    });
  }
}
// handle CTA popup
function handleCTAPopup() {
  let popupTrigger = document.querySelector('[popup-trigger="options"]');
  if (!popupTrigger) return;
  let optionComponents = document.querySelectorAll('[option-component]');
  let ctaText = document.querySelector('[cta-text]');

  popupTrigger.addEventListener('click', function () {
    optionComponents.forEach((option) => option.classList.remove('active'));

    let randomIndex = Math.floor(Math.random() * optionComponents.length);
    optionComponents[randomIndex].classList.add('active');

    setTimeout(() => {
      ctaText.textContent = 'Did you make a mistake';
    }, 2000);
  });
}

// handle Popup
function handlePopup() {
  let popupTriggers = document.querySelectorAll('[popup-trigger]');
  if (popupTriggers.length < 1) return;
  let popupElements = document.querySelectorAll('[popup-element]');
  let popupCloseBtns = document.querySelectorAll('[popup-close-btn]');

  popupTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      let triggerValue = trigger.getAttribute('popup-trigger');
      let correspondingPopup = document.querySelector(`[popup-element="${triggerValue}"]`);

      if (correspondingPopup) {
        correspondingPopup.classList.add('active');
        document.body.classList.add('stop-scroll');
      }
    });
  });

  popupCloseBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      popupElements.forEach((popupElement) => {
        popupElement.classList.remove('active');
        document.body.classList.remove('stop-scroll');
      });
    });
  });
}
function loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.onload = resolve;
    script.onerror = reject;
    document.querySelector('[data-barba="container"]').appendChild(script);
  });
}
function initializeScript() {
  loadScript('https://cdn.jsdelivr.net/npm/@finsweet/attributes-cmsfilter@1/cmsfilter.js');
  loadScript('https://cdn.jsdelivr.net/npm/@finsweet/attributes-cmsload@1/cmsload.js');
}
// pricing table component
function handlePricingTable() {
  let pricingComponent = document.querySelector('[pricing-component]');
  if (!pricingComponent) return;
  let currencyBtns = pricingComponent.querySelectorAll('[currency-option]');
  let planTypeBtns = pricingComponent.querySelectorAll('[planType-option]');
  const plans = Object.keys(pricingData.monthly);

  const updatePrices = (type) => {
    const activeCurrency = pricingComponent.querySelector('[currency-option].active');
    const currencyValue = activeCurrency ? activeCurrency.getAttribute('currency-option') : 'gbp';
    plans.forEach((plan) => {
      pricingComponent.querySelector(`[${plan}price]`).innerText = getPrice(
        plan,
        currencyValue,
        type
      );
      updateBillingText(type);
    });
  };

  const getPrice = (plan, currency, type) => {
    // const key = type === 'monthly' ? 'monthly' : 'annually';
    const price = pricingData[type][plan][currency];
    return currency === 'inr'
      ? `${pricingData.currency[currency]}${price.toLocaleString('en-IN')}`
      : `${pricingData.currency[currency]}${price}`;
  };

  const updateBillingText = (type) => {
    let planPeriodTexts = Array.from(pricingComponent.querySelectorAll('[plan-period]'));
    planPeriodTexts.forEach((text) => (text.style.display = 'none'));
    let selectedPeriod = planPeriodTexts.filter((item) => {
      return item.getAttribute('plan-period') == type;
    });
    selectedPeriod.forEach((item) => (item.style.display = 'block'));
  };

  planTypeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      planTypeBtns.forEach((btn) => btn.classList.remove('active'));
      btn.classList.add('active');
      let selectedPlanType = btn.getAttribute('planType-option');
      updatePrices(selectedPlanType);
    });
  });

  currencyBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      currencyBtns.forEach((btn) => btn.classList.remove('active'));
      btn.classList.add('active');
      updatePrices(
        pricingComponent.querySelector('[planType-option].active').getAttribute('planType-option')
      );
    });
  });
  // Initial update
  updatePrices(
    pricingComponent.querySelector('[planType-option].active').getAttribute('planType-option')
  );
}

// handle Swiper Slider
function handleSwiper() {
  if (!document.querySelector('.swiper')) return;
  loadScript('https://cdnjs.cloudflare.com/ajax/libs/Swiper/11.0.5/swiper-bundle.min.js')
    .then(() => {
      // Cards Slider
      if (document.querySelector('[cards-slider-section] .cards-swiper')) {
        new Swiper('[cards-slider-section] .cards-swiper', {
          effect: 'cards',
          grabCursor: true,
          navigation: {
            nextEl: '[cards-slider-section] [swiper-next-btn]',
            prevEl: '[cards-slider-section] [swiper-prev-btn]',
          },
          pagination: {
            el: '[cards-slider-section] [swiper-progress-bar]',
            type: 'progressbar',
          },
        });
      }

      // Testimonial Slider
      if (document.querySelector('[testimonial-section] .swiper.testimonials')) {
        new Swiper('[testimonial-section] .swiper.testimonials', {
          slidesPerView: 'auto',
          spaceBetween: 32,
          grabCursor: true,
          pagination: {
            el: '[testimonial-section] [swiper-progress-bar]',
            type: 'progressbar',
          },
          breakpoints: {
            // when window width is >= 320px
            320: {
              spaceBetween: 10,
            },
            // when window width is >= 480px
            767: {
              spaceBetween: 12,
            },
            // when window width is >= 640px
            992: {
              spaceBetween: 20,
            },
          },
        });
      }
      //
      if (document.querySelector('[section-hiring-process] .swiper.hiring-process')) {
        // Hiring Process Slider
        new Swiper('[section-hiring-process] .swiper.hiring-process', {
          slidesPerView: 'auto',
          spaceBetween: 32,
          grabCursor: true,
          navigation: {
            nextEl: '[section-hiring-process] [swiper-next-btn]',
            prevEl: '[section-hiring-process] [swiper-prev-btn]',
          },
          pagination: {
            el: '[section-hiring-process] [swiper-progress-bar]',
            type: 'progressbar',
          },
          breakpoints: {
            320: {
              spaceBetween: 10,
            },
            767: {
              spaceBetween: 12,
            },
            992: {
              spaceBetween: 20,
            },
          },
        });
      }
    })
    .catch((error) => {
      console.error('Error loading Swiper:', error);
    });
}
// Clients Logo
handleLogos();
function handleLogos() {
  let timeout;
  let lastCol;

  const clients = document.querySelector('.clients');
  if (!clients) return;

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  let cols = document.querySelectorAll('.clients .w-dyn-list');

  function getRandomCol() {
    let colsList = Array.from(cols);

    if (lastCol) {
      colsList = colsList.filter((col) => col !== lastCol);
    }

    let randomIndex = getRandomInt(0, colsList.length - 1);
    return colsList[randomIndex];
  }

  cols.forEach((col) => {
    let firstLogoItem = col.querySelector('.w-dyn-item');
    firstLogoItem.querySelector('a').classList.add('in');
  });

  function animateLogo(col) {
    clearTimeout(timeout);

    let logoItems = Array.from(col.querySelectorAll('.w-dyn-item'));
    let currentLogoItem = col.querySelector('.in').parentElement;

    let prevLogoItem, nextLogoItem;

    if (currentLogoItem) {
      prevLogoItem = currentLogoItem.previousElementSibling || logoItems[logoItems.length - 1];
      nextLogoItem = currentLogoItem.nextElementSibling || logoItems[0];

      prevLogoItem.querySelector('a').classList.remove('out');
      currentLogoItem.querySelector('a').classList.remove('in');
      currentLogoItem.querySelector('a').classList.add('out');
      nextLogoItem.querySelector('a').classList.add('in');
    } else {
      logoItems[0].querySelector('a').classList.add('in');
    }

    lastCol = col;

    timeout = setTimeout(() => {
      animateLogo(getRandomCol());
    }, 3000);
  }

  function handleVisibility() {
    if (document.hidden) {
      clearTimeout(timeout);
    } else {
      animateLogo(getRandomCol());
    }
  }

  document.addEventListener('visibilitychange', handleVisibility);
  setTimeout(() => {
    animateLogo(getRandomCol());
  }, 3000);
}
// Accordion

function handleAccordion() {
  let accordions = document.querySelectorAll('.accordion');
  if (accordions.length < 1) return;
  accordions.forEach((accordion) => {
    let accordionHead = accordion.querySelector('.accordion-head');
    accordionHead.addEventListener('click', () => {
      if (accordion.classList.contains('active')) {
        accordion.classList.remove('active');
      } else {
        accordions.forEach((element) => element.classList.remove('active'));
        accordion.classList.add('active');
      }
    });
    let accordionBody = accordion.querySelector('.accordion-body');
    let accordionBodyHeight = accordionBody.clientHeight;
    accordion.style.setProperty('--body-height', accordionBodyHeight + 'px');
    accordionBody.style.height = '0px';
  });
}
// handle Navbar Menu
function handleMenu() {
  // Navbar
  let menuBtn = document.querySelector('.menu-button');
  let nav = document.querySelector('.nav');
  menuBtn.addEventListener('click', function () {
    nav.classList.toggle('open');
  });
  // Navbar Color change on Dark Sections
  handleNavColor();
  function handleNavColor() {
    let sections = gsap.utils.toArray('section');
    let nav = document.querySelector('.nav');

    function changeNavColor(sec) {
      if (sec.hasAttribute('dark-section')) {
        nav.setAttribute('navbar-dark', '1');
      } else {
        nav.setAttribute('navbar-dark', '0');
      }
    }
    sections.forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        markers: false,
        start: 'top 40',
        end: 'bottom 40',
        onEnter: () => changeNavColor(section),
        onEnterBack: () => changeNavColor(section),
      });
    });
  }
}
// Scroll smooth
function handleScroll() {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    smoothTouch: false,
    touchMultiplier: 2,
    wheelMultiplier: 1,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
}
function resizeLenis() {
  window.addEventListener('load', () => {
    setTimeout(() => {
      lenis.resize();
      ScrollTrigger.refresh();
    }, 500);
  });
  document.addEventListener('click', () => {
    setTimeout(() => {
      lenis.resize();
      ScrollTrigger.refresh();
    }, 500);
  });
}

// Barba
function handleBarba() {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  // Animations
  const animationEnter = (container) => {
    return gsap
      .from(container, { duration: 0.6, opacity: 0, ease: 'none', clearProps: 'all' })
      .then(() => {
        lenis.destroy();
        handleScroll();
        ScrollTrigger.refresh();
      });
  };

  const animationLeave = (container) => {
    return gsap.to(container, {
      opacity: 0,
      duration: 0.6,
      ease: 'none',
      clearProps: 'all',
    });
  };

  // Initialization
  barba.init({
    transitions: [
      {
        name: 'default-transition',
        async leave(data) {
          await animationLeave(data.current.container);
        },
        enter(data) {
          animationEnter(data.next.container);
        },
        once(data) {
          gsap.to('body', { duration: 0.6, opacity: 1, ease: 'none' });
          animationEnter(data.next.container);
        },
      },
    ],
  });

  // Hooks
  barba.hooks.before(() => {
    html.classList.add('is-transitioning');
  });
  barba.hooks.enter(async () => {
    await restartWebflow();
  });
  barba.hooks.afterLeave(() => {
    html.classList.remove('ready');
  });

  barba.hooks.after(() => {
    window.scrollTo(0, 0);
    init();
    html.classList.remove('is-transitioning');
    html.classList.add('ready');
    lenis.start();
  });
}

function init() {
  initializeScript();
  handleMenu();
  handleSwiper();
  handleAccordion();
  handlePricingTable();
  handlePopup();
  handleCTAPopup();
  handleGlobalCode();
}

// Loading
document.addEventListener('DOMContentLoaded', () => {
  if (Webflow.env('editor') === undefined) {
    handleBarba();
    handleScroll();
  } else {
    gsap.to('body', { duration: 0.6, opacity: 1, ease: 'none' });
  }
  init();
});
