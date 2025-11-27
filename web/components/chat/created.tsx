import { ChevronRight } from "lucide-react";
import * as motion from "motion/react-client"
export default function CreatedMessage({ message }: { message: string }) {
    
	return (
		
			<motion.div 
            initial={{x:-10, opacity:0}}
            animate={{x:0 , opacity:1}}
            transition={{duration:0.25, }}
            className="flex items-center gap-2 text-sm px-4 py-2 text-neutral-400 font-light">
			    <ChevronRight size={14} className="text-neutral-500"/>
            <span className="text-neutral-500">Created</span> <span className="text-neutral-300">{message}</span>
			</motion.div>
	);
}
