// theme.js
import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

// color design tokens export
export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        grey: {
          100: "#e0e0e0",
          200: "#c2c2c2",
          300: "#a3a3a3",
          400: "#858585",
          500: "#666666",
          600: "#525252",
          700: "#f0f0f0",
          800: "#292929",
          900: "#141414",
          1000: "#222831", //sidebar navbar dark mode
          1100: "#31363F", //abu dark mode
          1200: "#474E68",
          1300: "#1a1a1a", //abu gelap banget
          1400: "#5C5470", //abu terang
        },
        primary: {
          100: "#d0d1d5",
          200: "#a1a4ab",
          300: "#727681",
          400: "#1F2A40",
          500: "#141b2d",
          600: "#101624",
          700: "#0c101b",
          800: "#080b12",
          900: "#040509",
          1000: "#092D53",
          1100: "#ffffff",
        },
        greenAccent: {
          100: "#dbf5ee",
          200: "#b7ebde",
          300: "#94e2cd",
          400: "#70d8bd",
          500: "#4cceac",
          600: "#3da58a",
          700: "#2e7c67",
          800: "#1e5245",
          900: "#0f2922",
          1000: "#4cceac", //hijau button
          1100: "#66BB6A", //hijau button 2
        },
        redAccent: {
          100: "#f8dcdb",
          200: "#f1b9b7",
          300: "#e99592",
          400: "#e2726e",
          500: "#db4f4a",
          600: "#af3f3b",
          700: "#832f2c",
          800: "#58201e",
          900: "#2c100f",
        },
        blueAccent: {
          100: "#e1e2fe",
          200: "#c3c6fd",
          300: "#a4a9fc",
          400: "#868dfb",
          500: "#6870fa",
          600: "#535ac8",
          700: "#3e4396",
          800: "#033061",
          900: "#00458E",
          1000: "#a8acfd", 
          1100: "#00A9FF", 
          1200: "#092D53", 
          1500: "#41abff", //untuk tema terang
        },
        yellowAccent: {
          100: "#fff9e0",
          200: "#fff3c2",
          300: "#ffeaa4",
          400: "#ffe186",
          500: "#ffda5a", // Warna kuning utama yang benar
          600: "#ccae48",
          700: "#997a36",
          800: "#665524",
          900: "#332b12",
        },
        bgcolor: {
          100: "#31363F", //darkmode
          200: "#f4f6f9", //lightmode
        }
      }
    : {
        grey: {
          100: "#141414",
          200: "#292929",
          300: "#3d3d3d",
          400: "#525252",
          500: "#666666",
          600: "#858585",
          700: "#f0f0f0", //search enggine terang 
          800: "#c2c2c2",
          900: "#e0e0e0",
          1000: "#222831", //sidebar navbar dark mode
          1100: "#31363F", //abu dark mode
          1200: "#474E68", 
          1300: "#1a1a1a", //abu gelap banget
          1400: "#5C5470", //abu terang

        },
        primary: {
          100: "#040509",
          200: "#080b12",
          300: "#0c101b",
          400: "#f2f0f0", // manually changed
          500: "#141b2d",
          600: "#1F2A40",
          700: "#727681",
          800: "#a1a4ab",
          900: "#d0d1d5",
          1000: "#092D53",
          1100: "#ffffff",
        },
        greenAccent: {
          100: "#0f2922",
          200: "#1e5245",
          300: "#2e7c67",
          400: "#3da58a",
          500: "#4cceac",
          600: "#70d8bd",
          700: "#94e2cd",
          800: "#b7ebde",
          900: "#dbf5ee",
          1000: "#4cceac", //hijau button
          1100: "#66BB6A", //hijau button 2
        },
        redAccent: {
          100: "#2c100f",
          200: "#58201e",
          300: "#832f2c",
          400: "#af3f3b",
          500: "#db4f4a",
          600: "#e2726e",
          700: "#e99592",
          800: "#f1b9b7",
          900: "#f8dcdb",
        },
        blueAccent: {
          100: "#151632",
          200: "#2a2d64",
          300: "#3e4396",
          400: "#535ac8",
          500: "#6870fa",
          600: "#868dfb",
          700: "#a4a9fc",
          800: "#c3c6fd",
          900: "#e1e2fe",
          1000: "#a8acfd", 
          1100: "#00A9FF", 
          1200: "#092D53", 
          1500: "#41abff", //untuk tema terang
        },
        yellowAccent: {
          100: "#fff9e0",
          200: "#fff3c2",
          300: "#ffeaa4",
          400: "#ffe186",
          500: "#ffda5a", // Warna kuning utama yang benar
          600: "#ccae48",
          700: "#997a36",
          800: "#665524",
          900: "#332b12",
        },
        bgcolor: {
          100: "#31363F", //darkmode
          200: "#ffffff", //lightmode
        }

      }),
});

// mui theme settings
export const themeSettings = (mode) => {
  const colors = tokens(mode);
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // palette values for dark mode
            primary: {
              main: colors.primary[500],
            },
            secondary: {
              main: colors.greenAccent[500],
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
            background: {
              default: colors.grey[1000], // warna background dark
            },
          }
        : {
            // untuk light mode
            primary: {
              main: colors.primary[100],
            },
            secondary: {
              main: colors.greenAccent[500],
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
            background: {
              default: "#ffffff", // warna background light 
            },
          }),
    },
    typography: {
      fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
      fontSize: 16,
      h1: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};

// context for color mode
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  const [mode, setMode] = useState("dark");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return [theme, colorMode];
};
