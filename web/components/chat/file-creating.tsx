import * as motion from "motion/react-client";
import { Check } from "lucide-react";

export default function FileCreating({ message, completed = false }: { message: string; completed?: boolean }) {
	return (
		<motion.div
			initial={{ x: -10, opacity: 0 }}
			animate={{ x: 0, opacity: 1 }}
			transition={{ duration: 0.25 }}
			className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-400"
		>
			<div className="relative w-4 h-4 flex items-center justify-center">
				{completed ? (
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{ duration: 0.2 }}
					>
						<Check size={16} className="text-green-500" />
					</motion.div>
				) : (
					<motion.div
						className="absolute inset-0 border-2 border-neutral-600 border-t-neutral-400 rounded-full"
						animate={{ rotate: 360 }}
						transition={{
							duration: 1,
							repeat: Infinity,
							ease: "linear",
						}}
					/>
				)}
			</div>
			<span className="text-neutral-300 font-light">{message}</span>
		</motion.div>
	);
}

