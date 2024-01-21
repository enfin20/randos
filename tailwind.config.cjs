module.exports = {
  mode: "jit",
  content: ["./src/**/*.{html,js,svelte,ts}"],
  variants: {
    extend: {
      visibility: ["group-hover"],
    },
  },
  theme: {
    extend: {
      colors: {
        pct: "rgb(0, 110, 118)",
        ht: "rgb(33, 150, 223)",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
