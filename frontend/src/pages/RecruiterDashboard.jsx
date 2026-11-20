import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "../api";
import "./RecruiterDashboard.css";


function RecruiterDashboard() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    title: "",
    company: "",
    domain: "",
    type: "Internship",
    location: "",
    description: "",
    applicationLink: "",
  });

  const fetchOpportunities = async () => {
    try {
      const response = await fetch(
    `${API_URL}/api/opportunities`
      );

      if (!response.ok) {
        throw new Error("Could not load opportunities");
      }

      const data = await response.json();
      setOpportunities(data);
    } catch (error) {
      setMessage("Unable to load opportunities.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/api/opportunities`,
        {
          method: "POST",
          headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${sessionStorage.getItem("token")}`,
       },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add opportunity");
      }

      setMessage("Opportunity added successfully!");

      setForm({
        title: "",
        company: "",
        domain: "",
        type: "Internship",
        location: "",
        description: "",
        applicationLink: "",
      });

      fetchOpportunities();
    } catch (error) {
      setMessage(error.message || "Something went wrong.");
    }
  };

  return (
    <div className="recruiter-dashboard">
      <header className="recruiter-header">
        <h2>CareerConnect</h2>
        <Link to="/">Home</Link>
      </header>

      <main className="recruiter-content">
        <section className="recruiter-welcome">
          <h1>Recruiter Dashboard 👋</h1>
          <p>Manage and publish your job opportunities.</p>
        </section>

        <section className="recruiter-stats">
          <div className="recruiter-stat-card">
            <h2>{opportunities.length}</h2>
            <p>Total Opportunities</p>
          </div>
        </section>

        <section className="add-opportunity-section">
          <h2>Add New Opportunity</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="title"
              placeholder="Job / Internship Title"
              value={form.title}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="company"
              placeholder="Company Name"
              value={form.company}
              onChange={handleChange}
              required
            />

            <select
              name="domain"
              value={form.domain}
              onChange={handleChange}
              required
            >
              <option value="">Select Domain</option>
              <option value="Web Development">Web Development</option>
              <option value="Software Development">Software Development</option>
              <option value="Python">Python</option>
              <option value="Data Science">Data Science</option>
              <option value="Data Analytics">Data Analytics</option>
            </select>

            <select
              name="type"
              value={form.type}
              onChange={handleChange}
            >
              <option value="Internship">Internship</option>
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
            </select>

            <input
              type="text"
              name="location"
              placeholder="Location"
              value={form.location}
              onChange={handleChange}
            />

            <textarea
              name="description"
              placeholder="Opportunity Description"
              value={form.description}
              onChange={handleChange}
              required
            />

            <input
              type="url"
              name="applicationLink"
              placeholder="Application Link (https://...)"
              value={form.applicationLink}
              onChange={handleChange}
            />

            <button type="submit">Add Opportunity</button>
          </form>

          {message && <p className="recruiter-message">{message}</p>}
        </section>

        <section className="recruiter-list">
          <h2>Published Opportunities</h2>

          {loading && <p>Loading...</p>}

          {!loading && opportunities.map((job) => (
            <div className="published-job" key={job._id}>
              <h3>{job.title}</h3>
              <p>{job.company} | {job.domain}</p>
              <p>{job.type || "Internship"}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

export default RecruiterDashboard;
