import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "../api";
import "./StudentDashboard.css";


function StudentDashboard() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/opportunities`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load opportunities");
        }
        return response.json();
      })
      .then((data) => setOpportunities(data))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="student-dashboard">
      <header className="dashboard-header">
        <h2>CareerConnect</h2>
        <Link to="/">Home</Link>
      </header>

      <main className="dashboard-content">
        <section className="welcome-section">
          <h1>Welcome, Student! 👋</h1>
          <p>Explore opportunities and take the next step in your career.</p>
        </section>

        <section className="dashboard-stats">
          <div className="stat-card">
            <h3>{opportunities.length}</h3>
            <p>Available Opportunities</p>
          </div>

          <div className="stat-card">
            <h3>0</h3>
            <p>Applications Submitted</p>
          </div>

          <div className="stat-card">
            <h3>0</h3>
            <p>Shortlisted</p>
          </div>
        </section>

        <section className="dashboard-opportunities">
          <h2>Latest Opportunities</h2>

          {loading && <p>Loading opportunities...</p>}

          {!loading && opportunities.length === 0 && (
            <p>No opportunities available right now.</p>
          )}

          <div className="dashboard-job-grid">
            {opportunities.map((job) => (
              <div className="dashboard-job-card" key={job._id}>
                <span>{job.domain}</span>
                <h3>{job.title}</h3>
                <p>{job.company}</p>
                <p>{job.location || "Location not specified"}</p>
                <Link to="/">View Details</Link>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default StudentDashboard;
