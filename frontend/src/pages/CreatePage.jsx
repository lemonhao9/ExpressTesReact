import { ArrowLeftIcon } from "lucide-react";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import api from "../lib/axios";

const CreatePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError(null);

      if (!title.trim()) {
        setError("Le titre est requis.");
        toast.error("Le titre est requis.");
        return;
      }
      if (!content.trim()) {
        setError("Le contenu est requis.");
        toast.error("Le contenu est requis.");
        return;
      }

      setLoading(true);
      try {
        await api.post("/notes", { title, content });
        toast.success("Note créée avec succès !");
        navigate("/");
      } catch (error) {
        console.error("Erreur lors de la création de la note :", error);
        if (error.response?.status === 429) {
          toast.error("Trop de requêtes ! Veuillez ralentir.", {
            duration: 4000,
            icon: "💀",
          });
        } else {
          toast.error(error.response?.data?.message || "Échec lors de la création de la note.");
        }
      } finally {
        setLoading(false);
      }
    },
    [title, content, navigate]
  );

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link to="/" className="btn btn-ghost mb-6">
            <ArrowLeftIcon className="size-5" />
            Retour aux notes
          </Link>

          <div className="card bg-base-100">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">Créer une nouvelle note</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-control mb-4">
                  <label htmlFor="title" className="label">
                    <span className="label-text">Titre</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    placeholder="Titre de la note"
                    className="input input-bordered"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    aria-describedby={error && !title.trim() ? "title-error" : undefined}
                  />
                  {error && !title.trim() && (
                    <span id="title-error" className="text-red-500 text-sm mt-1">
                      {error}
                    </span>
                  )}
                </div>

                <div className="form-control mb-4">
                  <label htmlFor="content" className="label">
                    <span className="label-text">Contenu</span>
                  </label>
                  <textarea
                    id="content"
                    placeholder="Rédigez le contenu de la note ici..."
                    className="textarea textarea-bordered h-32"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    aria-describedby={error && !content.trim() ? "content-error" : undefined}
                  />
                  {error && !content.trim() && (
                    <span id="content-error" className="text-red-500 text-sm mt-1">
                      {error}
                    </span>
                  )}
                </div>

                <div className="card-actions justify-end">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "En cours de création..." : "Créer une note"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;