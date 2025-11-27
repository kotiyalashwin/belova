import { ChevronRight } from "lucide-react";
import * as motion from "motion/react-client";
import { TerminalIcon } from "lucide-react";
export default function Terminal({ command }: { command: string }) {
  return (
    <motion.div
      initial={{ x: -10, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="bg-neutral-900/40 border border-neutral-800/50 rounded-lg overflow-hidden font-mono text-xs flex flex-col max-w-[85%]"
    >
        <div className="w-full border-b border-neutral-800/50 px-3 py-2 bg-neutral-900/50">
          <TerminalIcon size={14} className="text-neutral-500"/>
        </div>

      <motion.span
        initial={{ opacity: 0.6 }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2.5, repeat: 2, ease: "easeInOut" }}
        className="text-neutral-300 px-3 py-2.5 break-all"
      >
        {command}
      </motion.span>
    </motion.div>
  );
}

