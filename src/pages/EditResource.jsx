import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

function EditResource() {

  const { id } = useParams();
  const { user } = useAuth();

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Academic");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [timing, setTiming] = useState("");
  const [contact, setContact] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {

    if (user) {
      fetchResource();
    }

  }, [user, id]);

  async function fetchResource() {

    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .eq("id", id)
      .eq("created_by", user.id)
      .single();

    if (error) {

      console.error(error);
      setError("Resource not found or you don't have permission.");

    } else {

      setName(data.name);
      setCategory(data.category);
      setDescription(data.description);
      setLocation(data.location);
      setTiming(data.timing);
      setContact(data.contact || "");

    }

    setLoading(false);
  }

  async function handleUpdate(e) {

    e.preventDefault();

    setSaving(true);
    setError("");
    if (name.trim().length < 3) {
  setError("Resource name must be at least 3 characters.");
  setSaving(false);
  return;
}

if (description.trim().length < 10) {
  setError("Description must be at least 10 characters.");
  setSaving(false);
  return;
}

    const { error } = await supabase
      .from("resources")
      .update({
        name,
        category,
        description,
        location,
        timing,
        contact,
      })
      .eq("id", id)
      .eq("created_by", user.id);

    if (error) {

      console.error(error);
      setError(error.message);
      setSaving(false);
      return;

    }

    navigate("/dashboard");
  }

  if (loading) {
    return (
      <main className="auth-page">
        <p>Loading resource...</p>
      </main>
    );
  }

  return (
    <main className="auth-page">

      <div className="auth-card">

        <h1>
          Edit resource
        </h1>

        <p>
          Update the information about this resource.
        </p>

        <form onSubmit={handleUpdate}>

          <label>
            Resource name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>
            Category
          </label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Academic">Academic</option>
            <option value="Clubs">Clubs</option>
            <option value="Sports">Sports</option>
            <option value="Food">Food</option>
            <option value="Facilities">Facilities</option>
          </select>

          <label>
            Description
          </label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <label>
            Location
          </label>

          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />

          <label>
            Timing
          </label>

          <input
            type="text"
            value={timing}
            onChange={(e) => setTiming(e.target.value)}
            required
          />

          <label>
            Contact
          </label>

          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />

          <button
            type="submit"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

        </form>

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

      </div>

    </main>
  );
}

export default EditResource;