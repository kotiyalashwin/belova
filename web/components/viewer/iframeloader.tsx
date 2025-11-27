'use client'
import { Loader } from "lucide-react";
import { useState } from "react";

export default function IframeWithLoader({prevUrl}:{prevUrl:string | null}) {
    const [loaded, setLoaded] = useState(false);

    return (
        <div className="w-full h-full">
            {!loaded  || !prevUrl && (
                <div className="flex gap-4">
                    <Loader className="animate-spin"/>
                    <span>Generating Preview...</span>

                </div>
            )}
            <iframe
                title="preview"
                src={prevUrl ?? ""}
                onLoad={() => setLoaded(true)}
                className="w-full h-full border-none"
            />
        </div>
    );
}
