import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AuthContext } from "../../providers/AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const MyLessons = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState(null);

  /* ── Fetch user lessons ── */
  const {
    data: lessons = [],
    isLoading,
  } = useQuery({
    queryKey: ["myLessons", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/lessons/author/${user.email}`);
      return res.data?.data || res.data;
    },
  });

  /* ── Delete mutation ── */
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return axiosSecure.delete(`/lessons/${id}`);
    },
    onSuccess: () => {
      toast.success("Lesson deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["myLessons", user?.email] });
      setDeleteTarget(null);
    },
    onError: () => {
      toast.error("Failed to delete lesson");
      setDeleteTarget(null);
    },
  });

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget._id);
    }
  };

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">
            My{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Lessons
            </span>
          </h1>
          <p className="text-sm text-base-content/50">
            Manage all the lessons you have created.
          </p>
        </div>
        <Link
          to="/dashboard/add-lesson"
          className="btn btn-primary btn-sm rounded-xl border-0 bg-gradient-to-r from-primary to-secondary text-white font-medium shadow-md shadow-primary/20 gap-1.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          New Lesson
        </Link>
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
      {!isLoading && lessons.length === 0 && (
        <div className="text-center py-16 border-2 border-dashed border-base-content/10 rounded-2xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-base-content/15 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 className="text-lg font-bold mb-1">No lessons yet</h3>
          <p className="text-sm text-base-content/40 mb-5">
            Create your first lesson to share with the community.
          </p>
          <Link
            to="/dashboard/add-lesson"
            className="btn btn-primary btn-sm rounded-xl font-medium"
          >
            Create Lesson
          </Link>
        </div>
      )}

      {/* ── Table ── */}
      {!isLoading && lessons.length > 0 && (
        <div className="overflow-x-auto border border-base-content/5 rounded-2xl bg-base-100">
          <table className="table table-zebra">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-base-content/40">
                <th className="w-12">#</th>
                <th>Title</th>
                <th className="hidden sm:table-cell">Category</th>
                <th className="hidden md:table-cell">Access</th>
                <th className="hidden lg:table-cell">Likes</th>
                <th className="hidden lg:table-cell">Date</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {lessons.map((lesson, idx) => (
                <tr key={lesson._id} className="hover">
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
                        <p className="font-semibold text-sm truncate max-w-[200px] lg:max-w-[300px]">
                          {lesson.title}
                        </p>
                        <p className="text-xs text-base-content/40 truncate max-w-[200px] sm:hidden">
                          {lesson.category}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell">
                    <span className="badge badge-sm bg-primary/10 text-primary border-0 font-medium">
                      {lesson.category}
                    </span>
                  </td>
                  <td className="hidden md:table-cell">
                    {lesson.isPremium ? (
                      <span className="badge badge-sm bg-amber-500/15 text-amber-600 border-0 font-semibold gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Premium
                      </span>
                    ) : (
                      <span className="badge badge-sm bg-base-content/5 border-0 font-medium text-base-content/50">
                        Free
                      </span>
                    )}
                  </td>
                  <td className="hidden lg:table-cell text-sm text-base-content/50">
                    {lesson.likes || 0}
                  </td>
                  <td className="hidden lg:table-cell text-xs text-base-content/40">
                    {lesson.createdAt
                      ? new Date(lesson.createdAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/dashboard/update-lesson/${lesson._id}`}
                        className="btn btn-ghost btn-xs rounded-lg hover:bg-primary/10 hover:text-primary transition-all gap-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(lesson)}
                        className="btn btn-ghost btn-xs rounded-lg hover:bg-error/10 hover:text-error transition-all gap-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deleteTarget && (
        <dialog className="modal modal-open">
          <div className="modal-box rounded-2xl max-w-md">
            <div className="text-center">
              <div className="w-14 h-14 bg-error/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-1">Delete Lesson?</h3>
              <p className="text-sm text-base-content/50 mb-1">
                Are you sure you want to delete:
              </p>
              <p className="text-sm font-semibold text-base-content/80 mb-6 break-words">
                &ldquo;{deleteTarget.title}&rdquo;
              </p>
              <p className="text-xs text-error/70 mb-6">
                This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="btn btn-ghost rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleteMutation.isPending}
                  className="btn btn-error rounded-xl font-medium text-white gap-1.5"
                >
                  {deleteMutation.isPending ? (
                    <span className="loading loading-spinner loading-sm" />
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setDeleteTarget(null)}>close</button>
          </form>
        </dialog>
      )}
    </div>
  );
};

export default MyLessons;
