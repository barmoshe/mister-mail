import React, { useEffect, useState, useRef } from "react";
import { emailService } from "./../services/email.service.js";
import { useSearchParams } from "react-router-dom";
import {
  FaExpand,
  FaMinimize,
  FaCompress,
  FaLocationArrow,
} from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import GoogleMapReact from "google-map-react"; // Import Google Map React component

export function Compose({ handleSendEmail, onCloseCompose, handleSaveEmail }) {
  const [searchParams] = useSearchParams();
  const [viewState, setViewState] = useState("normal");
  const [email, setEmail] = useState(emailService.getEmptyEmailDraft());
  const [userLocation, setUserLocation] = useState(null); // State variable to hold user's location
  const [includeLocation, setIncludeLocation] = useState(false); // State variable to toggle user's location

  const emailRef = useRef("new");

  useEffect(() => {
    if (
      searchParams.get("compose") &&
      searchParams.get("compose") !== "new" &&
      searchParams.get("compose") !== email.id
    ) {
      loadEmail();
      emailRef.current = searchParams.get("compose");
    } else {
      if (searchParams.get("to") || searchParams.get("subject"))
        loadEmailFromSearchParams();
    }
  }, [searchParams.get("compose")]);

  // Function to load email
  async function loadEmail() {
    try {
      const loadedEmail = await emailService.getById(
        searchParams.get("compose")
      );
      setEmail(loadedEmail);
    } catch (err) {
      console.log("Error loading email:", err);
      onCloseCompose();
    }
  }

  // Function to load email from search params
  function loadEmailFromSearchParams() {
    setEmail({
      to: searchParams.get("to") || "",
      subject: searchParams.get("subject") || "",
      body: searchParams.get("body") || "",
    });
  }

  // Function to handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmail((prevEmail) => ({ ...prevEmail, [name]: value }));
    if (emailRef.current !== "pending")
      onSaveEmail({ ...email, [name]: value });
  };

  // Function to send email
  const onSendEmail = (e) => {
    e.preventDefault();
    handleSendEmail(email);
    setEmail(emailService.getEmptyEmailDraft());
  };

  // Function to save email
  async function onSaveEmail(email) {
    try {
      emailRef.current = "pending";
      const savedEmail = await handleSaveEmail(email, emailRef.current);
      setEmail((prevEmail) => ({ ...prevEmail, id: savedEmail.id }));
      emailRef.current = savedEmail.id;
      console.log("emailRef.current:", emailRef.current);
    } catch (error) {
      console.error("Error saving email:", error);
    }
  }

  // Function to get user's current location
  function getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }

  useEffect(() => {
    getUserLocation(); // Get user's location when component mounts
  }, []);

  const handleClose = () => {
    onCloseCompose();
  };

  const handleMinimize = () => {
    setViewState("minimized");
  };

  const handleMaximize = () => {
    if (viewState !== "normal") {
      setViewState("normal");
    } else {
      setViewState("fullscreen");
    }
  };

  const handleIncludeLocation = () => {
    setIncludeLocation(!includeLocation); // Toggle includeLocation state
  };

  return (
    <div className={`compose ${viewState}`}>
      <div className="compose-header">
        <div className="compose-header-actions">
          <button onClick={handleMinimize}>
            {viewState !== "minimized" && <FaMinimize />}
          </button>
          <button onClick={handleMaximize}>
            {viewState === "fullscreen" ? <FaCompress /> : <FaExpand />}
          </button>
          <button onClick={handleClose}>
            {" "}
            <IoClose />
          </button>
        </div>
      </div>
      <div className="compose-body">
        {viewState !== "minimized" && (
          <form className={`compose-form ${viewState}`} onSubmit={onSendEmail}>
            {/* Input fields for email */}
            <label htmlFor="to">To:</label>
            <input
              type="email"
              id="to"
              name="to"
              value={email.to}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="subject">Subject:</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={email.subject}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="body">Body:</label>
            <textarea
              id="body"
              name="body"
              value={email.body}
              onChange={handleInputChange}
              required
            ></textarea>
            {/* Checkbox for including user's location */}
            <div>
              <label htmlFor="includeLocation">
                Include My Location:
                <input
                  type="checkbox"
                  id="includeLocation"
                  name="includeLocation"
                  checked={includeLocation}
                  onChange={handleIncludeLocation}
                />
              </label>
            </div>
            {/* Map to display user's location if includeLocation is checked */}
            {includeLocation && (
              <div style={{ height: "200px", width: "100%" }}>
                <GoogleMapReact
                  bootstrapURLKeys={{
                    key: "AIzaSyAlpWHRRJs_uYLdJsqSwi4QDT7geImVQVs",
                  }}
                  center={userLocation} // Center the map at user's location
                  zoom={15}
                >
                  {/* Marker to show user's location */}
                  {userLocation && (
                    <Marker
                      lat={userLocation.lat}
                      lng={userLocation.lng}
                      text={<FaLocationArrow />}
                    />
                  )}
                </GoogleMapReact>
              </div>
            )}
            <button type="submit">Send</button>
          </form>
        )}
      </div>
    </div>
  );
}
// Marker component for displaying location on the map
const Marker = ({ text }) => (
  <div style={{ color: "red", fontSize: "2rem" }}>{text}</div>
);
