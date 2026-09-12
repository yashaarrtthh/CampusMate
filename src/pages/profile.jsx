import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (!error && data) {
        setProfile(data);
        setFullName(data.full_name || "");
        setUsername(data.username || "");
        setBio(data.bio || "");
      }

      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  const saveProfile = async (e) => {
    e.preventDefault();

    if (!user) return;

    setSaving(true);

    const { data, error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        full_name: fullName.trim(),
        username: username.trim(),
        bio: bio.trim(),
      })
      .select()
      .single();

    if (error) {
      alert(error.message);
    } else {
      setProfile(data);
      alert("Profile updated successfully.");
    }

    setSaving(false);
  };

  if (loading) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="page-container">
      <h1>My Profile</h1>

      <div className="profile-header">
        <div className="profile-avatar">
          👤
        </div>

        <div>
          <h2>{fullName || "CampusMate User"}</h2>
          <p>CampusMate Member</p>
        </div>
      </div>

      <form onSubmit={saveProfile} className="profile-form">
        <label>Full Name</label>

        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Your full name"
        />

        <label>Username</label>

        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="username"
        />

        <label>Bio</label>

        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell us about yourself..."
          rows="4"
        />

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}

export default Profile;