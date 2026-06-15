// Shared registry mapping a company's logo key (from src/data/companies.js)
// to its real brand asset in public/logos/ plus display metadata.
// Used by the animated LogoWall and the Experience timeline so both render
// the same real logos (white at rest, brand color restored on hover).
//
//   img          – path to the real asset in public/logos/
//   colorOnHover – restore the baked brand color on hover (false = stay white)
//   brandColor   – accent used for hover glow / labels
//   pixelColors  – palette for the LogoWall pixel-shimmer canvas
//   wallHeight   – rendered logo height (px) inside the LogoWall cells

const baseUrl = import.meta.env.BASE_URL || "/";

export const LOGO_ASSETS = {
  TrypLogo: {
    img: `${baseUrl}logos/tryp.svg`, // baked orange
    colorOnHover: true,
    brandColor: "#FF6B00",
    pixelColors: ["#FF6B00", "#FF8C33", "#CC5500"],
    wallHeight: 24,
  },
  NovoNordiskLogo: {
    img: `${baseUrl}logos/novo-nordisk.svg`, // baked blue
    colorOnHover: true,
    brandColor: "#2F6BE0",
    pixelColors: ["#2563EB", "#3B82F6", "#60A5FA"],
    wallHeight: 44,
  },
  PeermindLogo: {
    img: `${baseUrl}logos/peermind.png`, // black artwork → always white
    colorOnHover: false,
    brandColor: "#FFFFFF",
    pixelColors: ["#FFFFFF", "#E5E7EB", "#9CA3AF"],
    wallHeight: 40,
  },
  RucLogo: {
    img: `${baseUrl}logos/ruc.svg`, // white logo
    colorOnHover: false,
    brandColor: "#FFFFFF",
    pixelColors: ["#FFFFFF", "#E5E7EB", "#9CA3AF"],
    wallHeight: 34,
  },
  CoreAILogo: {
    img: `${baseUrl}logos/bevar-ukraine.svg`, // multicolor: red / yellow / blue
    colorOnHover: true,
    brandColor: "#0057B7",
    pixelColors: ["#DC202D", "#FDD202", "#0057B7"],
    wallHeight: 30,
  },
};
