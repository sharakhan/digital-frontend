import { useContext, useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import Lottie from "lottie-react";
import toast from "react-hot-toast";
import gsap from "gsap";
import { AuthContext } from "../../providers/AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useUserRole from "../../hooks/useUserRole";

/* ── Lottie animation data (checkmark success) ── */
const successAnimData = {"v":"5.7.1","fr":30,"ip":0,"op":60,"w":200,"h":200,"nm":"success","ddd":0,"assets":[],"layers":[{"ddd":0,"ind":1,"ty":4,"nm":"circle","sr":1,"ks":{"o":{"a":1,"k":[{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":10,"s":[0]},{"t":25,"s":[100]}]},"r":{"a":0,"k":0},"p":{"a":0,"k":[100,100,0]},"a":{"a":0,"k":[0,0,0]},"s":{"a":1,"k":[{"i":{"x":[0.667,0.667,0.667],"y":[1,1,1]},"o":{"x":[0.333,0.333,0.333],"y":[0,0,0]},"t":10,"s":[0,0,100]},{"i":{"x":[0.667,0.667,0.667],"y":[1,1,1]},"o":{"x":[0.333,0.333,0.333],"y":[0,0,0]},"t":25,"s":[110,110,100]},{"t":35,"s":[100,100,100]}]}},"ao":0,"shapes":[{"ty":"el","d":1,"s":{"a":0,"k":[120,120]},"p":{"a":0,"k":[0,0]},"nm":"circle","hd":false},{"ty":"fl","c":{"a":0,"k":[0.133,0.773,0.369,1]},"o":{"a":0,"k":100},"r":1,"bm":0,"nm":"fill","hd":false}],"ip":0,"op":60,"st":0},{"ddd":0,"ind":2,"ty":4,"nm":"check","sr":1,"ks":{"o":{"a":1,"k":[{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":25,"s":[0]},{"t":35,"s":[100]}]},"r":{"a":0,"k":0},"p":{"a":0,"k":[100,100,0]},"a":{"a":0,"k":[0,0,0]},"s":{"a":0,"k":[100,100,100]}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0]],"v":[[-20,0],[-7,13],[22,-12]],"c":false}},"nm":"path","hd":false},{"ty":"st","c":{"a":0,"k":[1,1,1,1]},"o":{"a":0,"k":100},"w":{"a":0,"k":8},"lc":2,"lj":2,"bm":0,"nm":"stroke","hd":false},{"ty":"tm","s":{"a":0,"k":0},"e":{"a":1,"k":[{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":25,"s":[0]},{"t":40,"s":[100]}]},"o":{"a":0,"k":0},"m":1,"nm":"trim","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0]},"a":{"a":0,"k":[0,0]},"s":{"a":0,"k":[100,100]},"r":{"a":0,"k":0},"o":{"a":0,"k":100}}],"nm":"check","hd":false}],"ip":0,"op":60,"st":0}]};

/* ── Options ── */
const categoryOptions = [
  "Mindset",
  "Finance",
  "Relationships",
  "Career",
  "Health",
  "Productivity",
  "Communication",
  "Leadership",
  "Creativity",
];

const toneOptions = [
  "Inspirational",
  "Practical",
  "Reflective",
  "Motivational",
  "Analytical",
  "Conversational",
  "Storytelling",
];

const accessLevels = ["Free", "Premium"];

const AddLesson = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const { isPremium } = useUserRole();
  const formRef = useRef(null);
  const [showSuccess, setShowSuccess] = useState(false);

  /* ── Form state ── */
  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
    category: "",
    tone: "",
    accessLevel: "Free",
    image: "",
    tags: "",
    readTime: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /* ── Mutation ── */
  const addMutation = useMutation({
    mutationFn: async (lessonData) => {
      const res = await axiosSecure.post("/lessons", lessonData);
      return res.data;
    },
    onSuccess: () => {
      setShowSuccess(true);
      setForm({
        title: "",
        description: "",
        content: "",
        category: "",
        tone: "",
        accessLevel: "Free",
        image: "",
        tags: "",
        readTime: "",
      });
      setTimeout(() => setShowSuccess(false), 3000);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to add lesson");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error("Title is required");
    if (!form.category) return toast.error("Please select a category");
    if (!form.content.trim()) return toast.error("Content is required");

    const lessonData = {
      ...form,
      tags: form.tags
        ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
      readTime: form.readTime ? parseInt(form.readTime) : undefined,
      isPremium: form.accessLevel === "Premium",
      author: {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
      },
      likes: [],
      createdAt: new Date().toISOString(),
    };

    addMutation.mutate(lessonData);
  };

  /* ── GSAP entrance ── */
  const formEntered = useRef(false);
  if (formRef.current && !formEntered.current) {
    formEntered.current = true;
    gsap.from(".form-anim", {
      y: 20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.06,
      ease: "power3.out",
    });
  }

  /* ── Success Modal ── */
  if (showSuccess) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-48 h-48 mx-auto">
            {Lottie.default ? (
              <Lottie.default
                animationData={successAnimData}
                loop={false}
                autoplay={true}
              />
            ) : (
              <Lottie
                animationData={successAnimData}
                loop={false}
                autoplay={true}
              />
            )}
          </div>
          <h2 className="text-2xl font-bold mt-4 mb-2">Lesson Added!</h2>
          <p className="text-base-content/50 text-sm mb-6">
            Your lesson has been published successfully.
          </p>
          <button
            onClick={() => setShowSuccess(false)}
            className="btn btn-primary rounded-xl font-medium"
          >
            Add Another Lesson
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={formRef}>
      {/* ── Header ── */}
      <div className="form-anim mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">
          Add New{" "}
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Lesson
          </span>
        </h1>
        <p className="text-sm text-base-content/50">
          Share your wisdom with the community. Fill in the details below.
        </p>
      </div>

      {/* ── Form ── */}
      <form onSubmit={handleSubmit} className="max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Title */}
          <div className="form-control md:col-span-2 form-anim">
            <label className="label pb-1">
              <span className="label-text text-sm font-medium">
                Lesson Title <span className="text-error">*</span>
              </span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. The Power of Saying No"
              className="input input-bordered bg-base-100 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              required
            />
          </div>

          {/* Category */}
          <div className="form-control form-anim">
            <label className="label pb-1">
              <span className="label-text text-sm font-medium">
                Category <span className="text-error">*</span>
              </span>
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="select select-bordered bg-base-100 focus:border-primary"
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Tone */}
          <div className="form-control form-anim">
            <label className="label pb-1">
              <span className="label-text text-sm font-medium">Tone</span>
            </label>
            <select
              name="tone"
              value={form.tone}
              onChange={handleChange}
              className="select select-bordered bg-base-100 focus:border-primary"
            >
              <option value="" disabled>
                Select a tone
              </option>
              {toneOptions.map((tone) => (
                <option key={tone} value={tone}>
                  {tone}
                </option>
              ))}
            </select>
          </div>

          {/* Access Level */}
          <div className="form-control form-anim">
            <label className="label pb-1">
              <span className="label-text text-sm font-medium">
                Access Level
              </span>
              {!isPremium && (
                <span className="label-text-alt text-amber-500 text-xs font-medium flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Upgrade to unlock
                </span>
              )}
            </label>
            <select
              name="accessLevel"
              value={form.accessLevel}
              onChange={handleChange}
              className="select select-bordered bg-base-100 focus:border-primary"
              disabled={!isPremium && form.accessLevel !== "Free"}
            >
              {accessLevels.map((level) => (
                <option
                  key={level}
                  value={level}
                  disabled={level === "Premium" && !isPremium}
                >
                  {level}
                  {level === "Premium" && !isPremium ? " (Premium only)" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Read Time */}
          <div className="form-control form-anim">
            <label className="label pb-1">
              <span className="label-text text-sm font-medium">
                Read Time (minutes)
              </span>
            </label>
            <input
              type="number"
              name="readTime"
              value={form.readTime}
              onChange={handleChange}
              placeholder="e.g. 5"
              min="1"
              max="60"
              className="input input-bordered bg-base-100 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          {/* Image URL */}
          <div className="form-control md:col-span-2 form-anim">
            <label className="label pb-1">
              <span className="label-text text-sm font-medium">
                Cover Image URL
              </span>
            </label>
            <input
              type="url"
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="input input-bordered bg-base-100 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          {/* Tags */}
          <div className="form-control md:col-span-2 form-anim">
            <label className="label pb-1">
              <span className="label-text text-sm font-medium">Tags</span>
              <span className="label-text-alt text-xs text-base-content/40">
                Comma-separated
              </span>
            </label>
            <input
              type="text"
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="e.g. growth, mindset, productivity"
              className="input input-bordered bg-base-100 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          {/* Description */}
          <div className="form-control md:col-span-2 form-anim">
            <label className="label pb-1">
              <span className="label-text text-sm font-medium">
                Short Description
              </span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="A brief summary of your lesson..."
              rows={3}
              className="textarea textarea-bordered bg-base-100 focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
            />
          </div>

          {/* Content */}
          <div className="form-control md:col-span-2 form-anim">
            <label className="label pb-1">
              <span className="label-text text-sm font-medium">
                Lesson Content <span className="text-error">*</span>
              </span>
              <span className="label-text-alt text-xs text-base-content/40">
                HTML supported
              </span>
            </label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="Write your full lesson content here. You can use HTML formatting..."
              rows={10}
              className="textarea textarea-bordered bg-base-100 focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-y font-mono text-sm"
              required
            />
          </div>
        </div>

        {/* ── Submit ── */}
        <div className="form-anim mt-8 flex items-center gap-4">
          <button
            type="submit"
            disabled={addMutation.isPending}
            className="btn btn-primary rounded-xl border-0 bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.01] transition-all duration-300 px-8"
          >
            {addMutation.isPending ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Publish Lesson
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() =>
              setForm({
                title: "",
                description: "",
                content: "",
                category: "",
                tone: "",
                accessLevel: "Free",
                image: "",
                tags: "",
                readTime: "",
              })
            }
            className="btn btn-ghost rounded-xl font-medium text-base-content/60"
          >
            Clear Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddLesson;
