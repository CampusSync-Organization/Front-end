import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import NodesBackground from "../../../components/NodesBackground";

const EASE = [0.22, 1, 0.36, 1];

export default function AuthAside({ eyebrow, title, subtitle }) {
  return (
    <div className="hidden lg:flex lg:w-[52%] bg-[#14213D] relative overflow-hidden shrink-0 flex-col">
      <NodesBackground className="opacity-60" maxNodes={54} connectRadius={150} />
      <div className="absolute top-[-12%] left-[-10%] w-[520px] h-[520px] rounded-full bg-[#FCA311]/10 blur-[110px] pointer-events-none" />
      <div className="absolute bottom-[6%] right-[-16%] w-[420px] h-[420px] rounded-full bg-[#FCA311]/8 blur-[90px] pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(120% 90% at 30% 40%, transparent 35%, rgba(20,33,61,0.55) 100%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col h-full px-12 xl:px-16 py-10">
        <Link
          to="/"
          className="inline-flex items-center gap-3 text-white/80 hover:text-white transition-colors w-fit"
        >
          <img src="/campussync-icon.png" alt="CampusSync" className="h-9 w-auto object-contain" />
          <span className="text-base font-semibold tracking-tight">CampusSync</span>
        </Link>

        <div className="flex-1 flex flex-col justify-center">
          <Motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <p className="text-[#FCA311] text-sm font-semibold tracking-widest uppercase mb-4">
              {eyebrow}
            </p>
            <h2 className="text-[clamp(32px,3.4vw,48px)] font-bold text-white leading-[1.1] tracking-[-0.02em] mb-5">
              {title}
            </h2>
            <p className="text-white/45 text-[15px] leading-relaxed max-w-xs">
              {subtitle}
            </p>
          </Motion.div>
        </div>

        <p className="text-[12px] text-white/25">
          © {new Date().getFullYear()} CampusSync · Privacy · Terms
        </p>
      </div>
    </div>
  );
}
