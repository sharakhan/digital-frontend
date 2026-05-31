import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ManageReports = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [activeTab, setActiveTab] = useState("lessons");

  /* ── Fetch all lessons (admin) ── */
  const { data: lessons = [], isLoading: lessonsLoading } = useQuery({
    queryKey: ["adminLessons"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/lessons");
      return res.data;
    },
  });

  /* ── Fetch reports ── */
  const { data: reports = [], isLoading: reportsLoading } = useQuery({
    queryKey: ["adminReports"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/reports");
      return res.data;
    },
  });

  /* ── Delete lesson ── */
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return axiosSecure.delete(`/admin/lessons/${id}`);
    },
    onSuccess: () => {
      toast.success("Lesson deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["adminLessons"] });
      queryClient.invalidateQueries({ queryKey: ["adminReports"] });
      setDeleteTarget(null);
    },
    onError: () => {
      toast.error("Failed to delete lesson");
      setDeleteTarget(null);
    },
  });

  /* ── Dismiss report ── */
  const dismissMutation = useMutation({
    mutationFn: async (reportId) => {
      return axiosSecure.patch(`/admin/reports/${reportId}/dismiss`);
    },
    onSuccess: () => {
      toast.success("Report dismissed");
      queryClient.invalidateQueries({ queryKey: ["adminReports"] });
    },
    onError: () => {
      toast.error("Failed to dismiss report");
    },
  });

  const isLoading = activeTab === "lessons" ? lessonsLoading : reportsLoading;

  return (
    <div>
      {/* ── Header ── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="badge bg-error/15 text-error border-0 font-bold text-xs">ADMIN</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">
          Lessons &{" "}
          <span className="bg-gradient-to-r from-error to-orange-500 bg-clip-text text-transparent">
            Reports
          </span>
        </h1>
        <p className="text-sm text-base-content/50">
          Review all lessons and manage flagged content reports.
        </p>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("lessons")}
          className={`btn btn-sm rounded-xl font-medium transition-all duration-200 ${
            activeTab === "lessons"
              ? "btn-primary shadow-md shadow-primary/20"
              : "btn-ghost bg-base-content/5"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          All Lessons ({lessons.length})
        </button>
        <button
          onClick={() => setActiveTab("reports")}
          className={`btn btn-sm rounded-xl font-medium transition-all duration-200 ${
            activeTab === "reports"
              ? "btn-error shadow-md shadow-error/20"
              : "btn-ghost bg-base-content/5"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
          </svg>
          Reports ({reports.length})
        </button>
      </div>

      {/* ── Loading ── */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-14 bg-base-200/50 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {/* ══════ Lessons Tab ══════ */}
      {activeTab === "lessons" && !lessonsLoading && (
        <>
          {lessons.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-base-content/10 rounded-2xl">
              <h3 className="text-lg font-bold mb-1">No lessons found</h3>
              <p className="text-sm text-base-content/40">No lessons have been published yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-base-content/5 rounded-2xl bg-base-100">
              <table className="table table-zebra">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-base-content/40">
                    <th className="w-12">#</th>
                    <th>Title</th>
                    <th className="hidden sm:table-cell">Author</th>
                    <th className="hidden md:table-cell">Category</th>
                    <th className="hidden lg:table-cell">Access</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {lessons.map((lesson, idx) => (
                    <tr key={lesson._id} className="hover">
                      <td className="text-base-content/40 text-sm">{idx + 1}</td>
                      <td>
                        <Link
                          to={`/lessons/${lesson._id}`}
                          className="font-semibold text-sm hover:text-primary transition-colors truncate max-w-[200px] lg:max-w-[300px] block"
                        >
                          {lesson.title}
                        </Link>
                      </td>
                      <td className="hidden sm:table-cell text-sm text-base-content/50">
                        {lesson.author?.name || lesson.author?.email || "—"}
                      </td>
                      <td className="hidden md:table-cell">
                        <span className="badge badge-sm bg-primary/10 text-primary border-0 font-medium">
                          {lesson.category || "—"}
                        </span>
                      </td>
                      <td className="hidden lg:table-cell">
                        {lesson.isPremium ? (
                          <span className="badge badge-sm bg-amber-500/15 text-amber-600 border-0 font-semibold">Premium</span>
                        ) : (
                          <span className="badge badge-sm bg-base-content/5 border-0 text-base-content/50">Free</span>
                        )}
                      </td>
                      <td className="text-right">
                        <button
                          onClick={() => setDeleteTarget(lesson)}
                          className="btn btn-ghost btn-xs rounded-lg hover:bg-error/10 hover:text-error transition-all gap-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* ══════ Reports Tab ══════ */}
      {activeTab === "reports" && !reportsLoading && (
        <>
          {reports.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-base-content/10 rounded-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500/30 mx-auto mb-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <h3 className="text-lg font-bold mb-1">All Clear!</h3>
              <p className="text-sm text-base-content/40">No pending reports at this time.</p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-base-content/5 rounded-2xl bg-base-100">
              <table className="table table-zebra">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-base-content/40">
                    <th className="w-12">#</th>
                    <th>Reported Lesson</th>
                    <th className="hidden sm:table-cell">Reported By</th>
                    <th className="hidden md:table-cell">Reason</th>
                    <th className="hidden lg:table-cell">Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report, idx) => (
                    <tr key={report._id} className="hover">
                      <td className="text-base-content/40 text-sm">{idx + 1}</td>
                      <td className="font-medium text-sm truncate max-w-[200px]">
                        {report.lessonTitle || report.lessonId || "Unknown"}
                      </td>
                      <td className="hidden sm:table-cell text-sm text-base-content/50">
                        {report.reportedBy || "—"}
                      </td>
                      <td className="hidden md:table-cell text-sm text-base-content/60 truncate max-w-[200px]">
                        {report.reason || "No reason provided"}
                      </td>
                      <td className="hidden lg:table-cell">
                        <span className={`badge badge-sm border-0 font-semibold ${
                          report.status === "dismissed"
                            ? "bg-base-content/5 text-base-content/40"
                            : "bg-error/15 text-error"
                        }`}>
                          {report.status || "Pending"}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center justify-end gap-2">
                          {report.lessonId && (
                            <button
                              onClick={() => setDeleteTarget({ _id: report.lessonId, title: report.lessonTitle || "this lesson" })}
                              className="btn btn-ghost btn-xs rounded-lg hover:bg-error/10 hover:text-error transition-all gap-1"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Remove
                            </button>
                          )}
                          {report.status !== "dismissed" && (
                            <button
                              onClick={() => dismissMutation.mutate(report._id)}
                              disabled={dismissMutation.isPending}
                              className="btn btn-ghost btn-xs rounded-lg hover:bg-green-500/10 hover:text-green-600 transition-all gap-1"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Dismiss
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
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
                This will permanently remove:
              </p>
              <p className="text-sm font-semibold text-base-content/80 mb-6 break-words">
                &ldquo;{deleteTarget.title}&rdquo;
              </p>
              <p className="text-xs text-error/70 mb-6">This action cannot be undone.</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setDeleteTarget(null)} className="btn btn-ghost rounded-xl font-medium">
                  Cancel
                </button>
                <button
                  onClick={() => deleteMutation.mutate(deleteTarget._id)}
                  disabled={deleteMutation.isPending}
                  className="btn btn-error rounded-xl font-medium text-white gap-1.5"
                >
                  {deleteMutation.isPending ? (
                    <span className="loading loading-spinner loading-sm" />
                  ) : (
                    "Delete"
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

export default ManageReports;
