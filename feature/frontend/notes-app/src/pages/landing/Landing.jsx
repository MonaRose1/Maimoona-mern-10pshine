import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Landing.css';

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <header className="mn-nav">
      <div className="mn-nav__inner">
        <div className="mn-logo" onClick={() => navigate('/')}>Mona Notes</div>
        <nav className="mn-nav__links">
          <a href="#home" className="mn-link">Home</a>
          <a href="#features" className="mn-link">Features</a>
          <a href="#about" className="mn-link">About</a>
        </nav>
        <div className="mn-nav__actions">
          <Link to="/login" className="mn-btn mn-btn--ghost">Login</Link>
          <Link to="/signup" className="mn-btn mn-btn--primary">Sign Up</Link>
        </div>
      </div>
    </header>
  );
};

const Hero = () => {
  return (
    <section id="home" className="mn-hero">
      <div className="mn-hero__content">
        <h1 className="mn-hero__title">Your Notes, Secure and Always with You.</h1>
        <p className="mn-hero__subtitle">Capture your thoughts, ideas, and to-dos effortlessly — anywhere, anytime.</p>
        <div className="mn-cta">
          <Link to="/signup" className="mn-btn mn-btn--primary mn-btn--lg">Get Started</Link>
          <Link to="/login" className="mn-btn mn-btn--secondary mn-btn--lg">Login</Link>
        </div>
      </div>
      <div className="mn-hero__visual">
        <div className="mn-note mn-note--yellow mn-float" style={{transform: 'rotate(-3deg)'}}>
          <div className="mn-note__title">Shopping list</div>
          <ul className="mn-note__list">
            <li>🥛 Milk</li>
            <li>🍞 Bread</li>
            <li>🥚 Eggs</li>
          </ul>
        </div>
        <div className="mn-note mn-note--mint mn-float-delayed" style={{transform: 'rotate(2deg)'}}>
          <div className="mn-note__title">Project ideas</div>
          <p>AI assistant, Mood tracker, Habit app</p>
        </div>
        <div className="mn-note mn-note--lavender mn-float" style={{transform: 'rotate(-1deg)'}}>
          <div className="mn-note__title">Meeting notes</div>
          <p>Finalize scope, assign tasks, set deadlines</p>
        </div>
        <div className="mn-note mn-note--pink mn-float-lock" style={{transform: 'rotate(4deg)'}}>
          <div className="mn-note__title">🔒 Secret notes</div>
          <p>Personal reflections and private thoughts</p>
        </div>
      </div>
      <div className="mn-hero__blob" aria-hidden="true" />
    </section>
  );
};

const Features = () => {
  const items = [
    { icon: '✍️', title: 'Create & Edit Notes', desc: 'Simple interface to jot down your ideas instantly.' },
    { icon: '🔒', title: 'Secure Access', desc: 'Private, password-protected notes for every user.' },
    { icon: '☁️', title: 'Cloud Sync', desc: 'Access your notes anywhere, on any device.' },
    { icon: '🗂️', title: 'Organize Easily', desc: 'Tag and color‑code notes for quick access.' },
  ];
  return (
    <section id="features" className="mn-section mn-section--alt">
      <h2 className="mn-section__title">Features that Make Note‑Taking Effortless.</h2>
      <div className="mn-grid">
        {items.map((it) => (
          <div key={it.title} className="mn-card">
            <div className="mn-card__icon" aria-hidden>{it.icon}</div>
            <div className="mn-card__title">{it.title}</div>
            <div className="mn-card__desc">{it.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    { icon: '📝', title: 'Sign Up', desc: 'Create your free account securely.' },
    { icon: '⚡', title: 'Add Notes', desc: 'Write down your ideas in seconds.' },
    { icon: '🎨', title: 'Organize & Color', desc: 'Categorize and personalize your notes.' },
    { icon: '📲', title: 'Access Anywhere', desc: 'Retrieve notes from any device securely.' },
  ];
  return (
    <section className="mn-section">
      <h2 className="mn-section__title">Why Mona Notes</h2>
      <div className="mn-steps">
        {steps.map((s, idx) => (
          <div key={s.title} className={`mn-step ${idx % 2 ? 'mn-step--right' : 'mn-step--left'}`}>
            <div className="mn-step__icon" aria-hidden>{s.icon}</div>
            <div className="mn-step__content">
              <div className="mn-step__title">{s.title}</div>
              <div className="mn-step__desc">{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const Demo = () => {
  return (
    <section className="mn-section mn-demo">
      <div className="mn-demo__mock">
        <div className="mn-demo__topbar">
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
        </div>
        <div className="mn-demo__content">
          <div className="mn-demo__sidebar" />
          <div className="mn-demo__editor">
            <div className="mn-demo__title" />
            <div className="mn-demo__line" />
            <div className="mn-demo__line" />
            <div className="mn-demo__line" />
          </div>
        </div>
        <button className="mn-demo__play" aria-label="Play demo" />
      </div>
      <p className="mn-demo__caption">Experience fast, secure, and distraction‑free note‑taking.</p>
    </section>
  );
};

const About = () => (
  <section id="about" className="mn-section mn-section--muted">
    <h2 className="mn-section__title">About Mona Notes</h2>
    <p className="mn-about__text">
      Mona Notes is a full‑stack note‑taking web app built with the MERN stack. It helps you capture, manage, and secure your notes all in one place — designed with simplicity, privacy, and productivity in mind.
    </p>
    <div className="mn-about__stack">
      <span>⚛️ React</span>
      <span>🟢 Node</span>
      <span>🍃 MongoDB</span>
    </div>
  </section>
);

const CTA = () => (
  <section className="mn-cta-section">
    <h3 className="mn-cta__title">Start organizing your thoughts today.</h3>
    <div className="mn-cta__actions">
      <Link to="/signup" className="mn-btn mn-btn--gradient mn-btn--lg">Get Started — It’s Free</Link>
      <Link to="/login" className="mn-link mn-link--muted">Already have an account? Log in</Link>
    </div>
    <p className="mn-cta__sub">Your notes stay private and accessible anywhere.</p>
  </section>
);

const Footer = () => (
  <footer className="mn-footer">
    <div className="mn-footer__inner">
      <div className="mn-footer__brand">Mona Notes</div>
      <div className="mn-footer__tag">Built with ❤️ by Mona DevDizayn</div>
      <div className="mn-footer__social">
        <a href="#" aria-label="Instagram" className="mn-social"></a>
        <a href="#" aria-label="GitHub" className="mn-social"></a>
        <a href="#" aria-label="LinkedIn" className="mn-social"></a>
      </div>
    </div>
    <div className="mn-footer__copy">© 2025 Mona Notes. All rights reserved.</div>
  </footer>
);

const Landing = () => {
  return (
    <div className="mn-page">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Demo />
      <About />
      <CTA />
      <Footer />
    </div>
  );
};

export default Landing;