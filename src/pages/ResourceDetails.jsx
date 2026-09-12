import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

function ResourceDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    async function fetchResource() {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
        setError("Resource not found.");
      } else {
        setResource(data);
      }

      setLoading(false);
    }

    fetchResource();
  }, [id]);

  useEffect(() => {
    async function fetchReviews() {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("resource_id", id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Reviews error:", error);
        return;
      }

      setReviews(data || []);
    }

    if (id) {
      fetchReviews();
    }
  }, [id]);

  async function submitReview(e) {
    e.preventDefault();

    if (!user) {
      alert("Please login to write a review.");
      return;
    }

    if (comment.trim().length < 3) {
      alert("Review must be at least 3 characters.");
      return;
    }

    setReviewLoading(true);

    const { data, error } = await supabase
      .from("reviews")
      .insert({
        user_id: user.id,
        resource_id: id,
        rating: rating,
        comment: comment.trim(),
      })
      .select()
      .single();

    if (error) {
      console.error(error);

      if (error.code === "23505") {
        alert("You have already reviewed this resource.");
      } else {
        alert(error.message);
      }
    } else {
      setReviews((current) => [data, ...current]);
      setComment("");
      setRating(5);
    }

    setReviewLoading(false);
  }

  if (loading) {
    return (
      <main className="details-page">
        <p>Loading...</p>
      </main>
    );
  }

  if (error || !resource) {
    return (
      <main className="details-page">
        <p>{error || "Resource not found."}</p>
      </main>
    );
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

      <section className="reviews-section">

        <h2>Reviews & Ratings</h2>

        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map((review) => (
            <div className="review-card" key={review.id}>

              <div>
                {"⭐".repeat(review.rating)}
              </div>

              <p>{review.comment}</p>

              <small>
                {new Date(
                  review.created_at
                ).toLocaleDateString()}
              </small>

            </div>
          ))
        )}

        {user && (
          <form
            onSubmit={submitReview}
            className="review-form"
          >

            <h3>Write a review</h3>

            <label>Rating</label>

            <select
              value={rating}
              onChange={(e) =>
                setRating(Number(e.target.value))
              }
            >
              <option value={5}>⭐⭐⭐⭐⭐</option>
              <option value={4}>⭐⭐⭐⭐</option>
              <option value={3}>⭐⭐⭐</option>
              <option value={2}>⭐⭐</option>
              <option value={1}>⭐</option>
            </select>

            <textarea
              value={comment}
              onChange={(e) =>
                setComment(e.target.value)
              }
              placeholder="Write your review..."
              rows="4"
              required
            />

            <button
              type="submit"
              disabled={reviewLoading}
            >
              {reviewLoading
                ? "Submitting..."
                : "Submit Review"}
            </button>

          </form>
        )}

      </section>

    </main>
  );
}

export default ResourceDetails;