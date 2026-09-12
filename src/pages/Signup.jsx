import { useState } from "react";
import { supabase } from "../lib/supabase";

function Signup() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleSignup(e) {

    e.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage(
        "Account created! Check your email if verification is required."
      );
    }

    setLoading(false);
  }

  return (
    <main className="auth-page">

      <div className="auth-card">

        <h1>Create account</h1>

        <p>
          Join CampusMate today.
        </p>

        <form onSubmit={handleSignup}>

          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create account"}
          </button>

        </form>

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        {message && (
          <p className="success-message">
            {message}
          </p>
        )}

      </div>

    </main>
  );
}

export default Signup;