import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { emailService } from "../services/email.service";
import { Context } from "../App";
import GoogleMapReact from "google-map-react"; // Import Google Map React component
import { FaLocationArrow } from "react-icons/fa6";

export function EmailDetails() {
  const [email, setEmail] = useState(null);
  const params = useParams();
  const navigate = useNavigate();
  const [unreadInbox, setUnreadInbox] = useContext(Context);

  useEffect(() => {
    loadEmail();
  }, [params.emailId]);

  async function loadEmail() {
    try {
      const email = await emailService.getById(params.emailId);
      setEmail(email);
      // Mark email as read and update unread count
      email.isRead = true;
      await emailService.save(email);
      updateUnreadInbox();
    } catch (err) {
      navigate(-1);
      console.error("Error in loadEmail", err);
    }
  }

  async function updateUnreadInbox() {
    const unreadCount = await emailService.countUnreadEmails();
    setUnreadInbox(unreadCount);
  }

  const handleBack = () => {
    navigate(-1);
  };

  if (!email) return <div>Loading..</div>;

  return (
    <section className="email-details">
      <header className="email-details-header">
        <h1>{email.subject}</h1>
        <div className="email-meta">
          <p>
            <strong>Sent At:</strong> {new Date(email.sentAt).toLocaleString()}
          </p>
          <p>
            <strong>From:</strong> {email.from}
          </p>
        </div>
      </header>
      <div className="email-details-content">
        <div className="email-body">
          <p>{email.body}</p>
          <p>{email.isDraft && <span className="draft">Draft</span>}</p>
          <div className="email-status">
            <p>
              <strong>Email ID:</strong> {email.id}
            </p>
            <p>
              <strong>Status:</strong> {email.isRead ? "Read" : "Unread"}
            </p>
            <p>
              <strong>Starred:</strong> {email.isStarred ? "Yes" : "No"}
            </p>
            <p>
              <strong>Removed:</strong> {email.removedAt ? "Yes" : "No"}
            </p>
            {email.lat && email.lng && (
              <div style={{ height: "200px", width: "100%" }}>
                <GoogleMapReact
                  bootstrapURLKeys={{
                    key: "AIzaSyAlpWHRRJs_uYLdJsqSwi4QDT7geImVQVs",
                  }}
                  center={{ lat: email.lat, lng: email.lng }} // Center the map at email's location
                  zoom={15}
                >
                  {/* Marker to show email's location */}
                  <Marker
                    lat={email.lat}
                    lng={email.lng}
                    text={<FaLocationArrow />}
                  />
                </GoogleMapReact>
              </div>
            )}
          </div>
        </div>
      </div>
      <footer className="email-details-footer">
        <button onClick={handleBack}>Back</button>
      </footer>
    </section>
  );
}

// Marker component for displaying location on the map
const Marker = ({ text }) => (
  <div style={{ color: "red", fontSize: "2rem" }}>{text}</div>
);
