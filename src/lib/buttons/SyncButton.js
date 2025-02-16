import { useState, useRef } from "react";
import { RefreshCw } from "lucide-react";
import gsap from "gsap";

export default function SyncButton({ onSync }) {
    const [loading, setLoading] = useState(false);
    const iconRef = useRef(null);

    const handleClick = async () => {
        if (loading) return;
        setLoading(true);

        // Animate icon spin
        gsap.to(iconRef.current, { rotation: "+=360", duration: 0.6, ease: "power2.inOut", repeat: 1 });

        try {
            await onSync(); // Call the function passed as a prop
        } catch (error) {
            console.error("Sync error:", error);
        }

        setLoading(false);
    };

    return (
        <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200"
            onClick={handleClick}
            disabled={loading}
        >
            {/* <span>Sync</span> */}
            <RefreshCw
                ref={iconRef}
                className={`w-5 h-5 ${loading ? "opacity-80" : ""}`}
            />
        </button>
    );
}
