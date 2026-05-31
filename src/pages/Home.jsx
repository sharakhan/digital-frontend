import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import gsap from "gsap";
import useAxiosPublic from "../hooks/useAxiosPublic";

/* ─────────────────────── Slide Data ─────────────────────── */
const slides = [
  {
    id: 1,
    badge: "🚀 Start Your Journey",
    title: "Transform Your Life Through",
    highlight: "Digital Wisdom",
    description:
      "Discover curated life lessons powered by AI that adapt to your unique learning style. Build practical skills that matter in the real world — from financial literacy to emotional intelligence.",
    cta: { text: "Begin Learning", to: "/register" },
    ctaSecondary: { text: "Explore Lessons", to: "#featured" },
    gradient: "from-primary/15 via-transparent to-secondary/10",
    accentColor: "primary",
  },
  {
    id: 2,
    badge: "🧠 AI-Powered Insights",
    title: "Learn Smarter, Not Harder With",
    highlight: "Adaptive AI",
    description:
      "Our intelligent platform analyzes your progress and tailors every lesson to your pace. Get real-time feedback, personalized recommendations, and track your growth with detailed analytics.",
    cta: { text: "Try It Free", to: "/register" },
    ctaSecondary: { text: "See How It Works", to: "#benefits" },
    gradient: "from-secondary/15 via-transparent to-accent/10",
    accentColor: "secondary",
  },
  {
    id: 3,
    badge: "🌍 Community Driven",
    title: "Join a Global Community of",
    highlight: "Life Learners",
    description:
      "Connect with thousands of learners worldwide who share real-life experiences and practical advice. Learn from mentors, contribute your own stories, and grow together as a community.",
    cta: { text: "Join Now", to: "/register" },
    ctaSecondary: { text: "Meet the Community", to: "#featured" },
    gradient: "from-accent/15 via-transparent to-primary/10",
    accentColor: "accent",
  },
];

/* ─────────────────────── Style Maps (Tailwind JIT safe) ─────────────────────── */
const highlightGradients = {
  primary: "from-primary to-secondary",
  secondary: "from-secondary to-accent",
  accent: "from-accent to-primary",
};

const iconBoxStyles = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  accent: "bg-accent/10 text-accent",
};

const accentBarStyles = {
  primary: "from-primary to-secondary",
  secondary: "from-secondary to-accent",
  accent: "from-accent to-primary",
};

/* ─────────────────────── Benefit Data ─────────────────────── */
const benefits = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: "Practical Wisdom",
    description:
      "Every lesson is drawn from real-life experiences — not textbooks. Learn the kind of wisdom that only comes from living, distilled into actionable takeaways.",
    color: "primary",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    title: "Emotional Growth",
    description:
      "Develop self-awareness, resilience, and empathy. Our lessons on emotional intelligence help you navigate relationships and challenges with confidence.",
    color: "secondary",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Accelerated Progress",
    description:
      "AI identifies your knowledge gaps and prioritizes lessons that matter most. Spend less time searching, more time growing — with measurable results every week.",
    color: "accent",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "Community Support",
    description:
      "You are never alone on this journey. Learn alongside a supportive global community of mentors and peers who share their experiences and encourage growth.",
    color: "primary",
  },
];

/* ─────────────────────── Component ─────────────────────── */
const Home = () => {
  const axiosPublic = useAxiosPublic();
  const heroRef = useRef(null);
  const benefitsRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  /* ── Fetch Featured Lessons ── */
  const {
    data: lessons = [],
    isLoading: lessonsLoading,
  } = useQuery({
    queryKey: ["featuredLessons"],
    queryFn: async () => {
      const res = await axiosPublic.get("/lessons?limit=6&sortBy=mostSaved");
      return res.data?.data || res.data;
    },
  });

  /* ── GSAP: Animate hero text on slide change ── */
  const animateSlide = useCallback(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo(
        ".hero-badge",
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
      )
        .fromTo(
          ".hero-title",
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
          "-=0.3"
        )
        .fromTo(
          ".hero-desc",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
          "-=0.4"
        )
        .fromTo(
          ".hero-btns",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
          "-=0.3"
        )
        .fromTo(
          ".hero-dots",
          { opacity: 0 },
          { opacity: 1, duration: 0.4 },
          "-=0.3"
        );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const cleanup = animateSlide();
    return cleanup;
  }, [currentSlide, animateSlide]);

  /* ── Auto-advance carousel ── */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  /* ── GSAP: Animate benefits on scroll ── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.from(".benefit-card-anim", {
              y: 60,
              opacity: 0,
              duration: 0.7,
              stagger: 0.15,
              ease: "power3.out",
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    if (benefitsRef.current) observer.observe(benefitsRef.current);
    return () => observer.disconnect();
  }, []);

  const active = slides[currentSlide];

  return (
    <div>
      {/* ══════════════════════ HERO CAROUSEL ══════════════════════ */}
      <section ref={heroRef} className="relative overflow-hidden">
        {/* Background gradient mesh */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${active.gradient} transition-all duration-1000 ease-in-out`}
        />
        <div className="mesh-bg-1" />

        {/* Decorative floating shapes */}
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl float-slow pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-secondary/5 blur-3xl float-medium pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-accent/3 blur-3xl pointer-events-none" />

        <div className="hero-slide">
          <div className="hero-slide-content w-full max-w-4xl mx-auto px-4 lg:px-8 text-center">
            {/* Badge */}
            <div className="hero-badge inline-flex items-center gap-2 bg-base-content/5 backdrop-blur-sm border border-base-content/10 rounded-full px-5 py-2 mb-8">
              <span className="text-sm font-medium text-base-content/80">
                {active.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="hero-title text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
              {active.title}{" "}
              <span
                className={`bg-gradient-to-r ${highlightGradients[active.accentColor]} bg-clip-text text-transparent`}
              >
                {active.highlight}
              </span>
            </h1>

            {/* Description */}
            <p className="hero-desc text-base sm:text-lg text-base-content/60 max-w-2xl mx-auto leading-relaxed mb-10">
              {active.description}
            </p>

            {/* CTA Buttons */}
            <div className="hero-btns flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to={active.cta.to}
                className="btn btn-primary btn-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] transition-all duration-300 rounded-xl border-0 bg-gradient-to-r from-primary to-secondary text-white px-8 font-semibold"
              >
                {active.cta.text}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
              <a
                href={active.ctaSecondary.to}
                className="btn btn-ghost btn-lg rounded-xl font-semibold text-base-content/70 hover:text-primary hover:bg-primary/5 px-8"
              >
                {active.ctaSecondary.text}
              </a>
            </div>

            {/* Slide Dots */}
            <div className="hero-dots flex items-center justify-center gap-2 mt-14">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-500 ${
                    idx === currentSlide
                      ? "w-10 bg-gradient-to-r from-primary to-secondary"
                      : "w-2.5 bg-base-content/20 hover:bg-base-content/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════ FEATURED LESSONS ══════════════════════ */}
      <section id="featured" className="relative py-20 lg:py-28 px-4 lg:px-8 overflow-hidden">
        <div className="mesh-bg-2" />

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary/80 bg-primary/10 rounded-full px-4 py-1.5 mb-4">
              Curated For You
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              Featured{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Life Lessons
              </span>
            </h2>
            <p className="mt-4 text-base-content/60 max-w-lg mx-auto text-sm sm:text-base">
              Handpicked lessons from real-world experiences, designed to help
              you navigate life&apos;s most important challenges.
            </p>
          </div>

          {/* Lesson Cards */}
          {lessonsLoading ? (
            /* Loading Skeleton */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="card bg-base-200/50 border border-base-content/5 rounded-2xl overflow-hidden"
                >
                  <div className="h-48 bg-base-300/50 skeleton-shimmer" />
                  <div className="card-body gap-3">
                    <div className="h-4 w-20 bg-base-300/60 rounded-full" />
                    <div className="h-6 w-4/5 bg-base-300/60 rounded-lg" />
                    <div className="space-y-2 mt-1">
                      <div className="h-3 w-full bg-base-300/40 rounded" />
                      <div className="h-3 w-3/4 bg-base-300/40 rounded" />
                    </div>
                    <div className="h-8 w-28 bg-base-300/50 rounded-lg mt-3" />
                  </div>
                </div>
              ))}
            </div>
          ) : lessons.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {lessons.slice(0, 6).map((lesson) => (
                <div
                  key={lesson._id}
                  className="group card bg-base-100/80 backdrop-blur-sm border border-base-content/5 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-base-content/5 hover:-translate-y-1 transition-all duration-300"
                >
                  {lesson.image && (
                    <figure className="relative overflow-hidden h-48">
                      <img
                        src={lesson.image}
                        alt={lesson.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-base-100/60 to-transparent" />
                      {lesson.category && (
                        <span className="absolute top-3 left-3 badge badge-sm bg-primary/90 text-white border-0 font-medium">
                          {lesson.category}
                        </span>
                      )}
                    </figure>
                  )}
                  <div className="card-body p-5">
                    {!lesson.image && lesson.category && (
                      <span className="badge badge-sm bg-primary/10 text-primary border-0 font-medium w-fit">
                        {lesson.category}
                      </span>
                    )}
                    <h3 className="card-title text-lg font-bold leading-snug">
                      {lesson.title}
                    </h3>
                    <p className="text-sm text-base-content/60 line-clamp-2 leading-relaxed">
                      {lesson.description || lesson.excerpt}
                    </p>
                    <div className="card-actions mt-auto pt-3">
                      <Link
                        to={`/lessons/${lesson._id}`}
                        className="btn btn-sm btn-primary btn-outline rounded-lg font-medium text-xs gap-1"
                      >
                        Read Lesson
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3.5 w-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State — show placeholder cards if no backend data */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "The Power of Saying No",
                  category: "Boundaries",
                  desc: "Learning to set healthy boundaries is one of the most important life skills. Discover how saying no opens doors to what truly matters.",
                  emoji: "🛡️",
                },
                {
                  title: "Financial Literacy 101",
                  category: "Finance",
                  desc: "From budgeting basics to compound interest — the money lessons school never taught you, explained through relatable real-world scenarios.",
                  emoji: "💰",
                },
                {
                  title: "Building Resilience After Failure",
                  category: "Mindset",
                  desc: "Failure is not the opposite of success, it is part of it. Learn how to bounce back stronger using proven psychological frameworks.",
                  emoji: "🔥",
                },
                {
                  title: "Effective Communication Skills",
                  category: "Relationships",
                  desc: "Master the art of listening, assertive speaking, and reading body language to transform your personal and professional relationships.",
                  emoji: "💬",
                },
                {
                  title: "Time Management That Works",
                  category: "Productivity",
                  desc: "Move beyond to-do lists. Discover energy management, deep work blocks, and the 80/20 principle to make every hour count.",
                  emoji: "⏰",
                },
                {
                  title: "Navigating Career Transitions",
                  category: "Career",
                  desc: "Whether you are switching industries or climbing the ladder, learn frameworks for making confident career decisions without regret.",
                  emoji: "🚀",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="group card bg-base-100/80 backdrop-blur-sm border border-base-content/5 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-base-content/5 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="h-48 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 flex items-center justify-center">
                    <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                      {item.emoji}
                    </span>
                  </div>
                  <div className="card-body p-5">
                    <span className="badge badge-sm bg-primary/10 text-primary border-0 font-medium w-fit">
                      {item.category}
                    </span>
                    <h3 className="card-title text-lg font-bold leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-sm text-base-content/60 line-clamp-2 leading-relaxed">
                      {item.desc}
                    </p>
                    <div className="card-actions mt-auto pt-3">
                      <Link
                        to="/register"
                        className="btn btn-sm btn-primary btn-outline rounded-lg font-medium text-xs gap-1"
                      >
                        Read Lesson
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3.5 w-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════ WHY LEARNING FROM LIFE MATTERS ══════════════════════ */}
      <section
        id="benefits"
        ref={benefitsRef}
        className="relative py-20 lg:py-28 px-4 lg:px-8 overflow-hidden bg-gradient-to-b from-base-100 via-base-200/50 to-base-100"
      >
        {/* Decorative blurred blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-secondary/80 bg-secondary/10 rounded-full px-4 py-1.5 mb-4">
              Our Philosophy
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              Why Learning From Life{" "}
              <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                Matters
              </span>
            </h2>
            <p className="mt-4 text-base-content/60 max-w-xl mx-auto text-sm sm:text-base">
              The most valuable lessons are not found in textbooks — they come
              from lived experiences, shared wisdom, and the courage to grow.
            </p>
          </div>

          {/* Benefit Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="benefit-card benefit-card-anim rounded-2xl p-6 sm:p-7 flex flex-col group cursor-default"
              >
                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-xl ${iconBoxStyles[benefit.color]} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                >
                  {benefit.icon}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold mb-3 tracking-tight">
                  {benefit.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-base-content/60 leading-relaxed flex-1">
                  {benefit.description}
                </p>

                {/* Decorative bottom accent */}
                <div
                  className={`h-1 w-12 rounded-full bg-gradient-to-r ${accentBarStyles[benefit.color]} mt-5 opacity-40 group-hover:opacity-100 group-hover:w-20 transition-all duration-500`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ BOTTOM CTA ══════════════════════ */}
      <section className="relative py-20 lg:py-28 px-4 lg:px-8 overflow-hidden">
        <div className="mesh-bg-1" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Ready to Start Your{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Learning Journey
            </span>
            ?
          </h2>
          <p className="text-base-content/60 mb-10 max-w-lg mx-auto text-sm sm:text-base">
            Join thousands of learners who are transforming their lives through
            curated, AI-powered life lessons. It is free to get started.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="btn btn-primary btn-lg rounded-xl border-0 bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] transition-all duration-300 px-10 font-semibold"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="btn btn-ghost btn-lg rounded-xl font-semibold text-base-content/70 hover:text-primary hover:bg-primary/5 px-10"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
