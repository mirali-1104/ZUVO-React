import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/QueryPage.css";

const QueryPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    query: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userQueries, setUserQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("new"); // 'new' or 'history'
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = JSON.parse(localStorage.getItem("user"));
    
    if (token && userData?.email) {
      setIsAuthenticated(true);
      setFormData(prev => ({ ...prev, email: userData.email }));
      fetchUserQueries();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserQueries = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const userData = JSON.parse(localStorage.getItem("user"));
      
      if (!token || !userData?.email) {
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `http://localhost:5000/api/contact-us/user/${userData.email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUserQueries(response.data);
    } catch (error) {
      console.error("Error fetching user queries:", error);
      toast.error(error.response?.data?.message || "Failed to fetch your queries");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("authToken");
      const userData = JSON.parse(localStorage.getItem("user"));
      
      // Use logged-in user's email if available
      const email = userData?.email || formData.email;

      if (!email || !formData.query) {
        toast.error("Please fill in all required fields");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/contact-us/submit",
        { email, query: formData.query },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Query submitted successfully!");
        setFormData({
          email: "",
          query: "",
        });
        fetchUserQueries(); // Refresh the queries list
        setActiveTab("history"); // Switch to history tab
      }
    } catch (error) {
      console.error("Error submitting query:", error);
      toast.error(
        error.response?.data?.message || "Failed to submit query. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="query-page">
        <div className="query-container">
          <h1>Contact Us</h1>
          <p className="subtitle">
            Please log in to submit queries or view your query history.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="query-page">
      <div className="query-container">
        <h1>Contact Us</h1>
        <p className="subtitle">
          Have questions or concerns? We're here to help! Submit your query and we'll get back to you as soon as possible.
        </p>

        <div className="tabs">
          <button
            className={`tab-button ${activeTab === "new" ? "active" : ""}`}
            onClick={() => setActiveTab("new")}
          >
            Submit New Query
          </button>
          <button
            className={`tab-button ${activeTab === "history" ? "active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            Query History
          </button>
        </div>

        {activeTab === "new" ? (
          <form onSubmit={handleSubmit} className="query-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                disabled={isAuthenticated}
              />
            </div>

            <div className="form-group">
              <label htmlFor="query">Your Query</label>
              <textarea
                id="query"
                name="query"
                value={formData.query}
                onChange={handleChange}
                required
                placeholder="Please describe your query in detail"
                rows="6"
              />
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Query"}
            </button>
          </form>
        ) : (
          <div className="queries-history">
            {loading ? (
              <div className="loading">Loading your queries...</div>
            ) : userQueries.length === 0 ? (
              <div className="no-queries">
                <p>You haven't submitted any queries yet.</p>
                <button
                  className="submit-new-button"
                  onClick={() => setActiveTab("new")}
                >
                  Submit New Query
                </button>
              </div>
            ) : (
              <div className="queries-list">
                {userQueries.map((query) => (
                  <div key={query._id} className="query-card">
                    <div className="query-header">
                      <div>
                        <strong>Submitted:</strong>{" "}
                        {new Date(query.submittedAt).toLocaleString()}
                      </div>
                      <div className={`status ${query.answer ? "answered" : "pending"}`}>
                        {query.answer ? "Answered" : "Pending"}
                      </div>
                    </div>
                    <div className="query-content">
                      <strong>Your Query:</strong>
                      <p>{query.query}</p>
                    </div>
                    {query.answer && (
                      <div className="query-answer">
                        <strong>Our Response:</strong>
                        <p>{query.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QueryPage; 