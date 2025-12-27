/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_ENV?: string
    readonly VITE_APP_VERSION?: string
    readonly VITE_BUILD_ID?: string
    readonly VITE_API_URL?: string
    readonly VITE_WS_URL?: string
    readonly VITE_FEATURE_FLAGS?: string
    readonly VITE_DEBUG?: string
    readonly VITE_MOCK_AUTH?: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
