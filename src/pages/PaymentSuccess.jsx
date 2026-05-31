import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import gsap from "gsap";

/* ── Inline success animation data ── */
const successAnimData = {"v":"5.7.1","fr":30,"ip":0,"op":60,"w":200,"h":200,"nm":"success","ddd":0,"assets":[],"layers":[{"ddd":0,"ind":1,"ty":4,"nm":"circle","sr":1,"ks":{"o":{"a":1,"k":[{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":10,"s":[0]},{"t":25,"s":[100]}]},"r":{"a":0,"k":0},"p":{"a":0,"k":[100,100,0]},"a":{"a":0,"k":[0,0,0]},"s":{"a":1,"k":[{"i":{"x":[0.667,0.667,0.667],"y":[1,1,1]},"o":{"x":[0.333,0.333,0.333],"y":[0,0,0]},"t":10,"s":[0,0,100]},{"i":{"x":[0.667,0.667,0.667],"y":[1,1,1]},"o":{"x":[0.333,0.333,0.333],"y":[0,0,0]},"t":25,"s":[110,110,100]},{"t":35,"s":[100,100,100]}]}},"ao":0,"shapes":[{"ty":"el","d":1,"s":{"a":0,"k":[120,120]},"p":{"a":0,"k":[0,0]},"nm":"circle","hd":false},{"ty":"fl","c":{"a":0,"k":[0.133,0.773,0.369,1]},"o":{"a":0,"k":100},"r":1,"bm":0,"nm":"fill","hd":false}],"ip":0,"op":60,"st":0},{"ddd":0,"ind":2,"ty":4,"nm":"check","sr":1,"ks":{"o":{"a":1,"k":[{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":25,"s":[0]},{"t":35,"s":[100]}]},"r":{"a":0,"k":0},"p":{"a":0,"k":[100,100,0]},"a":{"a":0,"k":[0,0,0]},"s":{"a":0,"k":[100,100,100]}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0]],"v":[[-20,0],[-7,13],[22,-12]],"c":false}},"nm":"path","hd":false},{"ty":"st","c":{"a":0,"k":[1,1,1,1]},"o":{"a":0,"k":100},"w":{"a":0,"k":8},"lc":2,"lj":2,"bm":0,"nm":"stroke","hd":false},{"ty":"tm","s":{"a":0,"k":0},"e":{"a":1,"k":[{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":25,"s":[0]},{"t":40,"s":[100]}]},"o":{"a":0,"k":0},"m":1,"nm":"trim","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0]},"a":{"a":0,"k":[0,0]},"s":{"a":0,"k":[100,100]},"r":{"a":0,"k":0},"o":{"a":0,"k":100}}],"nm":"check","hd":false}],"ip":0,"op":60,"st":0}]};

const PaymentSuccess = () => {
  const pageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".success-anim", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.3,
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
        {/* Lottie Animation */}
        <div className="success-anim w-40 h-40 mx-auto mb-2">
          {Lottie.default ? (
            <Lottie.default animationData={successAnimData} loop={false} autoplay />
          ) : (
            <Lottie animationData={successAnimData} loop={false} autoplay />
          )}
        </div>

        <h1 className="success-anim text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          Payment{" "}
          <span className="bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
            Successful!
          </span>
        </h1>

        <p className="success-anim text-base-content/60 text-sm leading-relaxed mb-4">
          Welcome to DigiLife Premium! Your account has been upgraded
          and you now have full access to all premium lessons and features.
        </p>

        <div className="success-anim flex flex-wrap gap-2 justify-center mb-8">
          {["Premium Lessons", "Ad-Free", "Priority Support", "Analytics"].map(
            (perk) => (
              <span
                key={perk}
                className="badge bg-green-500/10 text-green-600 border-0 font-medium text-xs gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {perk}
              </span>
            )
          )}
        </div>

        <div className="success-anim flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/dashboard"
            className="btn btn-primary rounded-xl border-0 bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 px-8"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/lessons"
            className="btn btn-ghost rounded-xl font-medium text-base-content/60"
          >
            Browse Premium Lessons
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
