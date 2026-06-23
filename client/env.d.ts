/// <reference types="vite/client" />

declare module "*.webp?*" {
  const src: string;
  export default src;
}

declare module "*.webp?v=2" {
  const src: string;
  export default src;
}

interface ImportMetaEnv {
  readonly VITE_GA_MEASUREMENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
