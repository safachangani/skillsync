import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../axios";
import "./profile-details.css";
import Navbar from "../components/navbar/Navbar";

const ProfileDetail = () => {
  const location = useLocation();
  const id = location.state?.profileId;
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    console.log(id);
    
    if (!id) return;
    axios
      .get(`/profile-visit/${id}`)
      .then((res) => {
        console.log(res);
        
        setProfile(res.data);
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (!profile) return <p>Loading profile…</p>;

  return (
    <>
    <Navbar/>
    <div className="full-profile-container">
      <div className="profile-card">
        <div className="banner" />


        <div className="profile-info">
        <img
          className="profile-avatar-large"
          src={`https://skillsync-backend-xiwx.onrender.com/skillsync/uploads/${profile.filename}`}
          alt={profile.username}
        />
          {profile.fullName && <p className="full-name">{profile.fullName}</p>}
          <h2 className="username">{profile.username}</h2>
          {profile.location && (
            <p className="location">📍 {profile.location}</p>
          )}

          {profile.bio && <p className="about">{profile.bio}</p>}

          {profile.skills?.length > 0 && (
            <div className="skills-section">
              <h4>Skills:</h4>
              <div className="skill-tags">
                {profile.skills.map((skillObj, i) => (
                  <span key={i} className="skill-tag">
                    #{skillObj.name} <small>({skillObj.level})</small>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="contact-section">
            {profile.email && <p>Email: {profile.email}</p>}
            {profile.phone && <p>Phone: {profile.phone}</p>}
            {profile.linkedinURL && (
              <p>
                LinkedIn:{" "}
                <a
                  href={profile.linkedinURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  >
                  {profile.linkedinURL}
                </a>
              </p>
            )}
            {profile.githubURL && (
              <p>
                GitHub:{" "}
                <a
                  href={profile.githubURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  >
                  {profile.githubURL}
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  </>
  );
};

export default ProfileDetail;
