import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

function ResourceCard({ resource, showActions = false, onDelete }) {
  const { user } = useAuth();

  const [isFavourite, setIsFavourite] = useState(false);
  const [favouriteLoading, setFavouriteLoading] = useState(false);

  useEffect(() => {
    async function checkFavourite() {
      if (!user || !resource?.id) {
        return;
      }

      const { data, error } = await supabase
        .from("favourites")
        .select("id")
        .eq("user_id", user.id)
        .eq("resource_id", resource.id)
        .maybeSingle();

      if (error) {
        console.error("Favourite check error:", error);
        return;
      }

      setIsFavourite(!!data);
    }

    checkFavourite();
  }, [user, resource?.id]);

  async function toggleFavourite() {
    if (!user) {
      alert("Please login to favourite resources.");
      return;
    }

    setFavouriteLoading(true);

    if (isFavourite) {
      const { error } = await supabase
        .from("favourites")
        .delete()
        .eq("user_id", user.id)
        .eq("resource_id", resource.id);

      if (error) {
        console.error("Remove favourite error:", error);
        alert(error.message);
      } else {
        setIsFavourite(false);
      }
    } else {
      const { error } = await supabase
        .from("favourites")
        .insert({
          user_id: user.id,
          resource_id: resource.id,
        });

      if (error) {
        console.error("Add favourite error:", error);
        alert(error.message);
      } else {
        setIsFavourite(true);
      }
    }

    setFavouriteLoading(false);
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this resource?"
    );

    if (!confirmed) {
      return;
    }

    const { error } = await supabase
      .from("resources")
      .delete()
      .eq("id", resource.id);

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    if (onDelete) {
      onDelete(resource.id);
    }
  }

  return (
    <div className="resource-card">

      <div className="resource-category">
        {resource.category}
      </div>

      <h3>
        <Link to={`/resource/${resource.id}`}>
          {resource.name}
        </Link>
      </h3>

      <p>
        {resource.description}
      </p>

      <div className="resource-info">
        <span>📍 {resource.location}</span>
        <span>🕒 {resource.timing}</span>
      </div>

      {resource.contact && (
        <p className="resource-contact">
          Contact: {resource.contact}
        </p>
      )}

      <button
        type="button"
        onClick={toggleFavourite}
        disabled={favouriteLoading}
        className="favourite-button"
      >
        {favouriteLoading ? "..." : isFavourite ? "❤️" : "🤍"}
      </button>

      {showActions && (
        <div className="resource-actions">

          <Link
            to={`/edit-resource/${resource.id}`}
            className="edit-button"
          >
            Edit
          </Link>

          <button
            onClick={handleDelete}
            className="delete-button"
          >
            Delete
          </button>

        </div>
      )}

    </div>
  );
}

export default ResourceCard;