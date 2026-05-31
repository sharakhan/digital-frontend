import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AdminHome = () => {
  const axiosSecure = useAxiosSecure();

  /* ── Fetch platform stats ── */
  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/stats");
      return res.data;
    },
  });

  const statCards = [
    {
      label: "Total Users",
      value: stats.totalUsers ?? "—",
      desc: "Registered accounts",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      bgClass: "bg-primary/10 text-primary",
    },
    {
      label: "Total Lessons",
      value: stats.totalLessons ?? "—",
      desc: "Published lessons",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      bgClass: "bg-secondary/10 text-secondary",
    },
    {
      label: "Premium Users",
      value: stats.premiumUsers ?? "—",
      desc: "Active subscribers",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      bgClass: "bg-amber-500/10 text-amber-600",
    },
    {
      label: "Reports",
      value: stats.totalReports ?? "—",
      desc: "Flagged content",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      bgClass: "bg-error/10 text-error",
    },
  ];

  return (
    <div>
      {/* ── Header ── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="badge bg-error/15 text-error border-0 font-bold text-xs">
            ADMIN
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">
          Platform{" "}
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Overview
          </span>
        </h1>
        <p className="text-sm text-base-content/50">
          Monitor platform activity, users, and content at a glance.
        </p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
        {statCards.map((stat, i) => (
          <div
            key={i}
            className="card bg-base-100 border border-base-content/5 rounded-2xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="card-body p-5 flex-row items-center gap-4">
              <div
                className={`w-14 h-14 rounded-xl ${stat.bgClass} flex items-center justify-center shrink-0`}
              >
                {stat.icon}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-base-content/40 uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold tracking-tight">
                  {isLoading ? (
                    <span className="inline-block w-10 h-8 bg-base-300/50 rounded-lg animate-pulse" />
                  ) : (
                    stat.value
                  )}
                </p>
                <p className="text-xs text-base-content/40 mt-0.5">
                  {stat.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Quick Actions ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="card bg-base-100 border border-base-content/5 rounded-2xl">
          <div className="card-body p-6">
            <h3 className="font-bold text-base flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
              User Management
            </h3>
            <p className="text-sm text-base-content/50 mt-1">
              View all registered users, change roles, and manage accounts across the platform.
            </p>
            <div className="card-actions mt-4">
              <a
                href="/dashboard/admin/users"
                className="btn btn-primary btn-sm rounded-xl font-medium gap-1"
              >
                Manage Users
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 border border-base-content/5 rounded-2xl">
          <div className="card-body p-6">
            <h3 className="font-bold text-base flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-error/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
              </svg>
              Reports & Moderation
            </h3>
            <p className="text-sm text-base-content/50 mt-1">
              Review flagged lessons and reports submitted by users. Remove inappropriate content.
            </p>
            <div className="card-actions mt-4">
              <a
                href="/dashboard/admin/reports"
                className="btn btn-error btn-sm btn-outline rounded-xl font-medium gap-1"
              >
                View Reports
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
