import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";

const PaymentCancel = () => {
  const pageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".cancel-anim", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.2,
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={pageRef}
      className="min-h-screen flex items-center justify-center px-4 py-16"
    >
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="cancel-anim w-20 h-20 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>

        <h1 className="cancel-anim text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          Payment{" "}
          <span className="text-amber-500">Cancelled</span>
        </h1>

        <p className="cancel-anim text-base-content/60 text-sm leading-relaxed mb-3">
          Your payment was not processed. No charges have been made to
          your account.
        </p>

        <p className="cancel-anim text-base-content/40 text-xs mb-8">
          If you changed your mind, you can always upgrade later from your
          dashboard. Our Premium plan is just $9.99/month with no commitments.
        </p>

        <div className="cancel-anim flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/dashboard/upgrade"
            className="btn rounded-xl border-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300 px-8"
          >
            Try Again
          </Link>
          <Link
            to="/dashboard"
            className="btn btn-ghost rounded-xl font-medium text-base-content/60"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
