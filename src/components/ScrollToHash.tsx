import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToHash = () => {
    const { hash, pathname } = useLocation();

    useEffect(() => {
        const scrollToElement = () => {
            if (hash) {
                const id = hash.replace("#", "");
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                }
            } else if (pathname === "/") {
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        };

        // Small timeout to allow the browser to finish rendering
        const timer = setTimeout(scrollToElement, 100);
        return () => clearTimeout(timer);
    }, [hash, pathname]);

    return null;
};

export default ScrollToHash;
