/// <reference types="vite/client" />
declare module "vue-router"
declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
    const component: DefineComponent<{}, {}, any>
    export default component
}
declare module "file-saver"
declare module 'js-table2excel'
declare module 'xlsx'
