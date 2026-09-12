import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

function ResourceCard({ resource, showActions = false, onDelete }) {

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

        <span>
          📍 {resource.location}
        </span>

        <span>
          🕒 {resource.timing}
        </span>

      </div>

      {resource.contact && (
        <p className="resource-contact">
          Contact: {resource.contact}
        </p>
      )}

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