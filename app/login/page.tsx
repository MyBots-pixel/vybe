
import Link from "next/link";
import { signIn } from "../actions/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="vybe-login">
      <style>{`
        .vybe-login {
          min-height: 100vh;
          background: var(--background);
          color: var(--text);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 30px 20px;
          position: relative;
          overflow: hidden;
          font-family: inherit;
        }

        .vybe-login-glow {
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: #7839e91b;
          filter: blur(100px);
          pointer-events: none;
        }

        .vybe-login-logo {
          position: absolute;
          top: 30px;
          left: 7%;
          font-size: 30px;
          font-weight: 800;
          letter-spacing: -2px;
          color: var(--text);
          text-decoration: none;
        }

        .vybe-login-card {
          width: 100%;
          max-width: 440px;
          padding: 40px;
          border: 1px solid var(--border);
          border-radius: 20px;
          background: var(--card-background);
          position: relative;
          z-index: 1;
          box-shadow: 0 20px 80px #0002;
        }

        .vybe-login-input {
          width: 100%;
          padding: 15px;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: var(--input-background);
          color: var(--text);
          font-size: 14px;
          outline: none;
          box-sizing: border-box;
        }

        .vybe-login-input::placeholder {
          color: var(--muted);
        }

        .vybe-login-input:focus {
          border-color: var(--purple);
          outline: 2px solid var(--purple);
          outline-offset: 1px;
        }

        .vybe-login-submit {
          margin-top: 15px;
          padding: 15px;
          border: none;
          border-radius: 10px;
          background: linear-gradient(110deg, var(--purple), var(--cyan));
          color: white;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
        }

        .vybe-login-submit:hover {
          filter: brightness(1.08);
        }

        @media (max-width: 480px) {
          .vybe-login-card {
            padding: 28px 22px;
          }
        }
      `}</style>

      <div className="vybe-login-glow" />

      <Link href="/" className="vybe-login-logo">
        VYBE<span style={{ color: "var(--purple)" }}>.</span>
      </Link>

      <section className="vybe-login-card">
        <div
          style={{
            color: "var(--purple)",
            fontSize: "11px",
            fontWeight: 800,
            letterSpacing: "2px",
          }}
        >
          WELCOME BACK
        </div>

        <h1
          style={{
            fontSize: "32px",
            letterSpacing: "-1.5px",
            marginTop: "15px",
          }}
        >
          Find your VYBE.
        </h1>

        <p
          style={{
            color: "var(--muted)",
            fontSize: "14px",
            marginTop: "10px",
            marginBottom: "28px",
          }}
        >
          Log in and get back to your world.
        </p>

        {params.error && (
          <div
            style={{
              padding: "12px",
              borderRadius: "9px",
              background: "#ff4d6d18",
              border: "1px solid #ff4d6d55",
              color: "#ff6b86",
              fontSize: "13px",
              marginBottom: "18px",
            }}
          >
            {params.error}
          </div>
        )}

        {params.message && (
          <div
            style={{
              padding: "12px",
              borderRadius: "9px",
              background: "#22c55e18",
              border: "1px solid #22c55e55",
              color: "#16a36a",
              fontSize: "13px",
              marginBottom: "18px",
            }}
          >
            {params.message}
          </div>
        )}

        <form
          action={signIn}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <label
            style={{
              fontSize: "13px",
              fontWeight: 600,
              marginTop: "8px",
            }}
          >
            Email address
          </label>

          <input
            className="vybe-login-input"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
          />

          <label
            style={{
              fontSize: "13px",
              fontWeight: 600,
              marginTop: "8px",
            }}
          >
            Password
          </label>

          <input
            className="vybe-login-input"
            name="password"
            type="password"
            placeholder="Your password"
            required
          />

          <button type="submit" className="vybe-login-submit">
            Log in →
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            color: "var(--muted)",
            fontSize: "13px",
            marginTop: "25px",
          }}
        >
          New to VYBE?{" "}
          <Link
            href="/register"
            style={{
              color: "var(--purple)",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Create an account
          </Link>
        </p>

        <Link
          href="/"
          style={{
            display: "block",
            textAlign: "center",
            color: "var(--muted)",
            fontSize: "12px",
            marginTop: "25px",
            textDecoration: "none",
          }}
        >
          ← Back to homepage
        </Link>
      </section>
    </main>
  );
}
