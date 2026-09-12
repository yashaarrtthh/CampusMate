import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

function ResourceDetails() {

  const { id } = useParams();

  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchResource();
  }, [id]);

  async function fetchResource() {

    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      setError("Resource not found.");
    } else {
      setResource(data);
    }

    setLoading(false);
  }

  if (loading) {
    return <main className="details-page">Loading...</main>;
  }

  if (error) {
    return <main className="details-page">{error}</main>;
  }

  return (
    <main className="details-page">

      <Link to="/" className="back-link">
        ← Back
      </Link>

      <div className="details-card">

        <span className="resource-category">
          {resource.category}
        </span>

        <h1>{resource.name}</h1>

        <p className="details-description">
          {resource.description}
        </p>

        <div className="details-info">
          <p>📍 {resource.location}</p>
          <p>🕒 {resource.timing}</p>

          {resource.contact && (
            <p>📞 {resource.contact}</p>
          )}
        </div>

      </div>

    </main>
  );
}

export default ResourceDetails;