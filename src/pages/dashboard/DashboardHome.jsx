import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../providers/AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const DashboardHome = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  /* ── Fetch user stats ── */
  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ["dashboardStats", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/stats/${user.email}`);
      return res.data;
    },
  });

  const statCards = [
    {
      label: "Total Lessons",
      value: stats.totalLessons ?? "—",
      desc: "Lessons you have created",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      color: "primary",
      bgClass: "bg-primary/10 text-primary",
    },
    {
      label: "Favorites",
      value: stats.totalFavorites ?? "—",
      desc: "Lessons you have saved",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      color: "secondary",
      bgClass: "bg-secondary/10 text-secondary",
    },
    {
      label: "Total Likes",
      value: stats.totalLikes ?? "—",
      desc: "Likes across your lessons",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
        </svg>
      ),
      color: "accent",
      bgClass: "bg-accent/10 text-accent",
    },
  ];

  return (
    <div>
      {/* ── Header ── */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">
          Welcome back,{" "}
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {user?.displayName?.split(" ")[0] || "User"}
          </span>
          !
        </h1>
        <p className="text-sm text-base-content/50">
          Here&apos;s a summary of your learning activity.
        </p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
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

      {/* ── Recent Activity ── */}
      <div className="card bg-base-100 border border-base-content/5 rounded-2xl">
        <div className="card-body p-6">
          <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Recent Activity
          </h2>
          <p className="text-sm text-base-content/50 mt-1">
            Your recent learning activity and lesson updates will appear here once you start creating and interacting with lessons.
          </p>
          <div className="mt-6 flex items-center justify-center py-8 border-2 border-dashed border-base-content/10 rounded-xl">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-base-content/15 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-xs text-base-content/30 font-medium">
                No recent activity yet
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
