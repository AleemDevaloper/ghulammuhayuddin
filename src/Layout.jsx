import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLenis } from 'lenis/react';
import {
  ArrowDown, ArrowRight, ArrowUpRight, Bot, BriefcaseBusiness, Check,
  Code2, Layers3, Menu, MessageCircle, Moon, Orbit, Send, Sparkles, Sun, X, Smartphone,
} from 'lucide-react';
import { profile, projects, services, skillGroups, systems } from './data';
import {
  CustomCursor, IntroLoader, ScrollRail, useMarqueeVelocity,
} from './motion';

const iconMap = {
  web: Code2,
  spark: Sparkles,
  layers: Layers3,
  phone: Smartphone,
  code: BriefcaseBusiness,
  orbit: Orbit,
};

export function IconFor({ name, ...props }) {
  const Icon = iconMap[name] || Sparkles;
  return <Icon size={22} strokeWidth={1.6} {...props} />;
}

function setMeta(selector, attribute, value) {
  const element = document.querySelector(selector);
  if (element) element.setAttribute(attribute, value);
}

export function PageMeta({ title, description }) {
  useEffect(() => {
    const pageTitle = `${title} — ${profile.name}`;
    const url = `${window.location.origin}${window.location.pathname}`;
    document.title = pageTitle;
    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[property="og:title"]', 'content', pageTitle);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:url"]', 'content', url);
    setMeta('meta[name="twitter:title"]', 'content', pageTitle);
    setMeta('meta[name="twitter:description"]', 'content', description);
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }, [title, description]);
  return null;
}

export function ScrollReset() {
  const { pathname } = useLocation();
  const lenis = useLenis();
  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [pathname, lenis]);
  return null;
}

export function SiteLayout({ children, theme, setTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const menuRef = useRef(null);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const updateScroll = () => setScrolled(window.scrollY > 24);
    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });
    return () => window.removeEventListener('scroll', updateScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const menu = menuRef.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const getFocusable = () => Array.from(
      menu?.querySelectorAll('a[href], button:not([disabled])') || [],
    ).filter(element => element.offsetParent !== null);
    getFocusable()[0]?.focus();
    const onKeyDown = event => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        return;
      }
      if (event.key !== 'Tab') return;
      const items = getFocusable();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, [menuOpen]);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)');
    const handleChange = () => {
      if (media.matches) setMenuOpen(false);
    };
    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, []);

  return (
    <div className="site-shell">
      <IntroLoader />
      <CustomCursor />
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="container header-inner">
          <Link className="brand-lockup" to="/" aria-label={`${profile.name}, home`} data-cursor="Home">
            <span className="brand-mark">G<span>.</span></span>
            <span className="brand-name">{profile.name}<small>INDEPENDENT DEVELOPER</small></span>
          </Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            {[['About', '/about'], ['Services', '/services'], ['Projects', '/projects'], ['Skills', '/skills'], ['Experience', '/experience'], ['Process', '/process']].map(([label, path]) => (
              <NavLink key={path} to={path} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                {({ isActive }) => (
                  <>
                    {isActive && <motion.span layoutId="nav-pill" className="nav-pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                    <span className="nav-label">{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
          <div className="header-actions">
            <button className="theme-toggle" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} aria-pressed={theme === 'light'}>
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <Link to="/contact" className="button button-small button-accent header-cta" data-cursor="Say hi">Let’s talk <ArrowUpRight size={15} /></Link>
            <button className="menu-toggle" onClick={() => setMenuOpen(open => !open)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="mobile-menu">
              {menuOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>
        <div className={`menu-scrim ${menuOpen ? 'open' : ''}`} aria-hidden="true" onClick={() => setMenuOpen(false)} />
        <div id="mobile-menu" ref={menuRef} className={`mobile-menu ${menuOpen ? 'open' : ''}`} inert={!menuOpen}>
          <div className="mobile-menu-inner">
            <nav aria-label="Mobile navigation">
              {[['Home', '/'], ['About', '/about'], ['Services', '/services'], ['Projects', '/projects'], ['Skills', '/skills'], ['Experience', '/experience'], ['Process', '/process'], ['Contact', '/contact']].map(([label, path], index) => (
                <NavLink key={path} to={path} style={{ '--i': index }}>
                  <span className="mobile-menu-no">0{index + 1}</span>
                  <span>{label}</span>
                  <ArrowUpRight size={20} />
                </NavLink>
              ))}
            </nav>
            <div className="mobile-menu-foot">
              <span className="mobile-menu-note">Thoughtful software. Built together.</span>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
              <a href={profile.phoneLink}>{profile.phone}</a>
              <div className="mobile-menu-socials">
                <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
                <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
                <a href={profile.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="scroll-progress" aria-hidden="true" />
      <ScrollRail />
      <main id="main-content">{children}</main>
      <Footer />
      <PortfolioAssistant />
    </div>
  );
}

function assistantReply(question) {
  const q = question.toLowerCase();
  if (/\b(hi|hello|hey|good morning|good afternoon)\b/.test(q)) {
    return `Hi! I’m the portfolio guide. Ask me about ${profile.name}’s services, projects, technologies, or process.`;
  }
  if (/service|capabilit/.test(q)) {
    return `Services include ${services.map(service => service.title).join(', ')}. Each can be shaped around your goals and existing workflows.`;
  }
  if (/project|portfolio|demo|concept/.test(q)) {
    const examples = projects.slice(0, 3).map(project => `${project.name} (${project.category})`).join(', ');
    return `The portfolio includes clearly labeled product concepts such as ${examples}. They demonstrate possible product directions—not claimed client work.`;
  }
  const matchingSystem = systems.find(([name]) => new RegExp(`\\b${name.toLowerCase()}\\b`).test(q));
  if (matchingSystem) return `${matchingSystem[0]}: ${matchingSystem[1]} Explore the ${matchingSystem[0]} development page for more details.`;
  if (/skill|technology|tech stack|tools|react|node|database/.test(q)) {
    const groups = skillGroups.map(group => `${group.title}: ${group.items.slice(0, 4).join(', ')}`).join(' · ');
    return `The toolkit spans ${groups}. Technology choices are tailored to each project.`;
  }
  const matchingService = services.find(service => {
    const words = `${service.title} ${service.slug} ${service.tags.join(' ')}`.toLowerCase().split(/[\s&/-]+/);
    return words.some(word => word.length > 3 && q.includes(word));
  });
  if (matchingService) {
    return `${matchingService.title}: ${matchingService.summary} It can include ${matchingService.details.join(', ').toLowerCase()}.`;
  }
  if (/contact|hire|talk|email|start a project/.test(q)) {
    return `The best next step is the contact page. It has a project enquiry form and direct contact options: ${profile.email}.`;
  }
  if (/process|how.*work|approach/.test(q)) {
    return 'The process is collaborative: discover the goal, shape the experience and technical plan, build in reviewable steps, refine through testing, then launch and improve.';
  }
  return `I can help with questions about web development, AI and automation, business systems, mobile apps, software engineering, project concepts, and technologies. What would you like to explore?`;
}

function PortfolioAssistant() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: `Hi! I can help you explore ${profile.name}’s services, project concepts, and technology toolkit.` },
  ]);
  const inputRef = useRef(null);
  const messagesRef = useRef(null);
  const panelRef = useRef(null);
  const replyTimer = useRef(null);
  const previousFocus = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    previousFocus.current = document.activeElement;
    inputRef.current?.focus();
    const onKeyDown = event => {
      if (event.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = Array.from(
        panelRef.current?.querySelectorAll('a[href], button:not([disabled]), input:not([disabled])') || [],
      ).filter(element => element.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      if (previousFocus.current instanceof HTMLElement) previousFocus.current.focus();
    };
  }, [open]);

  useEffect(() => {
    const node = messagesRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages, typing, open]);

  useEffect(() => () => {
    if (replyTimer.current) window.clearTimeout(replyTimer.current);
  }, []);

  const ask = event => {
    event.preventDefault();
    const prompt = question.trim();
    if (!prompt || typing) return;
    const reply = assistantReply(prompt);
    setMessages(current => [...current, { role: 'user', text: prompt }]);
    setQuestion('');
    setTyping(true);
    replyTimer.current = window.setTimeout(() => {
      setMessages(current => [...current, { role: 'assistant', text: reply }]);
      setTyping(false);
    }, 420);
  };

  const choosePrompt = prompt => {
    setQuestion(prompt);
    inputRef.current?.focus();
  };

  return (
    <div className="assistant-widget">
      {open && <section ref={panelRef} id="assistant-panel" className="assistant-panel" role="dialog" aria-modal="true" aria-labelledby="assistant-title">
        <div className="assistant-head"><span className="assistant-avatar"><Bot size={17} /></span><div><b id="assistant-title">Portfolio guide</b><small>Answers from this portfolio</small></div><button onClick={() => setOpen(false)} aria-label="Close portfolio assistant"><X size={17} /></button></div>
        <div className="assistant-messages" ref={messagesRef} aria-live="polite">
          {messages.map((message, index) => <p className={`assistant-message ${message.role}`} key={`${message.role}-${index}`}>{message.text}</p>)}
          {typing && <div className="assistant-typing" aria-label="Portfolio guide is typing"><i /><i /><i /></div>}
          <div className="assistant-prompts"><span>Try asking</span><button onClick={() => choosePrompt('What services do you offer?')}>Services</button><button onClick={() => choosePrompt('Tell me about your projects')}>Projects</button></div>
        </div>
        <form className="assistant-form" onSubmit={ask}><input ref={inputRef} aria-label="Ask the portfolio guide" value={question} onChange={event => setQuestion(event.target.value)} placeholder="Ask a question…" /><button type="submit" aria-label="Send question" disabled={!question.trim() || typing}><Send size={15} /></button></form>
        <Link to="/contact" className="assistant-contact">Have a project? Let’s talk <ArrowUpRight size={13} /></Link>
      </section>}
      <button className={`assistant-launcher ${open ? 'active' : ''}`} onClick={() => setOpen(current => !current)} aria-label={open ? 'Close portfolio guide' : 'Open portfolio guide'} aria-expanded={open} aria-controls="assistant-panel">
        {open ? <X size={20} /> : <><MessageCircle size={19} /><span>ASK ME</span></>}
      </button>
    </div>
  );
}

export function SectionHeading({ eyebrow, title, description, link, to = '/services' }) {
  return (
    <div className="section-heading reveal">
      <div>
        {eyebrow && <span className="eyebrow"><span className="eyebrow-dot" />{eyebrow}</span>}
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {link && <Link className="text-link section-heading-link" to={to}>{link}<ArrowUpRight size={16} /></Link>}
    </div>
  );
}

export function ServiceCard({ service, index = 0 }) {
  return (
    <Link to={`/services/${service.slug}`} className="service-card spotlight reveal" style={{ '--delay': `${index * 70}ms` }}>
      <div className="card-topline"><span className="service-icon"><IconFor name={service.icon} /></span><span className="card-index">0{index + 1}</span></div>
      <h3>{service.title}</h3>
      <p>{service.summary}</p>
      <ul className="service-details">{service.details.map(detail => <li key={detail}><Check size={13} />{detail}</li>)}</ul>
      <div className="tag-row">{service.tags.map(tag => <span className="tag" key={tag}>{tag}</span>)}</div>
      <span className="card-arrow"><ArrowUpRight size={19} /></span>
    </Link>
  );
}

export function ServiceGrid({ limit }) {
  const list = limit ? services.slice(0, limit) : services;
  return <div className="service-bento">{list.map((service, index) => <ServiceCard service={service} index={index} key={service.slug} />)}</div>;
}

export function TechMarquee() {
  const items = [...new Set(skillGroups.flatMap(group => group.items))];
  const marqueeRef = useRef(null);
  useMarqueeVelocity(marqueeRef);
  return (
    <section ref={marqueeRef} className="tech-marquee" aria-label="Technologies and tools">
      <div className="marquee-track">
        {[0, 1].map(group => (
          <div className="marquee-group" key={group} aria-hidden={group === 1}>
            {items.map(item => <span key={item}>{item}<i>✦</i></span>)}
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  const explore = [['About Me', '/about'], ['Projects', '/projects'], ['Skills & Technologies', '/skills'], ['Experience', '/experience'], ['Process', '/process'], ['Contact', '/contact']];
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-bottom">
          <Link className="brand-lockup" to="/"><span className="brand-mark">G<span>.</span></span><span className="brand-name">{profile.name}<small>SOFTWARE ENGINEER</small></span></Link>
          <span className="footer-note">Independent by nature. Collaborative by design.</span>
          <div className="footer-links">
            <a href={profile.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={13} /></a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={13} /></a>
            <Link to="/contact">Contact <ArrowUpRight size={13} /></Link>
          </div>
          <span className="copyright">© {new Date().getFullYear()} {profile.name}</span>
        </div>
        <div className="footer-name-marquee" aria-label={profile.name}>
          <span className="footer-name-glitter" aria-hidden="true">{profile.name}</span>
        </div>
        <div className="footer-sitemap" aria-label="More pages">
          <div className="footer-col">
            <span>Services</span>
            {services.map(service => <Link key={service.slug} to={`/services/${service.slug}`}>{service.title}</Link>)}
          </div>
          <div className="footer-col">
            <span>Explore</span>
            {explore.map(([label, path]) => <Link key={path} to={path}>{label}</Link>)}
          </div>
          <div className="footer-col">
            <span>Business systems</span>
            {systems.slice(0, 4).map(([title, , slug]) => <Link key={title} to={`/services/${slug}`}>{title}</Link>)}
          </div>
          <div className="footer-col">
            <span>Connect</span>
            <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            <a href={profile.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            <a href={profile.phoneLink}>{profile.phone}</a>
            <Link to="/contact">Start a project</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function CTA({ title = 'Have an idea? Let’s make it useful.', text = 'Tell me where you want to go. We’ll find the right way to build it.' }) {
  return (
    <section className="container cta-wrap reveal">
      <div className="cta-panel">
        <div><span className="eyebrow"><span className="eyebrow-dot" />YOUR NEXT CHAPTER STARTS HERE</span><h2>{title}</h2><p>{text}</p></div>
        <Link to="/contact" className="button button-light">Let’s talk <ArrowRight size={17} /></Link>
        <span className="cta-glow" aria-hidden="true" />
      </div>
    </section>
  );
}

export function IntroLine({ children }) {
  return <p className="intro-line"><span className="intro-line-mark"><Check size={14} /></span>{children}</p>;
}

export function ScrollCue() {
  return <a className="scroll-cue" href="#intro">SCROLL TO EXPLORE <ArrowDown size={14} /></a>;
}
