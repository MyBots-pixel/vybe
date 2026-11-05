
import Link from "next/link";
import {
  ArrowRight,
  Globe2,
  MessageCircle,
  Users,
  Sparkles,
  Compass,
  ShieldCheck,
  Zap,
  LogIn,
  UserPlus,
} from "lucide-react";

export default function Home() {
  return (
    <main>
      <nav className="navbar">
        <Link href="/" className="logo">
          VYBE<span>.</span>
        </Link>

        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#communities">Communities</a>
          <a href="#about">About</a>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link
            href="/login"
            style={{
              color: "#F4F4FF",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: 700,
            }}
          >
            Log in
          </Link>

          <Link href="/register" className="nav-button">
            Get started <ArrowRight size={16} />
          </Link>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-glow" />

        <div className="hero-content">
          <div className="eyebrow">
            <Sparkles size={15} />
            YOUR WORLD. YOUR PEOPLE. YOUR VYBE.
          </div>

          <h1>
            Find your people.
            <br />
            <span>Discover your world.</span>
          </h1>

          <p>
            A new place to connect, share ideas, discover communities
            and express yourself. Everything social, all in one place.
          </p>

          <div className="hero-buttons">
            <Link href="/register" className="primary-button">
              Join the VYBE <ArrowRight size={18} />
            </Link>

            <a href="#features" className="secondary-button">
              Explore features
            </a>
          </div>

          <div className="hero-note">
            <span className="status-dot" />
            Available for the adventure ahead...
          </div>
        </div>

        <div className="hero-visual">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="orbit orbit-three" />

          <div className="visual-core">
            <div className="core-inner">V</div>
          </div>

          <div className="floating-card card-one">
            <Users size={20} />
            <span>Find your community</span>
          </div>

          <div className="floating-card card-two">
            <MessageCircle size={20} />
            <span>Start a conversation</span>
          </div>

          <div className="floating-card card-three">
            <Globe2 size={20} />
            <span>Explore something new</span>
          </div>
        </div>
      </section>

      <section className="features" id="features">
        <div className="section-heading">
          <span className="section-label">THE VYBE EXPERIENCE</span>
          <h2>
            Everything you need. <span>One place.</span>
          </h2>
          <p>More than a social network. A place to belong.</p>
        </div>

        <div className="feature-grid">
          <article className="feature-card" id="communities">
            <div className="feature-icon purple">
              <Users size={25} />
            </div>
            <h3>Your communities</h3>
            <p>
              Find your people, build communities and bring everyone together.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon cyan">
              <MessageCircle size={25} />
            </div>
            <h3>Real conversations</h3>
            <p>
              Share posts, chat with friends and join discussions that matter.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon pink">
              <Compass size={25} />
            </div>
            <h3>Discover your world</h3>
            <p>
              Explore new interests, creators, conversations and communities.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon purple">
              <ShieldCheck size={25} />
            </div>
            <h3>Your space</h3>
            <p>
              Build your identity and make your corner of VYBE your own.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon cyan">
              <Zap size={25} />
            </div>
            <h3>Always evolving</h3>
            <p>
              A growing platform designed around the people who use it.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon pink">
              <Globe2 size={25} />
            </div>
            <h3>One social universe</h3>
            <p>
              Bring your favourite parts of social networking together.
            </p>
          </article>
        </div>
      </section>

      <section className="join-section" id="join">
        <div className="join-glow" />

        <span className="section-label">
          YOUR NEXT CHAPTER STARTS HERE
        </span>

        <h2>
          Ready to find your <span>VYBE?</span>
        </h2>

        <p>
          Join the community and start building your world.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "15px",
            flexWrap: "wrap",
            marginTop: "28px",
          }}
        >
          <Link
            href="/register"
            className="primary-button"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "9px",
            }}
          >
            <UserPlus size={18} />
            Create your account
            <ArrowRight size={18} />
          </Link>

          <Link
            href="/login"
            className="secondary-button"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "9px",
            }}
          >
            <LogIn size={18} />
            Already a member? Log in
          </Link>
        </div>
      </section>

      <footer id="about">
        <Link href="/" className="logo">
          VYBE<span>.</span>
        </Link>

        <p>Your people. Your world.</p>

        <span>
          © {new Date().getFullYear()} VYBE. All rights reserved.
        </span>
      </footer>
    </main>
  );
}
