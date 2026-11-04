import Link from "next/link";
import { signUp } from "../actions/auth";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main style={styles.page}>
      <div style={styles.glow} />

      <Link href="/" style={styles.logo}>
        VYBE<span style={{ color: "#a477ff" }}>.</span>
      </Link>

      <section style={styles.card}>
        <div style={styles.label}>JOIN THE COMMUNITY</div>
        <h1 style={styles.heading}>Create your account.</h1>
        <p style={styles.description}>
          Your people. Your world. Your VYBE.
        </p>

        {params.error && (
          <div style={styles.error}>{params.error}</div>
        )}

        <form action={signUp} style={styles.form}>
          <label style={styles.labelText}>Email address</label>
          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            style={styles.input}
          />

          <label style={styles.labelText}>Password</label>
          <input
            name="password"
            type="password"
            placeholder="At least 8 characters"
            minLength={8}
            required
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Create account →
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{" "}
          <Link href="/login" style={styles.link}>
            Log in
          </Link>
        </p>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#090914",
    color: "#f5f3ff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "30px 20px",
    position: "relative",
    overflow: "hidden",
    fontFamily: "Inter, sans-serif",
  },
  glow: {
    position: "absolute",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background: "#7839e91b",
    filter: "blur(100px)",
    pointerEvents: "none",
  },
  logo: {
    position: "absolute",
    top: "30px",
    left: "7%",
    fontSize: "30px",
    fontWeight: 800,
    letterSpacing: "-2px",
    color: "#fff",
    textDecoration: "none",
  },
  card: {
    width: "100%",
    maxWidth: "440px",
    padding: "40px",
    border: "1px solid #ffffff18",
    borderRadius: "20px",
    background: "#151529",
    position: "relative",
    zIndex: 1,
    boxShadow: "0 20px 80px #0005",
  },
  label: {
    color: "#b99bff",
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "2px",
  },
  heading: {
    fontSize: "32px",
    letterSpacing: "-1.5px",
    marginTop: "15px",
  },
  description: {
    color: "#a09db8",
    fontSize: "14px",
    marginTop: "10px",
    marginBottom: "28px",
  },
  error: {
    padding: "12px",
    borderRadius: "9px",
    background: "#ff4d6d18",
    border: "1px solid #ff4d6d55",
    color: "#ff9aaa",
    fontSize: "13px",
    marginBottom: "18px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  labelText: {
    fontSize: "13px",
    fontWeight: 600,
    marginTop: "8px",
  },
  input: {
    width: "100%",
    padding: "15px",
    borderRadius: "10px",
    border: "1px solid #ffffff20",
    background: "#0c0c1b",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
  },
  button: {
    marginTop: "15px",
    padding: "15px",
    border: "none",
    borderRadius: "10px",
    background: "linear-gradient(110deg,#8955ef,#b05cf6)",
    color: "#fff",
    fontSize: "14px",
    fontWeight: 700,
    cursor: "pointer",
  },
  footer: {
    textAlign: "center",
    color: "#a09db8",
    fontSize: "13px",
    marginTop: "25px",
  },
  link: {
    color: "#b99bff",
    fontWeight: 700,
    textDecoration: "none",
  },
};
