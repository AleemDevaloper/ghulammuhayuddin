import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import { SiteLayout, ScrollReset } from './Layout';
import {
  ContactPage, ContentPage, HomePage, NotFound, ProjectDetailPage, ProjectsPage,
} from './Pages';
import { pageContent } from './data';
import { SmoothScroll } from './motion';

const serviceSlugs = [
  'web-development', 'ai-automation', 'ai-agents-llm-solutions',
  'software-development', 'mobile-app-development', 'business-software',
  'erp-development', 'crm-development', 'hrms-development',
  'custom-business-systems',
];

function AppRoutes({ location }) {
  const reduceMotion = useReducedMotion();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
        transition={{ duration: reduceMotion ? 0.01 : 0.32, ease: [0.22, 1, 0.36, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<ContentPage slug="about" />} />
          <Route path="/services" element={<ContentPage slug="services" />} />
          {Object.keys(pageContent).filter(slug => serviceSlugs.includes(slug)).map(slug => (
            <Route key={slug} path={`/services/${slug}`} element={<ContentPage slug={slug} />} />
          ))}
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:slug" element={<ProjectDetailPage />} />
          <Route path="/skills" element={<ContentPage slug="skills" />} />
          <Route path="/experience" element={<ContentPage slug="experience" />} />
          <Route path="/process" element={<ContentPage slug="process" />} />
          <Route path="/testimonials" element={<ContentPage slug="testimonials" />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/lets-work-together" element={<ContactPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function PortfolioApp() {
  const [theme, setTheme] = useState(() => (
    document.documentElement.dataset.theme
    || localStorage.getItem('portfolio-theme')
    || 'dark'
  ));
  const location = useLocation();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('portfolio-theme', theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#f4f5f1' : '#07080b');
  }, [theme]);

  useEffect(() => {
    let frame = 0;
    const updateProgress = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      document.documentElement.style.setProperty('--scroll-progress', `${progress * 100}%`);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(updateProgress);
    };
    updateProgress();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return undefined;
    let frame = 0;
    let pending = null;
    const flush = () => {
      frame = 0;
      if (!pending) return;
      const { card, x, y } = pending;
      pending = null;
      if (!card.isConnected) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--spot-x', `${x - rect.left}px`);
      card.style.setProperty('--spot-y', `${y - rect.top}px`);
    };
    const onPointerMove = event => {
      const card = event.target.closest?.('.spotlight');
      if (!card) return;
      pending = { card, x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(flush);
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const targets = document.querySelectorAll('.reveal:not(.is-visible)');
    if (!('IntersectionObserver' in window)) {
      targets.forEach(target => target.classList.add('is-visible'));
      return undefined;
    }
    const bound = new WeakSet();
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });

    const observe = element => {
      if (bound.has(element) || element.classList.contains('is-visible')) return;
      bound.add(element);
      observer.observe(element);
    };
    const scan = root => {
      if (!root.querySelectorAll) return;
      root.querySelectorAll('.reveal:not(.is-visible)').forEach(observe);
    };

    scan(document);
    const mutations = new MutationObserver(records => {
      records.forEach(record => {
        record.addedNodes.forEach(node => {
          if (node.nodeType !== Node.ELEMENT_NODE) return;
          if (node.matches?.('.reveal:not(.is-visible)')) observe(node);
          scan(node);
        });
      });
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const syncVisibility = () => root.classList.toggle('is-document-hidden', document.hidden);
    syncVisibility();
    document.addEventListener('visibilitychange', syncVisibility);

    const selector = '.hero-art, .hero-aurora, .contact-orb, .footer-orbit, .tech-marquee';
    let observer;
    let mutations;
    if ('IntersectionObserver' in window) {
      const bound = new WeakSet();
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          entry.target.classList.toggle('is-offscreen', !entry.isIntersecting);
        });
      }, { threshold: 0 });
      const observeAll = () => {
        document.querySelectorAll(selector).forEach(element => {
          if (bound.has(element)) return;
          bound.add(element);
          observer.observe(element);
        });
      };
      observeAll();
      mutations = new MutationObserver(observeAll);
      mutations.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      document.removeEventListener('visibilitychange', syncVisibility);
      root.classList.remove('is-document-hidden');
      if (observer) observer.disconnect();
      if (mutations) mutations.disconnect();
    };
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll>
        <ScrollReset />
        <SiteLayout theme={theme} setTheme={setTheme}>
          <AppRoutes location={location} />
        </SiteLayout>
        <Analytics route={location.pathname} path={`${location.pathname}${location.search}`} />
      </SmoothScroll>
    </MotionConfig>
  );
}

export default function App() {
  return <BrowserRouter><PortfolioApp /></BrowserRouter>;
}
