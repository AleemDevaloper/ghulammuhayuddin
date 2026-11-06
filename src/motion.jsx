import { useEffect, useRef, useState } from 'react';
import { ReactLenis, useLenis } from 'lenis/react';
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion';
import { ArrowUp } from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1];

export function SmoothScroll({ children }) {
  const reduce = useReducedMotion();
  if (reduce) return children;
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.085,
        duration: 1.25,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.4,
        anchors: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}

export function SplitWords({
  text,
  className = '',
  wordClassName,
  delay = 0,
  stagger = 0.055,
  as: Tag = 'span',
}) {
  const reduce = useReducedMotion();
  const words = text.split(' ');
  const wordClass = (word, index) => (wordClassName ? ` ${wordClassName(word, index)}` : '');
  if (reduce) {
    return (
      <Tag className={`split-words ${className}`}>
        {words.map((word, index) => (
          <span key={`${word}-${index}`}>
            <span className={`split-word${wordClass(word, index)}`}>{word}</span>
            {index < words.length - 1 ? ' ' : null}
          </span>
        ))}
      </Tag>
    );
  }
  return (
    <Tag className={`split-words ${className}`} aria-label={text}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`}>
          <span className="split-word" aria-hidden="true">
            <motion.span
              className={wordClassName ? wordClassName(word, index) : undefined}
              initial={{ y: '115%', rotate: 3 }}
              animate={{ y: '0%', rotate: 0 }}
              transition={{ duration: 0.95, ease: EASE, delay: delay + index * stagger }}
            >
              {word}
            </motion.span>
          </span>
          {index < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </Tag>
  );
}

export function Tilt({ children, className = '', max = 5 }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();

  const handleMove = event => {
    if (reduce || event.pointerType !== 'mouse') return;
    const element = ref.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    element.style.setProperty('--tilt-ry', `${(px - 0.5) * max * 2}deg`);
    element.style.setProperty('--tilt-rx', `${(0.5 - py) * max * 2}deg`);
    element.style.setProperty('--tilt-mx', `${px * 100}%`);
    element.style.setProperty('--tilt-my', `${py * 100}%`);
  };

  const handleLeave = () => {
    const element = ref.current;
    if (!element) return;
    element.style.setProperty('--tilt-ry', '0deg');
    element.style.setProperty('--tilt-rx', '0deg');
  };

  return (
    <div
      ref={ref}
      className={`tilt ${className}`}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {children}
    </div>
  );
}

export function Counter({ value, pad = 2, suffix = '', duration = 1.6, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px' });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    if (reduce) {
      setDisplay(value);
      return undefined;
    }
    let frame = 0;
    let start = 0;
    const step = now => {
      if (!start) start = now;
      const progress = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduce, value, duration]);

  return (
    <span ref={ref} className={className}>
      {String(display).padStart(pad, '0')}
      {suffix}
    </span>
  );
}

export function IntroLoader() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState(() => {
    if (typeof window === 'undefined') return 'done';
    if (reduce) return 'done';
    try {
      return sessionStorage.getItem('gm-intro') === '1' ? 'done' : 'loading';
    } catch {
      return 'loading';
    }
  });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (phase !== 'loading') return undefined;
    document.documentElement.classList.add('is-loading');
    let frame = 0;
    let timer = 0;
    let start = 0;
    const duration = 1500;
    const tick = now => {
      if (!start) start = now;
      const progress = Math.min((now - start) / duration, 1);
      setCount(Math.round(progress * 100));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        timer = window.setTimeout(() => {
          try {
            sessionStorage.setItem('gm-intro', '1');
          } catch {
            /* ignore */
          }
          setPhase('exiting');
        }, 240);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== 'exiting') return undefined;
    const timer = window.setTimeout(() => {
      document.documentElement.classList.remove('is-loading');
      setPhase('done');
    }, 900);
    return () => window.clearTimeout(timer);
  }, [phase]);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          className="intro-loader"
          initial={{ opacity: 1 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.85, ease: EASE }}
        >
          <div className="intro-loader-top">
            <span className="intro-brand">G<span>.</span></span>
            <span className="intro-meta">PORTFOLIO / 2026</span>
          </div>
          <div className="intro-loader-center">
            <motion.span
              className="intro-word"
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              GHULLAM
            </motion.span>
            <motion.span
              className="intro-word intro-word-alt"
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            >
              MUHAYYUDIN
            </motion.span>
          </div>
          <div className="intro-loader-bottom">
            <span className="intro-count">{String(count).padStart(3, '0')}</span>
            <span className="intro-bar"><i style={{ width: `${count}%` }} /></span>
            <span className="intro-label">LOADING EXPERIENCE</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function CustomCursor() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);
  const [label, setLabel] = useState('');
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const dotX = useSpring(x, { stiffness: 900, damping: 45, mass: 0.2 });
  const dotY = useSpring(y, { stiffness: 900, damping: 45, mass: 0.2 });
  const ringX = useSpring(x, { stiffness: 170, damping: 22, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 170, damping: 22, mass: 0.6 });

  useEffect(() => {
    if (reduce) return undefined;
    if (!window.matchMedia('(pointer: fine)').matches) return undefined;
    setEnabled(true);
    document.documentElement.classList.add('cursor-enabled');

    const move = event => {
      x.set(event.clientX);
      y.set(event.clientY);
    };
    const over = event => {
      const target = event.target.closest?.('a, button, [data-cursor], label, .tilt, .interactive');
      if (!target) {
        setActive(false);
        setLabel('');
        return;
      }
      setActive(true);
      setLabel(target.getAttribute('data-cursor') || '');
    };
    const leave = () => {
      setActive(false);
      setLabel('');
    };

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerover', over, { passive: true });
    window.addEventListener('pointerdown', leave, { passive: true });
    window.addEventListener('pointerup', over, { passive: true });

    return () => {
      document.documentElement.classList.remove('cursor-enabled');
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerover', over);
      window.removeEventListener('pointerdown', leave);
      window.removeEventListener('pointerup', over);
    };
  }, [reduce, x, y]);

  if (!enabled) return null;

  return (
    <div className="custom-cursor" aria-hidden="true">
      <motion.span
        className={`cursor-dot ${active ? 'is-active' : ''}`}
        style={{ x: dotX, y: dotY }}
      />
      <motion.span
        className={`cursor-ring ${active ? 'is-active' : ''}`}
        style={{ x: ringX, y: ringY }}
      />
      <AnimatePresence>
        {label && (
          <motion.span
            className="cursor-label"
            style={{ x: ringX, y: ringY }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.18 }}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

export function useMarqueeVelocity(ref) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    let last = window.scrollY;
    let frame = 0;
    let current = 34;
    const update = () => {
      frame = 0;
      const delta = window.scrollY - last;
      last = window.scrollY;
      const speed = Math.min(Math.abs(delta) * 0.35, 22);
      const target = 36 - speed;
      current += (target - current) * 0.2;
      element.style.setProperty('--marquee-duration', `${current.toFixed(2)}s`);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ref]);
}

export function ScrollRail() {
  const lenis = useLenis();
  const reduce = useReducedMotion();
  const trackRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  const maxScroll = () => Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);

  const scrollToY = (value, smooth = false) => {
    const target = Math.max(0, Math.min(value, maxScroll()));
    if (lenis) {
      lenis.scrollTo(target, smooth ? { duration: 1.1 } : { immediate: true });
      return;
    }
    window.scrollTo({ top: target, behavior: smooth ? 'smooth' : 'auto' });
  };

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = maxScroll();
      const ratio = Math.min(Math.max(window.scrollY / max, 0), 1);
      setProgress(ratio);
      setVisible(window.scrollY > 110 && max > 240);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const updateFromPointer = clientY => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const ratio = Math.min(Math.max((clientY - rect.top) / rect.height, 0), 1);
    scrollToY(ratio * maxScroll());
  };

  const handlePointerDown = event => {
    if (event.button !== 0) return;
    event.preventDefault();
    updateFromPointer(event.clientY);
    const move = ev => updateFromPointer(ev.clientY);
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  const handleKeyDown = event => {
    const step = window.innerHeight * 0.85;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      scrollToY(window.scrollY + 120);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      scrollToY(window.scrollY - 120);
    } else if (event.key === 'PageDown') {
      event.preventDefault();
      scrollToY(window.scrollY + step);
    } else if (event.key === 'PageUp') {
      event.preventDefault();
      scrollToY(window.scrollY - step);
    } else if (event.key === 'Home') {
      event.preventDefault();
      scrollToY(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      scrollToY(maxScroll());
    }
  };

  const percent = Math.round(progress * 100);

  return (
    <aside className={`scroll-rail ${visible ? 'is-visible' : ''}`} aria-label="Page scroll progress">
      <span className="rail-label">SCROLL</span>
      <span className="rail-percent">{String(percent).padStart(2, '0')}</span>
      <div
        ref={trackRef}
        className="rail-track"
        role="scrollbar"
        tabIndex={0}
        aria-controls="main-content"
        aria-orientation="vertical"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label="Scroll page"
        onPointerDown={handlePointerDown}
        onKeyDown={handleKeyDown}
      >
        <span className="rail-fill" style={{ height: `${progress * 100}%` }} />
        <span className="rail-thumb" style={{ top: `${progress * 100}%` }} />
      </div>
      <button type="button" className="rail-top" onClick={() => scrollToY(0, !reduce)} aria-label="Scroll to top">
        <ArrowUp size={14} />
      </button>
    </aside>
  );
}
