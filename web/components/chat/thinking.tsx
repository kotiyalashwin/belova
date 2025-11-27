import { Lightbulb } from "lucide-react";
import * as motion from "motion/react-client";
import { Card, CardContent, CardHeader } from "../ui/card";

const Thinking = ({ message }: { message: string }) => {
	return (
		<motion.div
			initial={{ scale: 0, opacity: 0, originX: 0, originY: 0 }}
			animate={{ scale: 1, opacity: 1 }}
			transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full"
		>
			<Card className="bg-neutral-900/30 border border-neutral-800/50 rounded-lg p-3 max-w-[85%]">
				<CardHeader className="flex items-center p-0 pb-2 gap-2 text-neutral-500">
					<Lightbulb size={16} className="text-neutral-500" />
					<span className="text-xs font-medium uppercase tracking-wide">Thought Process</span>
				</CardHeader>
				<CardContent className="space-y-2 text-sm p-0 text-neutral-300 leading-relaxed">
					{message}
				</CardContent>
			</Card>
		</motion.div>
	);
};

export default Thinking;
