import { createRouter, createWebHistory } from "vue-router";
import loginVue from "@/components/pages/Login_View.vue";
import main_NoL_View from "@/components/pages/Main_NoL_View.vue";
import main_View from "@/components/pages/Main_View.vue";
import userMessage_View from "@/components/pages/UserMessage_View.vue";
import ConferenceManagement from "@/components/subPages/ConferenceManagement.vue";
import CourseManagement from "@/components/subPages/CourseManagement.vue";
import DynamicManagement from "@/components/subPages/DynamicManagement.vue";

const routes = [
    {
        path: "/login",
        component: loginVue
    },
    {
        path: "/basicView",
        component: main_NoL_View
    },
    {
        path: "/mainView",
        component: main_View,
        children: [
            {
                path: "conferenceManagement",
                component: ConferenceManagement,
            },
            {
                path: "courseManagement",
                component: CourseManagement,
            },
            {
                path: "dynamicManagement",
                component: DynamicManagement,
            }
        ]
    },
    {
        path: "/userMessageView",
        component: userMessage_View
    },
    {
        path: "/",
        redirect: "/basicView"
    },
    {
        path: "/:pathMatch(.*)*",
        redirect: "/basicView"
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes: routes
});

export default router;

