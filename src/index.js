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

// Clients Logos
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
handleAccordion();
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
    // Navbar Scroll Down/Up
    let prevScrollPos = window.pageYOffset;

    window.addEventListener('scroll', function () {
        let currentScrollPos = window.pageYOffset;
        var navElement = document.querySelector('.nav');

        if (currentScrollPos > window.innerHeight * 0.3) {
            navElement.classList.add('scrolled');
        } else {
            navElement.classList.remove('scrolled');
        }

        if (prevScrollPos > currentScrollPos) {
            navElement.classList.remove('scroll-down');
        } else {
            navElement.classList.add('scroll-down');
        }

        prevScrollPos = currentScrollPos;
    });
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
    handleMenu();
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
