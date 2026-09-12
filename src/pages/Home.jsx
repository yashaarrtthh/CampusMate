import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import ResourceCard from "../components/ResourceCard";
import SearchBar from "../components/SearchBar";

function Home() {

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    fetchResources();
  }, []);

  async function fetchResources() {

    setLoading(true);

    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setError(error.message);
    } else {
      setResources(data);
    }

    setLoading(false);
  } 

  const filteredResources = resources.filter((resource) => {

  const matchesSearch =
    resource.name
      .toLowerCase()
      .includes(search.toLowerCase()) ||
    resource.description
      .toLowerCase()
      .includes(search.toLowerCase());

  const matchesCategory =
    category === "All" ||
    resource.category === category;

  return matchesSearch && matchesCategory;
});

  return (
    <main className="home">
        <section className="hero">

  <h1>
    Find everything you need on campus.
  </h1>

  <p>
    Discover clubs, facilities, services and other
    useful campus resources in one place.
  </p>

  <SearchBar
    search={search}
    setSearch={setSearch}
  />

  <div className="category-filters">

    {[
      "All",
      "Academic",
      "Clubs",
      "Sports",
      "Food",
      "Facilities"
    ].map((item) => (

      <button
        key={item}
        className={category === item ? "active" : ""}
        onClick={() => setCategory(item)}
      >
        {item}
      </button>

    ))}

  </div>

</section>

      <section className="resources-section">

        <h2>
          Campus Resources
        </h2>

        {loading && (
          <p>Loading resources...</p>
        )}

        {error && (
          <p>
            Error: {error}
          </p>
        )}

            {!loading &&
    !error &&
    filteredResources.length === 0 && (
        <p>
        No resources found.
        </p>
    )}

        <div className="resource-grid">

  {filteredResources.map((resource) => (
    <ResourceCard
      key={resource.id}
      resource={resource}
    />
  ))}

</div>

      </section>

    </main>
  );
}

export default Home;