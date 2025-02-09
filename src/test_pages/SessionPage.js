import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SessionsPage = () => {
  const [sessions, setSessions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get("http://localhost:5000/auth/sessions", {
          withCredentials: true,
        });
        setSessions(response.data);
      } catch (error) {
        console.error("Error fetching sessions", error);
      }
    };

    fetchSessions();
  }, []);

  const handleDeleteSession = async (sessionId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/auth/sessions/${sessionId}`, {
        withCredentials: true,
      });

      if (response.data.logout) {
        navigate("/login");
      } else {
        setSessions(sessions.filter((session) => session.id !== sessionId));
      }
    } catch (error) {
      console.error("Error deleting session", error);
    }
  };

  return (
    <div>
      <h2>Your Active Sessions</h2>
      {sessions.length === 0 ? (
        <p>No active sessions.</p>
      ) : (
        <ul>
          {sessions.map((session) => (
            <li key={session.id}>
              <strong>Device:</strong> {session.device} | <strong>Browser:</strong> {session.browser} |  
              <strong>IP:</strong> {session.ip_address} | <strong>Time:</strong> {new Date(session.login_time).toLocaleString()}
              <button onClick={() => handleDeleteSession(session.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SessionsPage;
