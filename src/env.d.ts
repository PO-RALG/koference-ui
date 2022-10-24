/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  // more env variables...
  readonly VITE_APP_BASE_APP_NAME: string;
  readonly VITE_APP_SERVER_URL: string;
  readonly VITE_APP_PORT: number | string;
  readonly VITE_APP_PUBLIC_PATH: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
