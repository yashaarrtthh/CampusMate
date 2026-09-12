import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

function AddResource() {

  const { user } = useAuth();

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Academic");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [timing, setTiming] = useState("");
  const [contact, setContact] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

  async function handleSubmit(e) {

    e.preventDefault();

    setLoading(true);
    setError("");
    if (name.trim().length < 3) {
  setError("Resource name must be at least 3 characters.");
  setLoading(false);
  return;
}

if (description.trim().length < 10) {
  setError("Description must be at least 10 characters.");
  setLoading(false);
  return;
}

    if (!user) {
      setError("You must be logged in.");
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("resources")
      .insert({
        name,
        category,
        description,
        location,
        timing,
        contact,
        created_by: user.id,
      });

    if (error) {

      console.error(error);
      setError(error.message);

    } else {

      navigate("/dashboard");

    }

    setLoading(false);
  }

  return (
    <main className="auth-page">

      <div className="auth-card">

        <h1>
          Add a resource
        </h1>

        <p>
          Share something useful with your campus community.
        </p>

        <form onSubmit={handleSubmit}>

          <label>
            Resource name
          </label>

          <input
            type="text"
            placeholder="e.g. Central Library"
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
            <option value="Academic">
              Academic
            </option>

            <option value="Clubs">
              Clubs
            </option>

            <option value="Sports">
              Sports
            </option>

            <option value="Food">
              Food
            </option>

            <option value="Facilities">
              Facilities
            </option>

          </select>

          <label>
            Description
          </label>

          <textarea
            placeholder="Describe this resource..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <label>
            Location
          </label>

          <input
            type="text"
            placeholder="e.g. Main Block"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />

          <label>
            Timing
          </label>

          <input
            type="text"
            placeholder="e.g. 8 AM - 10 PM"
            value={timing}
            onChange={(e) => setTiming(e.target.value)}
            required
          />

          <label>
            Contact
          </label>
          <div className="form-group">
  <label>Resource Image</label>

  <input
    type="file"
    accept="image/*"
    onChange={(e) => setImage(e.target.files[0])}
  />
</div>

          <input
            type="text"
            placeholder="Optional contact information"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Resource"}
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

export default AddResource;