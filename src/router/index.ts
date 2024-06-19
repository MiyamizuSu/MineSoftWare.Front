import {createRouter, createWebHistory} from "vue-router";
import loginVue from "@/components/pages/login_View.vue";
import main_NoL_View from "@/components/pages/main_NoL_View.vue";
import main_View from "@/components/pages/main_View.vue";
import userMessage_View from "@/components/pages/userMessage_View.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/login", component: loginVue
        },
        {
            path: "/basicView", component: main_NoL_View
        },
        {
            path: "/mainView", component: main_View
        },
        {
            path:"/userMessageView",component: userMessage_View
        }
    ]
})
export default router
