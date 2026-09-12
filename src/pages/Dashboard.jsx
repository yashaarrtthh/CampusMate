import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import ResourceCard from "../components/ResourceCard";

function Dashboard() {

  const { user, loading: authLoading } = useAuth();

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {

    if (!authLoading && !user) {
      navigate("/login");
    }

  }, [user, authLoading, navigate]);

  useEffect(() => {

    if (user) {
      fetchMyResources();
    }

  }, [user]);

  async function fetchMyResources() {

    setLoading(true);

    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .eq("created_by", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setResources(data);
    }

    setLoading(false);
  }

  if (authLoading) {
    return <p>Checking authentication...</p>;
  }

  if (!user) {
    return null;
  }

  return (
    <main className="dashboard">

      <section className="dashboard-header">

        <div>
          <p className="dashboard-label">
            Dashboard
          </p>

          <h1>
            Welcome back
          </h1>

          <p>
            {user.email}
          </p>
        </div>

        <Link
          to="/add-resource"
          className="add-resource-button"
        >
          + Add Resource
        </Link>

      </section>

      <section className="my-resources">

  <div className="dashboard-stats">

    <div className="stat-card">
      <span>Total Resources</span>
      <strong>{resources.length}</strong>
    </div>

    <div className="stat-card">
      <span>Account</span>
      <strong>Active</strong>
    </div>

  </div>

  <h2>
    My Resources
  </h2>

        {loading && (
          <p>Loading your resources...</p>
        )}

        {!loading && resources.length === 0 && (
  <div className="empty-state">

    <h3>No resources yet</h3>

    <p>
      Start by adding your first campus resource.
    </p>

    <Link to="/add-resource">
      Add your first resource
    </Link>

  </div>
)}

        <div className="resource-grid">

          {resources.map((resource) => (

            <ResourceCard
              key={resource.id}
              resource={resource}
              showActions={true}
              onDelete={(deletedId) => {
                setResources((currentResources) =>
                  currentResources.filter(
                    (item) => item.id !== deletedId
                  )
                );
              }}
            />

          ))}

        </div>

      </section>

    </main>
  );
}

export default Dashboard;