import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-B4AAJXQg.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/projects-C8H6aJTU.js
var listProjects = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("0ab656f523a4a1840e55ff3fc0260d6c05d6398ec40527baec32aad1d39c60b9"));
var getProject = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("7a46f2d87e585938c9d2af069361195068a7b78cd354e58c7440b8edc0cfd103"));
var createProject = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("090d58db5bd3d48fd0ac6f4142ce8f3c0b86d6eb835de8383ba24570a4a07324"));
var updatePhase = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("49efee787eaf1e360b9a6af39e6b37e056a5abe3b6643ae7a1f2a44ac9d1ba8a"));
var previewEstimate = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("09d39eec2717a8ac11b7083e4dbd7fc0c52650154f45b772ed30f4b59e45f785"));
//#endregion
export { updatePhase as a, previewEstimate as i, getProject as n, listProjects as r, createProject as t };
