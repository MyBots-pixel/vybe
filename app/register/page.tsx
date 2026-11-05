
import Link from "next/link";
import { signUp } from "../actions/auth";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="vybe-register">
      <style>{`
        .vybe-register {
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

        .vybe-register-glow {
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: #7839e91b;
          filter: blur(100px);
          pointer-events: none;
        }

        .vybe-register-logo {
          position: absolute;
          top: 30px;
          left: 7%;
          font-size: 30px;
          font-weight: 800;
          letter-spacing: -2px;
          color: var(--text);
          text-decoration: none;
        }

        .vybe-register-card {
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

        .vybe-register-input {
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

        .vybe-register-input::placeholder {
          color: var(--muted);
        }

        .vybe-register-input:focus {
          border-color: var(--purple);
          outline: 2px solid var(--purple);
          outline-offset: 1px;
        }

        .vybe-register-submit {
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

        .vybe-register-submit:hover {
          filter: brightness(1.08);
        }

        @media (max-width: 480px) {
          .vybe-register-card {
            padding: 28px 22px;
          }
        }
      `}</style>

      <div className="vybe-register-glow" />

      <Link href="/" className="vybe-register-logo">
        VYBE<span style={{ color: "var(--purple)" }}>.</span>
      </Link>

      <section className="vybe-register-card">
        <div
          style={{
            color: "var(--purple)",
            fontSize: "11px",
            fontWeight: 800,
            letterSpacing: "2px",
          }}
        >
          JOIN THE COMMUNITY
        </div>

        <h1
          style={{
            fontSize: "32px",
            letterSpacing: "-1.5px",
            marginTop: "15px",
          }}
        >
          Create your account.
        </h1>

        <p
          style={{
            color: "var(--muted)",
            fontSize: "14px",
            marginTop: "10px",
            marginBottom: "28px",
          }}
        >
          Your people. Your world. Your VYBE.
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

        <form
          action={signUp}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <label style={{ fontSize: "13px", fontWeight: 600, marginTop: "8px" }}>
            Email address
          </label>

          <input
            className="vybe-register-input"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
          />

          <label style={{ fontSize: "13px", fontWeight: 600, marginTop: "8px" }}>
            Password
          </label>

          <input
            className="vybe-register-input"
            name="password"
            type="password"
            placeholder="At least 8 characters"
            minLength={8}
            required
          />

          <button type="submit" className="vybe-register-submit">
            Create account →
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
          Already have an account?{" "}
          <Link
            href="/login"
            style={{
              color: "var(--purple)",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Log in
          </Link>
        </p>
      </section>
    </main>
  );
}
