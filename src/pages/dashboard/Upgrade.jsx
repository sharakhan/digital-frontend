import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useUserRole from "../../hooks/useUserRole";
import toast from "react-hot-toast";

/* ── Plan features ── */
const features = [
  { label: "Access to free lessons", free: true, premium: true },
  { label: "Browse & search lessons", free: true, premium: true },
  { label: "Like & save favorites", free: true, premium: true },
  { label: "Create your own lessons", free: true, premium: true },
  { label: "Unlock premium lessons", free: false, premium: true },
  { label: "Publish premium content", free: false, premium: true },
  { label: "Advanced analytics dashboard", free: false, premium: true },
  { label: "Priority community support", free: false, premium: true },
  { label: "Ad-free experience", free: false, premium: true },
  { label: "Early access to new features", free: false, premium: true },
];

const Upgrade = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const { isPremium, isRoleLoading } = useUserRole();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Please login first");
      return;
    }
    setLoading(true);
    try {
      const res = await axiosSecure.post("/payment/create-checkout-session", {
        email: user.email,
        name: user.displayName,
      });
      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        toast.error("Failed to create checkout session");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ── Already premium ── */
  if (!isRoleLoading && isPremium) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">
            Your{" "}
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              Plan
            </span>
          </h1>
          <p className="text-sm text-base-content/50">
            Manage your subscription and billing.
          </p>
        </div>

        <div className="max-w-lg">
          <div className="card bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-yellow-500/10 border border-amber-500/20 rounded-2xl overflow-hidden">
            <div className="card-body items-center text-center p-8">
              {/* Badge */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-xl shadow-amber-500/30 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>

              <h2 className="text-2xl font-bold mb-1">Premium Member ⭐</h2>
              <p className="text-sm text-base-content/50 mb-6 max-w-sm">
                You have full access to all premium features, lessons, and
                exclusive content. Thank you for your support!
              </p>

              <div className="flex flex-wrap gap-2 justify-center mb-6">
                {[
                  "Premium Lessons",
                  "Ad-Free",
                  "Priority Support",
                  "Analytics",
                  "Early Access",
                ].map((perk) => (
                  <span
                    key={perk}
                    className="badge bg-amber-500/15 text-amber-700 border-0 font-medium text-xs gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {perk}
                  </span>
                ))}
              </div>

              <Link
                to="/dashboard"
                className="btn btn-ghost rounded-xl font-medium text-base-content/60"
              >
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Pricing UI ── */
  return (
    <div>
      {/* ── Header ── */}
      <div className="mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">
          Upgrade to{" "}
          <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
            Premium
          </span>
        </h1>
        <p className="text-sm text-base-content/50">
          Unlock the full DigiLife experience with premium features.
        </p>
      </div>

      {/* ── Plan Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mb-12">
        {/* Free Plan */}
        <div className="card bg-base-100 border border-base-content/8 rounded-2xl">
          <div className="card-body p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-base-content/5 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg">Free</h3>
                <p className="text-xs text-base-content/40">Current Plan</p>
              </div>
            </div>

            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-extrabold">$0</span>
              <span className="text-sm text-base-content/40">/month</span>
            </div>

            <ul className="space-y-3 mb-6">
              {features.map((f, i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm">
                  {f.free ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 text-green-500 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 text-base-content/20 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  <span className={f.free ? "text-base-content/70" : "text-base-content/30 line-through"}>
                    {f.label}
                  </span>
                </li>
              ))}
            </ul>

            <button className="btn btn-ghost bg-base-content/5 rounded-xl w-full font-medium" disabled>
              Current Plan
            </button>
          </div>
        </div>

        {/* Premium Plan */}
        <div className="card bg-gradient-to-br from-amber-500/5 via-base-100 to-orange-500/5 border-2 border-amber-500/30 rounded-2xl relative overflow-hidden">
          {/* Ribbon */}
          <div className="absolute top-4 right-4">
            <span className="badge bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 font-bold text-xs px-3 py-2.5 shadow-lg shadow-amber-500/30">
              RECOMMENDED
            </span>
          </div>

          <div className="card-body p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md shadow-amber-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg">Premium</h3>
                <p className="text-xs text-amber-600 font-medium">Full Access</p>
              </div>
            </div>

            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-extrabold">$9.99</span>
              <span className="text-sm text-base-content/40">/month</span>
            </div>
            <p className="text-xs text-base-content/40 mb-6">
              Cancel anytime. No hidden fees.
            </p>

            <ul className="space-y-3 mb-6">
              {features.map((f, i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 text-amber-500 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-base-content/70">{f.label}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={handleCheckout}
              disabled={loading || isRoleLoading}
              className="btn rounded-xl w-full border-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] transition-all duration-300 text-sm"
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Upgrade Now — $9.99/mo
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Comparison Table ── */}
      <div className="max-w-3xl">
        <h2 className="text-lg font-bold mb-4 tracking-tight flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Feature Comparison
        </h2>
        <div className="overflow-x-auto border border-base-content/5 rounded-2xl bg-base-100">
          <table className="table">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-base-content/40">
                <th>Feature</th>
                <th className="text-center">Free</th>
                <th className="text-center">
                  <span className="text-amber-600">Premium ⭐</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((f, i) => (
                <tr key={i} className="hover">
                  <td className="text-sm font-medium text-base-content/70">
                    {f.label}
                  </td>
                  <td className="text-center">
                    {f.free ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-base-content/15 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 12H6" />
                      </svg>
                    )}
                  </td>
                  <td className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── FAQ ── */}
      <div className="max-w-3xl mt-12">
        <h2 className="text-lg font-bold mb-4 tracking-tight">
          Frequently Asked Questions
        </h2>
        <div className="space-y-2">
          {[
            {
              q: "Can I cancel anytime?",
              a: "Yes, you can cancel your subscription at any time from your account settings. You will retain access until the end of your billing period.",
            },
            {
              q: "What payment methods do you accept?",
              a: "We accept all major credit cards, debit cards, and digital wallets through our secure Stripe payment gateway.",
            },
            {
              q: "Is there a free trial?",
              a: "We do not offer a free trial at this time, but our Free plan gives you access to a large library of lessons so you can experience the platform first.",
            },
          ].map((faq, i) => (
            <div key={i} className="collapse collapse-arrow bg-base-100 border border-base-content/5 rounded-xl">
              <input type="radio" name="faq-accordion" />
              <div className="collapse-title text-sm font-semibold">
                {faq.q}
              </div>
              <div className="collapse-content">
                <p className="text-sm text-base-content/60 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Upgrade;
