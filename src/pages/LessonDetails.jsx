import { useContext, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import gsap from "gsap";
import toast from "react-hot-toast";
import useAxiosPublic from "../hooks/useAxiosPublic";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { AuthContext } from "../providers/AuthProvider";

const LessonDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const pageRef = useRef(null);

  /* ── Fetch lesson ── */
  const {
    data: lesson,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["lesson", id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/lessons/${id}`);
      return res.data?.data || res.data;
    },
  });

  /* ── Check like & favorite status ── */
  const { data: interactionStatus = {} } = useQuery({
    queryKey: ["lessonInteraction", id, user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/lessons/${id}/interaction?email=${user.email}`
      );
      return res.data;
    },
  });

  /* ── Like Mutation (optimistic) ── */
  const likeMutation = useMutation({
    mutationFn: async () => {
      return axiosSecure.post(`/lessons/${id}/like`, { email: user.email });
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["lesson", id] });
      await queryClient.cancelQueries({
        queryKey: ["lessonInteraction", id, user?.email],
      });

      const prevLesson = queryClient.getQueryData(["lesson", id]);
      const prevInteraction = queryClient.getQueryData([
        "lessonInteraction",
        id,
        user?.email,
      ]);

      const wasLiked = prevInteraction?.isLiked;

      queryClient.setQueryData(["lesson", id], (old) =>
        old
          ? { ...old, likes: (old.likes || 0) + (wasLiked ? -1 : 1) }
          : old
      );
      queryClient.setQueryData(
        ["lessonInteraction", id, user?.email],
        (old) => (old ? { ...old, isLiked: !wasLiked } : { isLiked: true })
      );

      return { prevLesson, prevInteraction };
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(["lesson", id], context.prevLesson);
      queryClient.setQueryData(
        ["lessonInteraction", id, user?.email],
        context.prevInteraction
      );
      toast.error("Failed to update like");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson", id] });
      queryClient.invalidateQueries({
        queryKey: ["lessonInteraction", id, user?.email],
      });
    },
  });

  /* ── Favorite Mutation (optimistic) ── */
  const favoriteMutation = useMutation({
    mutationFn: async () => {
      return axiosSecure.post(`/lessons/${id}/favorite`, {
        email: user.email,
      });
    },
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["lessonInteraction", id, user?.email],
      });

      const prevInteraction = queryClient.getQueryData([
        "lessonInteraction",
        id,
        user?.email,
      ]);

      queryClient.setQueryData(
        ["lessonInteraction", id, user?.email],
        (old) =>
          old
            ? { ...old, isFavorited: !old.isFavorited }
            : { isFavorited: true }
      );

      return { prevInteraction };
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(
        ["lessonInteraction", id, user?.email],
        context.prevInteraction
      );
      toast.error("Failed to update favorite");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["lessonInteraction", id, user?.email],
      });
    },
  });

  /* ── Handle like ── */
  const handleLike = () => {
    if (!user) {
      toast.error("Please login to like lessons");
      navigate("/login", { state: { from: { pathname: `/lessons/${id}` } } });
      return;
    }
    likeMutation.mutate();
  };

  /* ── Handle favorite ── */
  const handleFavorite = () => {
    if (!user) {
      toast.error("Please login to save lessons");
      navigate("/login", { state: { from: { pathname: `/lessons/${id}` } } });
      return;
    }
    favoriteMutation.mutate();
  };

  /* ── GSAP entrance ── */
  useEffect(() => {
    if (!lesson) return;
    const ctx = gsap.context(() => {
      gsap.from(".detail-anim", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
      });
    }, pageRef);
    return () => ctx.revert();
  }, [lesson]);

  /* ── Loading State ── */
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-16">
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-32 bg-base-300/50 rounded-full" />
          <div className="h-10 w-3/4 bg-base-300/50 rounded-xl" />
          <div className="flex gap-3">
            <div className="h-5 w-20 bg-base-300/40 rounded-full" />
            <div className="h-5 w-20 bg-base-300/40 rounded-full" />
          </div>
          <div className="h-64 bg-base-300/30 rounded-2xl" />
          <div className="space-y-3">
            <div className="h-4 w-full bg-base-300/30 rounded" />
            <div className="h-4 w-5/6 bg-base-300/30 rounded" />
            <div className="h-4 w-4/6 bg-base-300/30 rounded" />
          </div>
        </div>
      </div>
    );
  }

  /* ── Error State ── */
  if (isError || !lesson) {
    return (
      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-20 text-center">
        <div className="w-16 h-16 bg-error/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-2">Lesson Not Found</h2>
        <p className="text-base-content/50 text-sm mb-6">
          This lesson may have been removed or the link is invalid.
        </p>
        <Link to="/lessons" className="btn btn-primary rounded-xl">
          Browse Lessons
        </Link>
      </div>
    );
  }

  const { isLiked, isFavorited } = interactionStatus;

  return (
    <div ref={pageRef} className="min-h-screen pb-20">
      {/* ── Hero Banner ── */}
      {lesson.image && (
        <div className="detail-anim relative h-64 sm:h-80 lg:h-96 overflow-hidden">
          <img
            src={lesson.image}
            alt={lesson.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-base-100 via-base-100/40 to-transparent" />
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 lg:px-8 -mt-16 relative z-10">
        {/* ── Breadcrumb ── */}
        <nav className="detail-anim text-sm breadcrumbs mb-6">
          <ul className="text-base-content/50">
            <li>
              <Link to="/" className="hover:text-primary transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/lessons"
                className="hover:text-primary transition-colors"
              >
                Lessons
              </Link>
            </li>
            <li className="text-base-content/80 font-medium truncate max-w-[200px]">
              {lesson.title}
            </li>
          </ul>
        </nav>

        {/* ── Title & Meta ── */}
        <div className="detail-anim mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {lesson.category && (
              <span className="badge bg-primary/10 text-primary border-0 font-medium">
                {lesson.category}
              </span>
            )}
            {lesson.isPremium && (
              <span className="badge bg-amber-500/15 text-amber-600 border-0 font-semibold gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Premium
              </span>
            )}
            {lesson.readTime && (
              <span className="text-xs text-base-content/40 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {lesson.readTime} min read
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-4">
            {lesson.title}
          </h1>

          {lesson.description && (
            <p className="text-base-content/60 text-lg leading-relaxed">
              {lesson.description}
            </p>
          )}
        </div>

        {/* ── Action Buttons ── */}
        <div className="detail-anim flex items-center gap-3 mb-10">
          {/* Like */}
          <button
            onClick={handleLike}
            disabled={likeMutation.isPending}
            className={`btn rounded-xl gap-2 font-medium transition-all duration-300 ${
              isLiked
                ? "btn-primary shadow-md shadow-primary/20"
                : "btn-ghost bg-base-content/5 hover:bg-primary/10 hover:text-primary"
            }`}
          >
            {isLiked ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            )}
            <span>{lesson.likes || 0}</span>
          </button>

          {/* Favorite */}
          <button
            onClick={handleFavorite}
            disabled={favoriteMutation.isPending}
            className={`btn rounded-xl gap-2 font-medium transition-all duration-300 ${
              isFavorited
                ? "btn-secondary shadow-md shadow-secondary/20"
                : "btn-ghost bg-base-content/5 hover:bg-secondary/10 hover:text-secondary"
            }`}
          >
            {isFavorited ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            )}
            <span>{isFavorited ? "Saved" : "Save"}</span>
          </button>

          {/* Share */}
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success("Link copied to clipboard!");
            }}
            className="btn btn-ghost bg-base-content/5 rounded-xl gap-2 font-medium hover:bg-base-content/10 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </button>
        </div>

        {/* ── Content ── */}
        <article className="detail-anim prose prose-lg max-w-none mb-16">
          <div
            dangerouslySetInnerHTML={{
              __html:
                lesson.content ||
                `<p>${lesson.description || "No content available for this lesson yet."}</p>`,
            }}
          />
        </article>

        {/* ── Tags ── */}
        {lesson.tags && lesson.tags.length > 0 && (
          <div className="detail-anim flex flex-wrap gap-2 mb-12">
            {lesson.tags.map((tag, idx) => (
              <span
                key={idx}
                className="badge badge-lg bg-base-content/5 border-0 font-medium text-base-content/60"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* ── Author Card ── */}
        {lesson.author && (
          <div className="detail-anim">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-base-content/40 mb-4">
              Written By
            </h3>
            <div className="bg-base-100/60 backdrop-blur-xl border border-base-content/8 rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-primary/15 shrink-0">
                {lesson.author.photo ? (
                  <img
                    src={lesson.author.photo}
                    alt={lesson.author.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">
                      {lesson.author.name?.charAt(0) || "A"}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="text-center sm:text-left flex-1">
                <h4 className="text-lg font-bold tracking-tight">
                  {lesson.author.name}
                </h4>
                {lesson.author.email && (
                  <p className="text-sm text-base-content/50 mb-2">
                    {lesson.author.email}
                  </p>
                )}
                {lesson.author.bio && (
                  <p className="text-sm text-base-content/60 leading-relaxed">
                    {lesson.author.bio}
                  </p>
                )}
              </div>

              {/* Author stats or link */}
              <div className="shrink-0">
                <Link
                  to="/lessons"
                  className="btn btn-sm btn-ghost bg-base-content/5 rounded-xl text-xs font-medium hover:bg-primary/10 hover:text-primary transition-all"
                >
                  More Lessons
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ── Back Link ── */}
        <div className="detail-anim mt-12 text-center">
          <Link
            to="/lessons"
            className="btn btn-ghost rounded-xl font-medium text-base-content/60 hover:text-primary gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to All Lessons
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LessonDetails;
