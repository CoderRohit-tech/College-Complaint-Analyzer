import { useNavigate } from "react-router-dom";
// import "./Welcome.css";

function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="welcome-page">

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          🎓 Complaint Analyzer
        </div>

        <div className="nav-buttons">
          <button
            className="login-btn"
            onClick={() => navigate("/login")}
          >
            Student Login
          </button>

          <button
            className="admin-btn"
            onClick={() => navigate("/admin/login")}
          >
            Admin Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">

        <div className="hero-content">
          <span className="badge">
            AI Powered College Complaint System
          </span>

          <h1>
            Your Voice.
            <br />
            <span>We Analyze. We Act.</span>
          </h1>

          <p>
            Submit your college complaints easily and let our AI-powered
            system analyze, categorize and prioritize them for faster
            resolution.
          </p>

          <div className="hero-buttons">
            <button
              className="primary-btn"
              onClick={() => navigate("/login")}
            >
              Get Started →
            </button>

            <button
              className="secondary-btn"
              onClick={() => navigate("/register")}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Right Side Card */}
        <div className="hero-card">

          <div className="card-header">
            <span>📋</span>
            <div>
              <h3>Complaint Analysis</h3>
              <p>AI Processing</p>
            </div>
          </div>

          <div className="analysis-item">
            <span>📚</span>
            <div>
              <strong>Library Issue</strong>
              <small>Category detected</small>
            </div>
            <span className="success">✓</span>
          </div>

          <div className="analysis-item">
            <span>📶</span>
            <div>
              <strong>Wi-Fi Problem</strong>
              <small>High Priority</small>
            </div>
            <span className="warning">!</span>
          </div>

          <div className="analysis-item">
            <span>🏫</span>
            <div>
              <strong>Infrastructure</strong>
              <small>Under Review</small>
            </div>
            <span className="pending">•</span>
          </div>

          <div className="progress-section">
            <div className="progress-text">
              <span>Complaint Analysis</span>
              <span>85%</span>
            </div>

            <div className="progress-bar">
              <div className="progress"></div>
            </div>
          </div>

        </div>
      </section>

      {/* Features */}
      <section className="features">

        <div className="feature">
          <div className="feature-icon">🤖</div>
          <h3>AI Analysis</h3>
          <p>
            Complaints are automatically analyzed and categorized.
          </p>
        </div>

        <div className="feature">
          <div className="feature-icon">⚡</div>
          <h3>Quick Submission</h3>
          <p>
            Submit your complaint in just a few simple steps.
          </p>
        </div>

        <div className="feature">
          <div className="feature-icon">📊</div>
          <h3>Track Status</h3>
          <p>
            Keep track of your complaint from submission to resolution.
          </p>
        </div>

        <div className="feature">
          <div className="feature-icon">🔒</div>
          <h3>Privacy</h3>
          <p>
            Student information remains protected and secure.
          </p>
        </div>

      </section>

      {/* Footer */}
      <footer>
        <p>
          © 2026 College Complaint Analyzer | AI-Powered Student Support
        </p>
      </footer>

    </div>
  );
}

export default Welcome;