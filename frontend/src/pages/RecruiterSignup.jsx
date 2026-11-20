
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./RecruiterSignup.css";

function RecruiterSignup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: "",
    recruiterName: "",
    email: "",
    phone: "",
    website: "",
    description: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    if (formData.password.length < 8) {
      setMessage("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            companyName: formData.companyName,
            recruiterName: formData.recruiterName,
            email: formData.email,
            phone: formData.phone,
            website: formData.website,
            description: formData.description,
            password: formData.password,
            role: "recruiter",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Recruiter signup failed.");
      }

      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("user", JSON.stringify(data.user));

      setMessage("Recruiter account created successfully!");

      setTimeout(() => {
        navigate("/recruiter-dashboard");
      }, 1000);
    } catch (error) {
      setMessage(error.message || "Unable to connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="recruiter-container">
      <div className="recruiter-card">
        <h1>Recruiter Sign Up</h1>
        <p>Create your company account on CareerConnect</p>

        <form onSubmit={handleSubmit}>
          <label>Company Name</label>
          <input
            type="text"
            name="companyName"
            placeholder="Enter company name"
            value={formData.companyName}
            onChange={handleChange}
            required
          />

          <label>Recruiter Name</label>
          <input
            type="text"
            name="recruiterName"
            placeholder="Enter your name"
            value={formData.recruiterName}
            onChange={handleChange}
            required
          />

          <label>Official Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter official email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Phone Number</label>
          <input
            type="tel"
            name="phone"
            placeholder="Enter phone number"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <label>Company Website</label>
          <input
            type="url"
            name="website"
            placeholder="https://example.com"
            value={formData.website}
            onChange={handleChange}
          />

          <label>Company Description</label>
          <textarea
            name="description"
            placeholder="Tell us about your company"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Create password"
            value={formData.password}
            onChange={handleChange}
            minLength="8"
            required
          />

          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            minLength="8"
            required
          />

          {message && <p role="status">{message}</p>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Create Recruiter Account"}
          </button>
        </form>

        <p className="login-text">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default RecruiterSignup;
