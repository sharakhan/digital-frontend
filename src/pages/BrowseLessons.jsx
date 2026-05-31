import { useState, useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import gsap from "gsap";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { AuthContext } from "../providers/AuthProvider";
import useUserRole from "../hooks/useUserRole";

/* ── Category list ── */
const categories = [
  "All",
  "Mindset",
  "Finance",
  "Relationships",
  "Career",
  "Health",
  "Productivity",
  "Communication",
];

/* ── Sort options ── */
const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "popular", label: "Most Popular" },
  { value: "title-asc", label: "Title A–Z" },
  { value: "title-desc", label: "Title Z–A" },
];

const BrowseLessons = () => {
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(AuthContext);
  const { isPremium } = useUserRole();
  const headerRef = useRef(null);

  /* ── Filter state ── */
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  /* ── Debounce search ── */
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  /* ── Fetch lessons ── */
  const {
    data: lessons = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["lessons", debouncedSearch, category, sort],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (debouncedSearch) params.append("search", debouncedSearch);
      if (category !== "All") params.append("category", category);
      params.append("sortBy", sort === "popular" ? "mostSaved" : sort);
      const res = await axiosPublic.get(`/lessons?${params.toString()}`);
      return res.data?.data || res.data;
    },
  });

  /* ── GSAP header animation ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".browse-header-anim", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
      });
    }, headerRef);
    return () => ctx.revert();
  }, []);

  /* ── Check if lesson is premium-locked ── */
  const isLocked = (lesson) => {
    return lesson.isPremium && !isPremium;
  };

  return (
    <div className="min-h-screen">
      {/* ── Page Header ── */}
      <section
        ref={headerRef}
        className="relative pt-12 pb-8 px-4 lg:px-8 overflow-hidden"
      >
        <div className="mesh-bg-2" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="browse-header-anim">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary/80 bg-primary/10 rounded-full px-4 py-1.5 mb-4">
              Explore & Learn
            </span>
          </div>
          <h1 className="browse-header-anim text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3">
            Browse{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Life Lessons
            </span>
          </h1>
          <p className="browse-header-anim text-base-content/60 max-w-lg text-sm sm:text-base">
            Discover wisdom from real-world experiences. Search, filter, and
            find the lessons that resonate with you.
          </p>
        </div>
      </section>

      {/* ── Filters & Controls ── */}
      <section className="sticky top-[64px] z-30 bg-base-100/80 backdrop-blur-xl border-b border-base-content/5 py-4 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          {/* Search */}
          <div className="relative flex-1 w-full lg:max-w-md">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search lessons..."
              className="input input-bordered bg-base-100/60 w-full pl-10 input-sm sm:input-md focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/30 hover:text-base-content/60 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 flex-wrap flex-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`btn btn-xs sm:btn-sm rounded-full font-medium transition-all duration-200 ${
                  category === cat
                    ? "btn-primary border-0 shadow-md shadow-primary/20"
                    : "btn-ghost bg-base-content/5 hover:bg-base-content/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="select select-bordered select-sm sm:select-md bg-base-100/60 focus:border-primary min-w-[160px]"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* ── Lesson Grid ── */}
      <section className="py-10 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Loading state */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="card bg-base-200/50 border border-base-content/5 rounded-2xl overflow-hidden animate-pulse"
                >
                  <div className="h-44 bg-base-300/40" />
                  <div className="card-body gap-3 p-5">
                    <div className="h-3 w-16 bg-base-300/50 rounded-full" />
                    <div className="h-5 w-4/5 bg-base-300/50 rounded-lg" />
                    <div className="h-3 w-full bg-base-300/30 rounded" />
                    <div className="h-3 w-2/3 bg-base-300/30 rounded" />
                    <div className="h-8 w-24 bg-base-300/40 rounded-lg mt-2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error state */}
          {isError && (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-error/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-1">Failed to load lessons</h3>
              <p className="text-sm text-base-content/50">Please try again later or check your connection.</p>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !isError && lessons.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-base-content/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-1">No lessons found</h3>
              <p className="text-sm text-base-content/50">
                Try adjusting your search or filters.
              </p>
            </div>
          )}

          {/* Lesson cards */}
          {!isLoading && !isError && lessons.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {lessons.map((lesson) => {
                const locked = isLocked(lesson);
                return (
                  <div
                    key={lesson._id}
                    className={`group card bg-base-100/80 backdrop-blur-sm border border-base-content/5 rounded-2xl overflow-hidden transition-all duration-300 ${
                      locked
                        ? "cursor-default"
                        : "hover:shadow-xl hover:shadow-base-content/5 hover:-translate-y-1"
                    }`}
                  >
                    {/* Image */}
                    <figure className="relative overflow-hidden h-44">
                      <img
                        src={lesson.image || "https://placehold.co/600x400/1a1a2e/eee?text=Lesson"}
                        alt={lesson.title}
                        className={`w-full h-full object-cover transition-transform duration-500 ${
                          locked ? "blur-sm scale-105" : "group-hover:scale-105"
                        }`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-base-100/70 to-transparent" />

                      {/* Premium badge */}
                      {lesson.isPremium && (
                        <span className="absolute top-3 right-3 badge badge-sm bg-amber-500/90 text-white border-0 font-semibold gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          Premium
                        </span>
                      )}

                      {/* Category badge */}
                      {lesson.category && (
                        <span className="absolute top-3 left-3 badge badge-sm bg-primary/80 text-white border-0 font-medium">
                          {lesson.category}
                        </span>
                      )}

                      {/* Lock overlay for premium */}
                      {locked && (
                        <div className="absolute inset-0 bg-base-100/50 backdrop-blur-sm flex flex-col items-center justify-center gap-2 z-10">
                          <div className="w-12 h-12 rounded-full bg-base-content/10 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          </div>
                          <span className="text-xs font-semibold text-base-content/70">
                            Premium Only
                          </span>
                        </div>
                      )}
                    </figure>

                    {/* Card body */}
                    <div className={`card-body p-5 gap-2 ${locked ? "blur-[2px]" : ""}`}>
                      <h3 className="card-title text-base font-bold leading-snug line-clamp-2">
                        {lesson.title}
                      </h3>
                      <p className="text-sm text-base-content/55 line-clamp-2 leading-relaxed">
                        {lesson.description || lesson.excerpt}
                      </p>

                      {/* Meta row */}
                      <div className="flex items-center gap-3 mt-1 text-xs text-base-content/40">
                        {lesson.author?.name && (
                          <span className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            {lesson.author.name}
                          </span>
                        )}
                        {lesson.likes !== undefined && (
                          <span className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            {lesson.likes}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action */}
                    <div className="px-5 pb-5 pt-0">
                      {locked ? (
                        <Link
                          to="/dashboard/upgrade"
                          className="btn btn-sm w-full rounded-xl border-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-md shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-[1.02] transition-all duration-300 gap-1.5"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          Upgrade to Premium
                        </Link>
                      ) : (
                        <Link
                          to={`/lessons/${lesson._id}`}
                          className="btn btn-sm btn-primary btn-outline w-full rounded-xl font-medium gap-1 transition-all duration-200"
                        >
                          Read Lesson
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BrowseLessons;
