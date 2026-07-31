/// <reference types="vite/client" />

declare module "*.webp?*" {
  const src: string;
  export default src;
}

declare module "*.webp?v=2" {
  const src: string;
  export default src;
}

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NEXT_PUBLIC_GA_MEASUREMENT_ID?: string;
  }
}
