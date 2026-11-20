import RecruiterDashboard from "./pages/RecruiterDashboard.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import StudentSignup from "./pages/StudentSignup.jsx";
import RecruiterSignup from "./pages/RecruiterSignup.jsx";
import Login from "./pages/Login.jsx";
import "./App.css";

function HomePage() {
  const [opportunities, setOpportunities] = useState([]);
  const [search, setSearch] = useState("");
  const [domain, setDomain] = useState("All Domains");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchOpportunities() {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();

        if (search.trim()) {
          params.set("search", search.trim());
        }

        if (domain !== "All Domains") {
          params.set("domain", domain);
        }

        const response = await fetch(
          `http://localhost:5000/api/opportunities?${params}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch opportunities");
        }

        const data = await response.json();
        setOpportunities(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(
            "Unable to load opportunities. Please check that the backend is running."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchOpportunities();

    return () => controller.abort();
  }, [search, domain]);

  return (
    <div className="app">
      <header className="navbar">
        <h2>CareerConnect</h2>

        <span>Find your next opportunity</span>

        <nav>
          <Link to="/student-signup">Student Signup</Link>
          {" | "}
          <Link to="/recruiter-signup">Recruiter Signup</Link>
        </nav>
      </header>

      <main className="container">
        <section className="hero">
          <p className="eyebrow">YOUR CAREER STARTS HERE</p>

          <h1>
            Find internships &amp; jobs
            <br />
            that move you forward.
          </h1>

          <p>
            Explore opportunities, learn new skills, and build your future.
          </p>
        </section>

        <section className="filters">
          <input
            type="text"
            placeholder="Search by role, company or domain..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          >
            <option>All Domains</option>
            <option>Web Development</option>
            <option>Software Development</option>
            <option>Data Science</option>
            <option>Python</option>
            <option>Data Analytics</option>
          </select>
        </section>

        <div className="section-heading">
          <h2>Latest Opportunities</h2>
          <span>{opportunities.length} opportunities</span>
        </div>

        {loading && <p>Loading opportunities...</p>}

        {error && <p role="alert">{error}</p>}

        {!loading && !error && (
          <section className="job-grid">
            {opportunities.map((job) => (
              <article className="job-card" key={job._id}>
                <span className="tag">{job.domain}</span>

                <h3>{job.title}</h3>

                <p className="company">{job.company}</p>

                <p>📍 {job.location || "Not specified"}</p>

                <p>
                  Experience: {job.experience || "Not specified"}
                </p>

                <p className="description">
                  {job.description ||
                    "Explore this opportunity and learn new skills."}
                </p>

                <button onClick={() => setSelected(job)}>
                  View Details
                </button>
              </article>
            ))}

            {opportunities.length === 0 && (
              <p>No opportunities found. Try another search.</p>
            )}
          </section>
        )}
      </main>

      {selected && (
        <div
          className="modal-backdrop"
          onClick={() => setSelected(null)}
        >
          <section
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close"
              onClick={() => setSelected(null)}
              aria-label="Close details"
            >
              ✕
            </button>

            <span className="tag">{selected.domain}</span>

            <h2>{selected.title}</h2>

            <p className="company">{selected.company}</p>

            <p>
              {selected.description || "No description available."}
            </p>

            <p>Location: {selected.location || "Not specified"}</p>

            <p>
              Experience: {selected.experience || "Not specified"}
            </p>

            <p>
              Application link: {selected.applicationLink || "Not provided"}
            </p>

            <button
              onClick={() =>
                alert("Application feature coming soon!")
              }
            >
              Apply Now
            </button>
          </section>
        </div>
      )}

      <footer>
        © 2026 CareerConnect | Internship &amp; Job Listing Portal
      </footer>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route
        path="/student-signup"
        element={<StudentSignup />}
      />

      <Route
        path="/recruiter-signup"
        element={<RecruiterSignup />}
      />

      <Route
        path="*"
        element={<h2>Page not found</h2>}
      />
      <Route path="/login" element={<Login />} />
      <Route
  path="/student-dashboard"
  element={<StudentDashboard />}
/>
<Route
  path="/recruiter-dashboard"
  element={<RecruiterDashboard />}
/>
    </Routes>
  );
}

export default App;
