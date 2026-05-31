import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const NotFound = () => {
  const pageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".nf-anim", {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={pageRef}
      className="min-h-[70vh] flex items-center justify-center px-4 py-16"
    >
      <div className="text-center max-w-md">
        {/* 404 Number */}
        <h1 className="nf-anim text-[120px] sm:text-[160px] font-black leading-none tracking-tighter bg-gradient-to-br from-primary via-secondary to-accent bg-clip-text text-transparent select-none">
          404
        </h1>

        <h2 className="nf-anim text-2xl sm:text-3xl font-bold tracking-tight -mt-4 mb-3">
          Page Not Found
        </h2>

        <p className="nf-anim text-base-content/50 text-sm leading-relaxed mb-8">
          The page you are looking for does not exist, has been moved, or is
          temporarily unavailable. Let us get you back on track.
        </p>

        <div className="nf-anim flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="btn btn-primary rounded-xl border-0 bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 px-8"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go Home
          </Link>
          <Link
            to="/lessons"
            className="btn btn-ghost rounded-xl font-medium text-base-content/60"
          >
            Browse Lessons
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
