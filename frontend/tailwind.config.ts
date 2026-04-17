import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        hestia: {
          gold:    "#B8935A",   // 깊은 앤티크 골드
          "gold-light": "#D4AF78", // 밝은 골드 (호버)
          cream:   "#FAF7F2",   // 따뜻한 크림
          dark:    "#1A1714",   // 깊은 다크브라운
          gray:    "#7A7370",   // 웜 그레이
          white:   "#FFFFFF",
          light:   "#F2EDE6",   // 섹션 배경
          muted:   "#EDE8E0",   // 보더, 구분선
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        cormorant: ["var(--font-cormorant)", "Georgia", "serif"],
        playfair: ["var(--font-cormorant)", "Georgia", "serif"], // 하위호환
        "dm-sans": ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        inter: ["var(--font-dm-sans)", "system-ui", "sans-serif"],   // 하위호환
        noto: ["var(--font-noto)", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};
export default config;
