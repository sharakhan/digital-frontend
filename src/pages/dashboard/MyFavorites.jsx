import { useContext } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AuthContext } from "../../providers/AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const MyFavorites = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  /* ── Fetch favorites ── */
  const {
    data: favorites = [],
    isLoading,
  } = useQuery({
    queryKey: ["myFavorites", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/favorites/${user.email}`);
      return res.data;
    },
  });

  /* ── Remove favorite ── */
  const removeMutation = useMutation({
    mutationFn: async (lessonId) => {
      return axiosSecure.delete(`/favorites/${lessonId}?email=${user.email}`);
    },
    onSuccess: () => {
      toast.success("Removed from favorites");
      queryClient.invalidateQueries({ queryKey: ["myFavorites", user?.email] });
    },
    onError: () => {
      toast.error("Failed to remove favorite");
    },
  });

  return (
    <div>
      {/* ── Header ── */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">
          My{" "}
          <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
            Favorites
          </span>
        </h1>
        <p className="text-sm text-base-content/50">
          Lessons you have saved for later reading.
        </p>
      </div>

      {/* ── Loading ── */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-base-200/50 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {/* ── Empty ── */}
      {!isLoading && favorites.length === 0 && (
        <div className="text-center py-16 border-2 border-dashed border-base-content/10 rounded-2xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-base-content/15 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h3 className="text-lg font-bold mb-1">No favorites yet</h3>
          <p className="text-sm text-base-content/40 mb-5">
            Browse lessons and save the ones you love.
          </p>
          <Link
            to="/lessons"
            className="btn btn-primary btn-sm rounded-xl font-medium"
          >
            Browse Lessons
          </Link>
        </div>
      )}

      {/* ── Table ── */}
      {!isLoading && favorites.length > 0 && (
        <div className="overflow-x-auto border border-base-content/5 rounded-2xl bg-base-100">
          <table className="table table-zebra">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-base-content/40">
                <th className="w-12">#</th>
                <th>Lesson</th>
                <th className="hidden sm:table-cell">Category</th>
                <th className="hidden md:table-cell">Author</th>
                <th className="hidden lg:table-cell">Likes</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {favorites.map((item, idx) => {
                const lesson = item.lesson || item;
                return (
                  <tr key={item._id || lesson._id} className="hover">
                    <td className="text-base-content/40 text-sm">{idx + 1}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        {lesson.image && (
                          <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 hidden sm:block">
                            <img
                              src={lesson.image}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="min-w-0">
                          <Link
                            to={`/lessons/${lesson._id}`}
                            className="font-semibold text-sm hover:text-primary transition-colors truncate max-w-[200px] lg:max-w-[300px] block"
                          >
                            {lesson.title}
                          </Link>
                          <p className="text-xs text-base-content/40 sm:hidden">
                            {lesson.category}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell">
                      <span className="badge badge-sm bg-secondary/10 text-secondary border-0 font-medium">
                        {lesson.category}
                      </span>
                    </td>
                    <td className="hidden md:table-cell text-sm text-base-content/50">
                      {lesson.author?.name || "—"}
                    </td>
                    <td className="hidden lg:table-cell text-sm text-base-content/50">
                      {lesson.likes || 0}
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/lessons/${lesson._id}`}
                          className="btn btn-ghost btn-xs rounded-lg hover:bg-primary/10 hover:text-primary transition-all gap-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View
                        </Link>
                        <button
                          onClick={() => removeMutation.mutate(lesson._id)}
                          disabled={removeMutation.isPending}
                          className="btn btn-ghost btn-xs rounded-lg hover:bg-error/10 hover:text-error transition-all gap-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyFavorites;
