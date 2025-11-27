import { CheckCircle } from "lucide-react";
import * as motion from "motion/react-client";

export default function Finished({ message }: { message: string }) {
	return (
		<motion.div
			initial={{ x: -10, opacity: 0 }}
			animate={{ x: 0, opacity: 1 }}
			transition={{ duration: 0.25 }}
			className="flex items-center gap-2 text-sm px-4 py-2 text-neutral-400 font-light"
		>
			<CheckCircle size={14} className="text-green-500" />
			<span className="text-neutral-500">Application Ready at</span>
			<a
				href={message}
				target="_blank"
				rel="noopener noreferrer"
				className="text-blue-400 hover:text-blue-300 underline transition-colors"
			>
				{message}
			</a>
		</motion.div>
	);
}