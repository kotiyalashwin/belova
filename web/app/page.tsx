import type { Easing } from "motion";
import * as motion from "motion/react-client";
import InputCard from "@/components/prompt-card";


const variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.5, ease: "easeOut" as Easing },
  },
};

export default function Home() {
  return (
    <div className="h-screen w-screen flex justify-center items-center relative overflow-hidden bg-black">
      <motion.div
        variants={variants}
        initial="hidden"
        animate="show"
        className="absolute flex justify-evenly inset-0 w-screen"
      >
        <p  className="text-[20rem] text-neutral-300">BELOVA</p>
      </motion.div>

      <InputCard />

      <div className="absolute inset-0 w-screen flex items-end justify-center pointer-events-none">
        <div className="absolute h-[1200px] w-full translate-y-1/2 rounded-full blur-3xl bg-[radial-gradient(circle_at_center,_#FDBA74_0%,_#FB923C_40%,_transparent_80%)]" />

        <motion.div className="absolute h-[1000px] w-[1400px] translate-y-1/2 rounded-full blur-2xl bg-[radial-gradient(circle_at_center,_#FCD34D_0%,_#F97316_50%,_transparent_100%)]" />

        <motion.div className="absolute h-[800px] w-[1200px] translate-y-1/2 rounded-full blur-2xl opacity-70 bg-[radial-gradient(circle_at_center,_#FFE4A6_0%,_#FECF7F_40%,_transparent_100%)]" />
      </div>
      <motion.a
        href="https://twitter.com/YOUR_HANDLE"
        target="_blank"
        rel="noopener noreferrer"
        className="
    absolute bottom-6 
    text-neutral-400 
    hover:text-neutral-200 
    transition-colors 
    text-sm 
    pointer-events-auto
  "
      >
        Developed by <span className="font-medium">Ashwin</span>
      </motion.a>
    </div>
  );
}
