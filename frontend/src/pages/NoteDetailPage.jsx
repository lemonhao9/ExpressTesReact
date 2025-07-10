import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { ArrowLeftIcon, LoaderIcon, Trash2Icon } from "lucide-react";

const NoteDetailPage = () => {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        setNote(res.data);
      } catch (error) {
        console.log("Impossible de récuperer la note", error);
        toast.error("Impossible de récuperer la note");
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Veux-tu vraiment effacer cette note ?")) return;

    try {
      await api.delete(`/notes/${id}`);
      toast.success("Note supprimée");
      navigate("/");
    } catch (error) {
      console.log("erreur de suppression", error);
      toast.error("Suppression de la note échouée");
    }
  };


  const handleSave = async () => {
    if (!note.title.trim() || !note.content.trim()) {
      toast.error("Tout les champs sont requis");
      return;
    }
    setSaving(true);

    try {
      await api.put(`/notes/${id}`, note);
      toast.success("Note modifiée !");
      navigate("/");
    } catch (error) {
      console.log("La modification n'a pas marchée", error);
      toast.error("Quelque chose ne c'est pas passé comme prévu");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <LoaderIcon className="animate-spin size-10" />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="btn btn-ghost">
              <ArrowLeftIcon className="h-5 w-5" />
              Retour aux notes
            </Link>
            <button onClick={handleDelete} className="btn btn-error btn-outline">
              <Trash2Icon className="h-5 w-5" />
              Supprimer la note
            </button>
          </div>
          <div className="card bg-base-100">
            <div className="card-body">
              <div className="form-control mb-4">
                <label htmlFor="Titre" className="label">
                  <span className="label-text">Titre</span>
                </label>
                <input
                  type="text"
                  placeholder="Titre de la note"
                  className="input input-bordered"
                  value={note.title}
                  onChange={(e) => setNote({ ...note, title: e.target.value })}
                />
              </div>


              <div className="form-control mb-4">
                <label htmlFor="contenu" className="label">
                  <span className="label-text">Contenu</span>
                </label>
                <textarea
                  placeholder="Rédiges ta note ici..."
                  className="textarea textarea-bordered h-32"
                  value={note.content}
                  onChange={(e) => setNote({ ...note, content: e.target.value })}
                />
              </div>

              <div className="card-actions justify-end">
                <button className="btn btn-primary" disabled={saving} onClick={handleSave}>
                  {saving ? "Enregistrer" : "Enregistrer les changements"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteDetailPage;
