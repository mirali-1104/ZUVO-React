import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/AdminQueries.css";

const AdminQueries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get("http://localhost:5000/api/contact-us/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setQueries(response.data);
    } catch (error) {
      console.error("Error fetching queries:", error);
      toast.error("Failed to fetch queries");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.put(
        `http://localhost:5000/api/contact-us/answer/${id}`,
        { answer },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Answer submitted successfully");
      setEditingId(null);
      setAnswer("");
      fetchQueries();
    } catch (error) {
      console.error("Error submitting answer:", error);
      toast.error("Failed to submit answer");
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="admin-queries">
      <h1>Customer Queries</h1>
      <div className="queries-list">
        {queries.map((query) => (
          <div key={query._id} className="query-card">
            <div className="query-header">
              <div>
                <strong>Email:</strong> {query.email}
              </div>
              <div>
                <strong>Submitted:</strong>{" "}
                {new Date(query.submittedAt).toLocaleString()}
              </div>
            </div>
            <div className="query-content">
              <strong>Query:</strong>
              <p>{query.query}</p>
            </div>
            <div className="query-answer">
              <strong>Answer:</strong>
              {editingId === query._id ? (
                <div className="answer-form">
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Enter your answer..."
                    rows="3"
                  />
                  <div className="answer-actions">
                    <button
                      onClick={() => handleAnswerSubmit(query._id)}
                      className="submit-answer"
                    >
                      Submit
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setAnswer("");
                      }}
                      className="cancel-answer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="answer-content">
                  <p>{query.answer || "No answer yet"}</p>
                  <button
                    onClick={() => {
                      setEditingId(query._id);
                      setAnswer(query.answer || "");
                    }}
                    className="edit-answer"
                  >
                    {query.answer ? "Edit Answer" : "Add Answer"}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminQueries; 