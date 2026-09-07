import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-ClXSlXuj.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-CJlM7wT9.js
var getMyProfile = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("43089abf67b0d2fc04dd8ee11c57f4f4a6f26a675e0ebab772a5634a77d97f36"));
var saveProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("854605820778abbe8f2c5b7d50045c49cbdf890eebaf119e66a983bc632fccaa"));
var listNotifications = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("86f38247329951960eea54954c1f8a433b29652b8b4265d9284835c12dd9e899"));
var markNotificationsRead = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("47b55f282af337a8053ad8b7a9a7c43a5a576fb942380dd3ccdfacb45eb3bbc5"));
//#endregion
export { saveProfile as i, listNotifications as n, markNotificationsRead as r, getMyProfile as t };
