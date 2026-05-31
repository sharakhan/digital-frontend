import { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AuthContext } from "../../providers/AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useUserRole from "../../hooks/useUserRole";

const categoryOptions = [
  "Mindset", "Finance", "Relationships", "Career",
  "Health", "Productivity", "Communication", "Leadership", "Creativity",
];

const toneOptions = [
  "Inspirational", "Practical", "Reflective", "Motivational",
  "Analytical", "Conversational", "Storytelling",
];

const UpdateLesson = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { isPremium } = useUserRole();

  const [form, setForm] = useState(null);

  /* ── Fetch existing lesson ── */
  const { data: lesson, isLoading } = useQuery({
    queryKey: ["lesson", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/lessons/${id}`);
      return res.data?.data || res.data;
    },
  });

  /* ── Populate form ── */
  useEffect(() => {
    if (lesson && !form) {
      setForm({
        title: lesson.title || "",
        description: lesson.description || "",
        content: lesson.content || "",
        category: lesson.category || "",
        tone: lesson.tone || "",
        accessLevel: lesson.isPremium ? "Premium" : "Free",
        image: lesson.image || "",
        tags: lesson.tags ? lesson.tags.join(", ") : "",
        readTime: lesson.readTime || "",
      });
    }
  }, [lesson, form]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /* ── Update mutation ── */
  const updateMutation = useMutation({
    mutationFn: async (updatedData) => {
      return axiosSecure.put(`/lessons/${id}`, updatedData);
    },
    onSuccess: () => {
      toast.success("Lesson updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["myLessons", user?.email] });
      queryClient.invalidateQueries({ queryKey: ["lesson", id] });
      navigate("/dashboard/my-lessons");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error("Title is required");
    if (!form.category) return toast.error("Please select a category");

    const updatedData = {
      ...form,
      tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      readTime: form.readTime ? parseInt(form.readTime) : undefined,
      isPremium: form.accessLevel === "Premium",
    };
    delete updatedData.accessLevel;
    updateMutation.mutate(updatedData);
  };

  if (isLoading || !form) {
    return (
      <div className="max-w-3xl">
        <div className="h-8 w-48 bg-base-300/50 rounded-lg mb-6 animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-base-200/50 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">
          Update{" "}
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Lesson
          </span>
        </h1>
        <p className="text-sm text-base-content/50">
          Edit the details of your lesson below.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Title */}
          <div className="form-control md:col-span-2">
            <label className="label pb-1">
              <span className="label-text text-sm font-medium">Title <span className="text-error">*</span></span>
            </label>
            <input type="text" name="title" value={form.title} onChange={handleChange} className="input input-bordered bg-base-100 focus:border-primary" required />
          </div>

          {/* Category */}
          <div className="form-control">
            <label className="label pb-1"><span className="label-text text-sm font-medium">Category <span className="text-error">*</span></span></label>
            <select name="category" value={form.category} onChange={handleChange} className="select select-bordered bg-base-100 focus:border-primary" required>
              <option value="" disabled>Select</option>
              {categoryOptions.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          {/* Tone */}
          <div className="form-control">
            <label className="label pb-1"><span className="label-text text-sm font-medium">Tone</span></label>
            <select name="tone" value={form.tone} onChange={handleChange} className="select select-bordered bg-base-100 focus:border-primary">
              <option value="" disabled>Select</option>
              {toneOptions.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>

          {/* Access Level */}
          <div className="form-control">
            <label className="label pb-1"><span className="label-text text-sm font-medium">Access Level</span></label>
            <select name="accessLevel" value={form.accessLevel} onChange={handleChange} className="select select-bordered bg-base-100 focus:border-primary">
              <option value="Free">Free</option>
              <option value="Premium" disabled={!isPremium}>Premium{!isPremium ? " (Premium only)" : ""}</option>
            </select>
          </div>

          {/* Read Time */}
          <div className="form-control">
            <label className="label pb-1"><span className="label-text text-sm font-medium">Read Time (min)</span></label>
            <input type="number" name="readTime" value={form.readTime} onChange={handleChange} min="1" max="60" className="input input-bordered bg-base-100 focus:border-primary" />
          </div>

          {/* Image */}
          <div className="form-control md:col-span-2">
            <label className="label pb-1"><span className="label-text text-sm font-medium">Cover Image URL</span></label>
            <input type="url" name="image" value={form.image} onChange={handleChange} className="input input-bordered bg-base-100 focus:border-primary" />
          </div>

          {/* Tags */}
          <div className="form-control md:col-span-2">
            <label className="label pb-1">
              <span className="label-text text-sm font-medium">Tags</span>
              <span className="label-text-alt text-xs text-base-content/40">Comma-separated</span>
            </label>
            <input type="text" name="tags" value={form.tags} onChange={handleChange} className="input input-bordered bg-base-100 focus:border-primary" />
          </div>

          {/* Description */}
          <div className="form-control md:col-span-2">
            <label className="label pb-1"><span className="label-text text-sm font-medium">Description</span></label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="textarea textarea-bordered bg-base-100 focus:border-primary resize-none" />
          </div>

          {/* Content */}
          <div className="form-control md:col-span-2">
            <label className="label pb-1"><span className="label-text text-sm font-medium">Content</span></label>
            <textarea name="content" value={form.content} onChange={handleChange} rows={10} className="textarea textarea-bordered bg-base-100 focus:border-primary resize-y font-mono text-sm" />
          </div>
        </div>

        <div className="mt-8 flex items-center gap-4">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="btn btn-primary rounded-xl border-0 bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.01] transition-all duration-300 px-8"
          >
            {updateMutation.isPending ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Save Changes
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard/my-lessons")}
            className="btn btn-ghost rounded-xl font-medium text-base-content/60"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateLesson;
