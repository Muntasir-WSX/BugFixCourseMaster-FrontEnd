import { createContext, useContext, useEffect, useState, useMemo } from "react";

const ThemeContext = createContext(null);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within ThemeProvider");
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        try {
            const savedTheme = localStorage.getItem("theme");
            if (savedTheme) {
                return savedTheme;
            }
        } catch (err) {
            console.warn("Storage access denied for theme preference:", err);
        }

        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
            return "dark";
        }
        return "light";
    });

    useEffect(() => {
        const root = document.documentElement;

        // Apply DaisyUI theme attribute and standard Tailwind dark class
        root.setAttribute("data-theme", theme);
        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }

        try {
            localStorage.setItem("theme", theme);
        } catch (err) {
            console.warn("Failed to persist theme to localStorage:", err);
        }
    }, [theme]);

    // Listen for OS system preference changes if user hasn't explicitly set a custom theme override
    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = (e) => {
            try {
                if (!localStorage.getItem("theme")) {
                    setTheme(e.matches ? "dark" : "light");
                }
            } catch (err) {
                setTheme(e.matches ? "dark" : "light");
            }
        };

        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener("change", handleChange);
            return () => mediaQuery.removeEventListener("change", handleChange);
        }
    }, []);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};