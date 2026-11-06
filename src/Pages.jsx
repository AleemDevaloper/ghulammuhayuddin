import { useMemo, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import {
  motion, useReducedMotion, useScroll, useTransform,
} from 'framer-motion';
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, Check, Layers3, Phone, Sparkles,
} from 'lucide-react';
import {
  aiShowcases, pageContent, projects, profile, services, skillGroups, systems,
} from './data';
import {
  Counter, SplitWords, Tilt,
} from './motion';
import {
  CTA, IntroLine, PageMeta, ScrollCue, SectionHeading, ServiceGrid, TechMarquee,
} from './Layout';

const reveal = {
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
};

function ProjectCard({ project, index = 0 }) {
  return (
    <Tilt className="project-tilt">
      <Link to={`/projects/${project.slug}`} className={`project-card project-${project.color} spotlight reveal`} style={{ '--delay': `${index * 70}ms` }} data-cursor="View concept">
        <div className="project-art">
          <div className="project-art-grid" />
          {project.image && <img className="project-cover" src={project.image} alt={`${project.name} interface`} loading="lazy" decoding="async" />}
          <span className="project-art-label">{project.galleryLabel ? `${project.brand} / ${project.galleryLabel}` : project.category.toUpperCase()}</span>
          {!project.image && (
            <div className={`project-preview preview-${index % 3}`}>
              <div className="preview-top"><span /><span /><span /><i>{project.name.split(' ')[0]} / Overview</i></div>
              <div className="preview-content">
                <div className="preview-sidebar"><b /><b /><b /><b /></div>
                <div className="preview-main"><div className="preview-title" /><div className="preview-stats"><span /><span /><span /></div><div className="preview-chart"><i /><i /><i /><i /><i /><i /><i /><i /></div></div>
              </div>
            </div>
          )}
          <span className="project-index">0{index + 1}</span>
          <span className="project-glare" aria-hidden="true" />
        </div>
        <div className="project-card-info">
          <div><span className="project-type">{project.type} · {project.category}</span><h3>{project.name}</h3><p>{project.description}</p></div>
          <span className="project-open"><ArrowUpRight size={19} /></span>
        </div>
        <div className="tag-row project-tags">{project.stack.map(item => <span className="tag" key={item}>{item}</span>)}</div>
      </Link>
    </Tilt>
  );
}

function ProjectVisual({ project }) {
  return (
    <div className={`project-detail-visual project-${project.color}`}>
      <div className="project-art-grid" />
      <span className="project-art-label">{project.galleryLabel ? `${project.brand} / ${project.galleryLabel}` : `${project.category.toUpperCase()} / CONCEPT`}</span>
      {project.image ? (
        <img className="project-detail-image" src={project.image} alt={`${project.name} ${project.category} dashboard`} decoding="async" />
      ) : (
        <div className="detail-window">
          <div className="preview-top"><span /><span /><span /><i>{project.name} <b>↗</b></i></div>
          <div className="detail-window-body">
            <div className="detail-sidebar"><span /><span /><span /><span /><span /></div>
            <div className="detail-dashboard">
              <div className="detail-welcome"><small>WORKSPACE / OVERVIEW</small><strong>{project.name}</strong><em>{project.metric}</em></div>
              <div className="detail-kpis"><i /><i /><i /></div>
              <div className="detail-graph"><span /><span /><span /><span /><span /><span /><span /><span /><span /></div>
              <div className="detail-list"><i /><i /><i /></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AiShowcaseGallery() {
  return (
    <section className="ai-gallery-section section-pad">
      <div className="container">
        <div className="ai-gallery-heading reveal">
          <div><span className="eyebrow"><span className="eyebrow-dot" />AI / AUTOMATION IN ACTION</span><h2>Make intelligence<br /><span>part of the workflow.</span></h2></div>
          <div className="ai-gallery-intro"><p>Explore interfaces for AI assistants, document processing, and business insights—visual examples of automation designed around real work.</p><Link className="text-link" to="/services/ai-automation">Explore AI & automation <ArrowUpRight size={15} /></Link></div>
        </div>
        <div className="ai-gallery-grid">{aiShowcases.map((item, index) => <Link className="ai-image-card spotlight reveal" style={{ '--delay': `${index * 80}ms` }} to={`/projects/${item.project}`} key={item.title}>
          <div className="ai-image-frame"><img src={item.image} alt={`${item.title} AI product interface`} loading="lazy" decoding="async" /><span className="ai-image-tag"><Sparkles size={12} />{item.tag}</span><span className="ai-image-open"><ArrowUpRight size={17} /></span></div>
          <div className="ai-image-copy"><span>0{index + 1} / PRODUCT UI</span><h3>{item.title}</h3><p>{item.description}</p></div>
        </Link>)}</div>
        <p className="ai-gallery-note">Interface imagery sourced from the supplied Zylvoo design concepts; shown as visual product references.</p>
      </div>
    </section>
  );
}

export function HomePage() {
  const heroRef = useRef(null);
  const featured = projects.slice(0, 3);
  const reduceMotion = useReducedMotion();
  const toolCount = useMemo(() => new Set(skillGroups.flatMap(group => group.items)).size, []);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const artY = useTransform(scrollYProgress, [0, 1], [0, 110]);
  const artOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.2]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 52]);
  const handlePointer = event => {
    const section = heroRef.current;
    if (!section) return;
    const bounds = section.getBoundingClientRect();
    section.style.setProperty('--pointer-x', `${((event.clientX - bounds.left) / bounds.width) * 100}%`);
    section.style.setProperty('--pointer-y', `${((event.clientY - bounds.top) / bounds.height) * 100}%`);
  };
  return (
    <>
      <PageMeta title="Full-Stack Developer & AI Automation Specialist" description="GHULLAM MUHAYYUDIN builds intelligent digital products, business systems, and AI-powered automation." />
      <section ref={heroRef} className="hero-section" onMouseMove={handlePointer}>
        <div className="hero-noise" />
        <div className="hero-aurora" aria-hidden="true"><span /><span /><span /></div>
        <div className="container hero-layout">
          <motion.div className="hero-copy" style={reduceMotion ? undefined : { y: copyY }}>
            <motion.div {...reveal} className="hero-kicker">
              <span className="status-dot" /> AVAILABLE FOR SELECT PROJECTS <span className="kicker-line" />
              <span className="hero-kicker-meta">FULL-STACK / AI / SYSTEMS</span>
            </motion.div>
            <h1 className="hero-title">
              <span className="hero-line"><SplitWords text="GHULLAM" delay={0.12} /></span>
              <span className="hero-line"><SplitWords text="MUHAYYUDIN" delay={0.2} wordClassName={() => 'gradient-word'} /></span>
            </h1>
            <motion.p className="hero-role" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}>
              <em>full-stack engineer</em> &amp; AI builder
            </motion.p>
            <motion.p className="hero-description" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }}>
              I build intelligent web products, business systems, and AI-powered automation that turn complicated work into something that feels simple.
            </motion.p>
            <motion.div className="hero-actions" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.58 }}>
              <Link to="/projects" className="button button-accent" data-cursor="Explore">Explore my work <ArrowUpRight size={16} /></Link>
              <Link to="/contact" className="button button-quiet" data-cursor="Say hi">Let’s work together <ArrowRight size={16} /></Link>
            </motion.div>
            <motion.div className="hero-metrics" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.7 }}>
              <div><Counter value={services.length} /><span>Services</span></div>
              <div><Counter value={projects.length} /><span>Concepts</span></div>
              <div><Counter value={toolCount} /><span>Tools</span></div>
            </motion.div>
          </motion.div>
          <motion.div
            className="hero-art"
            initial={{ opacity: 0, scale: 0.94, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.05, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            style={reduceMotion ? undefined : { y: artY, opacity: artOpacity }}
          >
            <div className="art-glow" />
            <div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit orbit-three" />
            <div className="hero-core"><div className="core-inner"><span className="core-g">G</span><span className="core-dot" /></div></div>
            <div className="floating-chip chip-react"><span className="chip-symbol">◉</span><div><b>React</b><small>PRODUCT UI</small></div></div>
            <div className="floating-chip chip-ai"><Sparkles size={17} /><div><b>Applied AI</b><small>INTELLIGENCE</small></div></div>
            <div className="hero-now"><span className="hero-now-dot" /><div><b>Now building</b><small>AI-assisted business tools</small></div></div>
            <div className="code-card"><div className="code-top"><span /><span /><span /><i>product.ts</i></div><code><span className="code-purple">const</span> experience = {'{'}<br /><span className="code-indent">design:</span> <span className="code-green">'intentional'</span>,<br /><span className="code-indent">systems:</span> <span className="code-green">'scalable'</span>,<br /><span className="code-indent">future:</span> <span className="code-blue">'in progress'</span><br />{'}'};</code></div>
          </motion.div>
          <ScrollCue />
          <div className="hero-index">01 <span>/</span> 06</div>
        </div>
      </section>

      <TechMarquee />

      <section className="intro-section section-pad" id="intro">
        <div className="container">
          <div className="intro-grid">
            <div className="intro-aside reveal">
              <div className="intro-aside-top">
                <span className="eyebrow"><span className="eyebrow-dot" />A DEVELOPER WITH A WIDE LENS</span>
                <figure className="intro-portrait" data-cursor="That's me">
                  <img src="/assets/ghullam-portrait.jpeg" alt="Ghullam Muhayyudin at his studio desk" loading="lazy" />
                  <figcaption><span>GHULLAM MUHAYYUDIN</span><span>INDEPENDENT DEVELOPER</span></figcaption>
                </figure>
              </div>
              <span className="intro-aside-no">01 — WHAT I DO</span>
            </div>
            <div className="intro-main reveal">
              <p className="editorial-line">Good software should do more than work.</p>
              <h2>It should make the <span>complicated</span> feel clear—and help people do their best work.</h2>
              <div className="intro-foot"><p>I’m {profile.name}, a software engineer who brings web, mobile, AI, and business systems together to solve meaningful problems.</p><Link className="text-link" to="/about">A bit more about me <ArrowUpRight size={15} /></Link></div>
            </div>
          </div>
        </div>
      </section>

      <section className="services-section section-pad">
        <div className="container">
          <SectionHeading eyebrow="CAPABILITIES / 01—06" title="From a single screen to the whole system." description="Digital product thinking, hands-on engineering, and the details that make the experience feel right." link="Explore all services" />
          <ServiceGrid limit={6} />
        </div>
      </section>

      <section className="projects-section section-pad">
        <div className="container">
          <SectionHeading eyebrow="SELECTED CONCEPTS / 2026" title="Ideas, shaped into experiences." description="A collection of product concepts exploring thoughtful interfaces and useful systems. These are illustrative concepts, not claims of client work." link="View all projects" to="/projects" />
          <div className="row g-4">{featured.map((project, index) => <div className="col-md-6 col-lg-4" key={project.slug}><ProjectCard project={project} index={index} /></div>)}</div>
        </div>
      </section>

      <AiShowcaseGallery />

      <section className="systems-section section-pad">
        <div className="container">
          <div className="systems-heading reveal">
            <div><span className="eyebrow"><span className="eyebrow-dot" />THE CONNECTED BUSINESS</span><h2>One ecosystem.<br /><span>Less friction.</span></h2></div>
            <p>Bring your essential business workflows into a clearer, more connected experience, built around how your team actually works.</p>
          </div>
          <div className="systems-grid">{systems.map(([title, description, slug], index) => <Link className="system-item reveal" style={{ '--delay': `${index * 50}ms` }} to={`/services/${slug}`} key={title}><span className="system-no">0{index + 1}</span><div><h3>{title}</h3><p>{description}</p></div><ArrowUpRight size={17} /></Link>)}</div>
          <Link className="text-link systems-link" to="/services/business-software">Explore business systems <ArrowUpRight size={15} /></Link>
          <div className="product-showcase">
            <div className="product-showcase-heading reveal"><span className="eyebrow"><span className="eyebrow-dot" />ZYLVOO / PRODUCT INTERFACES</span><Link className="text-link" to="/projects/zylvoo-business-suite">View the showcase <ArrowUpRight size={15} /></Link></div>
            <div className="product-showcase-grid">
              {projects[0].gallery.slice(0, 3).map((item, index) => <Link className="product-shot reveal" style={{ '--delay': `${index * 80}ms` }} to="/projects/zylvoo-business-suite" key={item.title}>
                <img src={item.image} alt={`${item.title} interface`} loading="lazy" decoding="async" />
                <span className="product-shot-caption"><b>0{index + 1}</b>{item.title}<ArrowUpRight size={14} /></span>
              </Link>)}
            </div>
            <p className="product-showcase-note">Selected interface visuals from the supplied Zylvoo design assets.</p>
          </div>
        </div>
      </section>

      <section className="stack-section section-pad">
        <div className="container stack-layout">
          <div className="stack-copy reveal"><span className="eyebrow"><span className="eyebrow-dot" />A FLEXIBLE TOOLKIT</span><h2>Tools are important.<br /><span>What you make matters more.</span></h2><p>A practical mix of modern technologies, chosen to fit the problem—not the other way around.</p><Link className="text-link" to="/skills">See the full toolkit <ArrowUpRight size={15} /></Link></div>
          <div className="stack-panels">{skillGroups.map((group, index) => <div className="stack-panel reveal" style={{ '--delay': `${index * 70}ms` }} key={group.title}><div className="stack-panel-title"><span>0{index + 1}</span><h3>{group.title}</h3><ArrowDownRight size={15} /></div><div className="stack-items">{group.items.map(item => <span key={item}>{item}</span>)}</div></div>)}</div>
        </div>
      </section>

      <section className="process-section section-pad">
        <div className="container">
          <SectionHeading eyebrow="HOW WE GET THERE" title="Good things happen in good company." description="A process that keeps the work collaborative, clear, and moving." link="See my process" to="/process" />
          <div className="process-steps">{['Discover', 'Shape', 'Build', 'Refine', 'Launch'].map((step, index) => <div className="process-step reveal" style={{ '--delay': `${index * 80}ms` }} key={step}><span className="step-count">0{index + 1}</span><span className="step-dot" /><h3>{step}</h3><p>{['Understand goals, people, and constraints.', 'Plan the experience and technical direction.', 'Build in focused, reviewable increments.', 'Test assumptions and polish the details.', 'Ship with confidence and keep improving.'][index]}</p></div>)}</div>
        </div>
      </section>
      <CTA title="Have an idea? Let’s make it useful." />
    </>
  );
}

const pageCounters = { about: '02', services: '03', skills: '05', experience: '05', process: '06', testimonials: '05' };

export function ContentPage({ slug }) {
  const page = pageContent[slug];
  if (!page) return <NotFound />;
  const isServicePage = services.some(service => service.slug === slug);
  const index = isServicePage ? '03' : (pageCounters[slug] || '05');
  return (
    <>
      <PageMeta title={page.title} description={page.intro} />
      <PageHero page={page} index={index} />
      <section className="content-page-section section-pad">
        <div className="container content-layout">
          <div className="content-main reveal"><span className="eyebrow"><span className="eyebrow-dot" />A THOUGHTFUL APPROACH</span><h2>{page.title}</h2>{page.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
          <aside className="content-aside reveal"><span className="aside-label">THE FOCUS</span>{page.items.map((item, index) => <IntroLine key={item}>{item}</IntroLine>)}</aside>
        </div>
      </section>
      {['ai-automation', 'ai-agents-llm-solutions'].includes(slug) && <AiShowcaseGallery />}
      {slug === 'services' && <section className="container section-pad compact-top"><ServiceGrid /></section>}
      {slug === 'skills' && <section className="container section-pad compact-top"><div className="row g-3">{skillGroups.map((group, index) => <div className="col-md-6" key={group.title}><div className="skill-detail-card reveal"><span>0{index + 1} / TOOLKIT</span><h3>{group.title}</h3><div className="tag-row">{group.items.map(item => <span className="tag" key={item}>{item}</span>)}</div></div></div>)}</div></section>}
      {slug === 'business-software' && <section className="container section-pad compact-top"><div className="row g-3">{systems.map(([title, description, route], index) => <div className="col-sm-6 col-lg-3" key={title}><Link className="system-detail-card reveal" to={`/services/${route}`}><span>0{index + 1}</span><h3>{title}</h3><p>{description}</p><ArrowUpRight size={16} /></Link></div>)}</div></section>}
      {slug === 'about' && <section className="container section-pad compact-top"><div className="about-values"><div className="about-monogram reveal"><img src="/assets/portfolio/ghulam-portrait.jpeg" alt="Ghulam Muhayuddin" loading="lazy" decoding="async" /><span className="about-portrait-mark" aria-hidden="true">G<span>.</span></span></div><div className="about-note reveal"><span className="eyebrow"><span className="eyebrow-dot" />THE WAY I WORK</span><h2>Make it useful.<br />Make it last.</h2><p>My goal is to create software that respects people’s time: dependable foundations, clear interactions, and room to grow as needs change.</p><div className="about-value-list">{['Clarity over complexity', 'Partnership over handoffs', 'Purpose over novelty'].map((item, index) => <div key={item}><span>0{index + 1}</span>{item}<ArrowUpRight size={15} /></div>)}</div></div></div></section>}
      <CTA title="Let’s talk about what you’re building." />
    </>
  );
}

function PageHero({ page, index = '02' }) {
  return (
    <section className="page-hero">
      <div className="container page-hero-inner">
        <div className="page-hero-copy">
          <motion.span className="eyebrow" {...reveal}><span className="eyebrow-dot" />{page.eyebrow}</motion.span>
          <h1><SplitWords text={page.title} delay={0.1} /></h1>
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.22 }}>{page.intro}</motion.p>
          <Link to="/contact" className="button button-accent">Start a conversation <ArrowUpRight size={16} /></Link>
        </div>
        <div className="page-hero-visual reveal"><div className="page-visual-orbit orbit-one" /><div className="page-visual-orbit orbit-two" /><div className="page-visual-center"><span>G<span>.</span></span></div><div className="page-visual-chip chip-a"><Layers3 size={15} /> SYSTEMS</div><div className="page-visual-chip chip-b"><Sparkles size={15} /> IDEAS</div><span className="page-hero-count">{index} <i>/ 06</i></span></div>
      </div>
    </section>
  );
}

const categories = ['All', 'Websites', 'Web Applications', 'SaaS Platforms', 'Business Systems', 'AI & Automation', 'Mobile Applications'];

export function ProjectsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requested = searchParams.get('category');
  const active = categories.includes(requested) ? requested : 'All';
  const setActive = category => {
    const next = new URLSearchParams(searchParams);
    if (category === 'All') next.delete('category');
    else next.set('category', category);
    setSearchParams(next, { replace: true });
  };
  const filtered = useMemo(() => active === 'All' ? projects : projects.filter(project => project.category === active), [active]);
  return (
    <>
      <PageMeta title="Projects & Product Concepts" description="Explore product concepts across web applications, AI, business software, and mobile." />
      <PageHero page={{ eyebrow: 'SELECTED WORK / PRODUCT CONCEPTS', title: 'The future, in progress.', intro: 'A growing collection of product concepts exploring useful tools, clear interfaces, and thoughtful software. Concept projects are clearly labeled; no client outcomes are implied.' }} index="04" />
      <section className="container section-pad projects-list-section">
        <div className="filter-bar" role="group" aria-label="Filter projects">{categories.map(category => <button key={category} className={active === category ? 'filter-chip active' : 'filter-chip'} onClick={() => setActive(category)} aria-pressed={active === category}>{category}<span>{category === 'All' ? projects.length : projects.filter(p => p.category === category).length}</span></button>)}</div>
        <div className="row g-4 project-list">{filtered.map((project, index) => <div className="col-md-6 col-lg-4" key={project.slug}><ProjectCard project={project} index={index} /></div>)}</div>
        {filtered.length === 0 && <p className="empty-state">No projects in this category yet.</p>}
      </section>
      <CTA title="Have a project in mind?" text="Let’s explore what a useful first version could look like." />
    </>
  );
}

export function ProjectDetailPage() {
  const { slug } = useParams();
  const project = projects.find(item => item.slug === slug);
  if (!project) return <NotFound />;
  const currentIndex = projects.findIndex(item => item.slug === project.slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];
  const isZylvooShowcase = project.brand === 'ZYLVOO';
  return (
    <>
      <PageMeta title={project.name} description={project.description} />
      <section className="project-detail-hero"><div className="container"><Link to="/projects" className="back-link"><ArrowRight size={14} /> BACK TO PROJECTS</Link><span className="eyebrow"><span className="eyebrow-dot" />{project.type} / {project.category}</span><h1>{project.name}<span>.</span></h1><p>{project.description}</p><ProjectVisual project={project} /></div></section>
      {project.gallery && <section className="container project-gallery-section"><div className="product-showcase-heading reveal"><div><span className="eyebrow"><span className="eyebrow-dot" />A CLOSER LOOK</span><h2>{isZylvooShowcase ? 'One suite, many workflows.' : 'A closer look at the screens.'}</h2></div><span className="gallery-brand">{isZylvooShowcase && <img src="/assets/zylvoo/zylvoo-mark.png" alt="" loading="lazy" decoding="async" />}{project.brand}</span></div><div className="row g-3">{project.gallery.map((item, index) => <div className="col-md-6" key={item.image}><figure className="gallery-figure reveal" style={{ '--delay': `${Math.min(index * 40, 360)}ms` }}><img src={item.image} alt={item.alt || `${project.name} — ${item.title}`} loading="lazy" decoding="async" /><figcaption><span>{String(index + 1).padStart(2, '0')}</span>{item.title}<ArrowUpRight size={14} /></figcaption></figure></div>)}</div></section>}
      <section className="container section-pad project-detail-body">
        <div className="project-detail-copy"><span className="eyebrow"><span className="eyebrow-dot" />{project.gallery ? 'PRODUCT SHOWCASE' : 'THE IDEA'}</span><h2>{project.metric}.</h2><p>{isZylvooShowcase ? 'A selected visual showcase of the Zylvoo business software experience, spanning operations, people, attendance, and insight workflows. These supplied product visuals are presented here as interface examples, not as claims about personal delivery or business outcomes.' : project.gallery ? 'A curated gallery of supplied visual assets for this independent product concept. The screens illustrate its workflows with synthetic demo data and are presented as design references, not claims of shipped client work.' : `This concept explores how a clear digital experience can make ${project.category.toLowerCase()} more approachable. It is an illustrative product direction—not a claim of shipped client work.`}</p><p>{isZylvooShowcase ? 'The screens highlight the information architecture and operational patterns behind connected management software. Each module has its own focused view while contributing to a broader business workspace.' : project.gallery ? 'Explore the key views across this concept, from its overview and daily workflows to supporting tools, reporting, and workspace settings.' : 'The experience pairs a focused interface with connected workflows, helping people see what matters and decide what to do next.'}</p></div>
        <div className="project-detail-facts"><div><span>01 / CATEGORY</span><b>{project.category}</b></div><div><span>02 / FORMAT</span><b>{project.type}</b></div><div><span>03 / FOCUS</span><b>{project.metric}</b></div><div className="fact-stack"><span>04 / TECHNOLOGIES</span><div className="tag-row">{project.stack.map(item => <span className="tag" key={item}>{item}</span>)}</div></div></div>
      </section>
      <section className="container">
        <Link to={`/projects/${nextProject.slug}`} className="next-project" data-cursor="Next project">
          <div>
            <span className="eyebrow"><span className="eyebrow-dot" />NEXT PROJECT</span>
            <h2>{nextProject.name}</h2>
            <p>{nextProject.category}</p>
          </div>
          <span className="next-project-arrow"><ArrowUpRight size={24} /></span>
        </Link>
      </section>
      <CTA title="Let’s create something of your own." text="Every good product starts with a conversation about the problem worth solving." />
    </>
  );
}

export function ContactPage() {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT;

  const submit = async event => {
    event.preventDefault();
    if (status === 'sending') return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const values = Object.fromEntries(new FormData(form));
    if (values.company) {
      setStatus('sent');
      return;
    }
    setError('');

    if (endpoint) {
      setStatus('sending');
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ ...values, subject: values.subject || `Project enquiry from ${values.name}` }),
        });
        if (!response.ok) throw new Error('Request failed');
        form.reset();
        setStatus('sent');
      } catch {
        setStatus('idle');
        setError('Something went wrong while sending. Please email me directly instead.');
      }
      return;
    }

    if (!profile.email) {
      setError('The contact form is not connected yet. Add a VITE_CONTACT_ENDPOINT or set a contact email in src/data.js.');
      return;
    }

    const subject = encodeURIComponent(values.subject || `Project enquiry from ${values.name}`);
    const body = encodeURIComponent(`Name: ${values.name}\nEmail: ${values.email}\nService: ${values.service}\nBudget: ${values.budget}\n\n${values.message}`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setStatus('sent');
  };

  return (
    <>
      <PageMeta title="Contact" description="Start a conversation with GHULLAM MUHAYYUDIN about your product, software, or automation project." />
      <section className="page-hero contact-hero"><div className="container page-hero-inner"><div className="page-hero-copy"><span className="eyebrow"><span className="eyebrow-dot" />CONTACT / LET’S START HERE</span><h1>Tell me what’s<br /><span className="gradient-word">on your mind.</span></h1><p>Have an idea, a knotty workflow, or a product you want to improve? I’d love to hear a little about it.</p><a className="email-direct" href={`mailto:${profile.email}`} data-cursor="Email"><span>EMAIL ME DIRECTLY</span><b>{profile.email}</b><ArrowUpRight size={18} /></a><a className="email-direct contact-phone" href={profile.phoneLink} data-cursor="Call"><span>CALL ME DIRECTLY</span><b>{profile.phone}</b><Phone size={18} /></a></div><div className="contact-orb"><div className="contact-orb-inner"><span>Let’s<br />make it<br /><i>real.</i></span><Sparkles size={20} /></div><div className="orb-ring ring-one" /><div className="orb-ring ring-two" /></div></div></section>
      <section className="container contact-content"><div className="contact-form-intro"><span className="eyebrow"><span className="eyebrow-dot" />A FEW DETAILS</span><h2>What are you<br />looking to build?</h2><p>A little context helps me come to the conversation with better questions.</p><div className="contact-socials"><a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={14} /></a><a href={profile.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} /></a><a href={profile.whatsapp} target="_blank" rel="noreferrer">WhatsApp <ArrowUpRight size={14} /></a></div><p className="contact-response">Usually replies within one working day.</p></div>
        <form className="contact-form" onSubmit={submit}>
          <div className="hp-field" aria-hidden="true">
            <label>Company<input name="company" tabIndex={-1} autoComplete="off" /></label>
          </div>
          <div className="form-grid"><label>Your name<input name="name" autoComplete="name" placeholder="How should I address you?" required /></label><label>Email address<input name="email" type="email" autoComplete="email" placeholder="you@company.com" required /></label></div>
          <div className="form-grid"><label>Subject<input name="subject" placeholder="A short headline" required /></label><label>Service<select name="service" defaultValue="" required><option value="" disabled>Select a service</option>{services.map(service => <option key={service.slug}>{service.title}</option>)}<option>Something else</option></select></label></div>
          <label>Estimated budget<select name="budget" defaultValue=""><option value="" disabled>Choose a range (optional)</option><option>Under $2,500</option><option>$2,500 – $10,000</option><option>$10,000 – $25,000</option><option>$25,000+</option><option>Let’s discuss</option></select></label>
          <label>Tell me a little about the project<textarea name="message" rows="5" placeholder="The opportunity, the challenge, the big idea…" required /></label>
          {error && <p className="form-message form-error" role="alert">{error}</p>}
          {status === 'sent' && <p className="form-message form-success" role="status"><Check size={16} /> Thanks — your enquiry is on its way. I’ll get back to you shortly.</p>}
          <button type="submit" className="button button-accent form-submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Send project enquiry'} <ArrowUpRight size={16} />
          </button>
          <span className="form-privacy">Your details are only used to respond to this enquiry.</span>
        </form></section>
    </>
  );
}

export function NotFound() {
  return <section className="not-found"><div className="container"><span className="eyebrow"><span className="eyebrow-dot" />404 / PAGE NOT FOUND</span><h1>Looks like this<br /><span>page took a detour.</span></h1><p>The page you’re looking for isn’t here, but there’s plenty more to explore.</p><Link to="/" className="button button-accent">Back to home <ArrowRight size={16} /></Link></div></section>;
}
