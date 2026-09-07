import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-ClXSlXuj.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai-6z1P--NT.js
var askAssistant = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("8588707f9edacd23d5b70905cf6dfa3e4d91ffbf23f534c51c874f891e550260"));
var listAiMessages = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input = {}) => input).handler(createSsrRpc("96608e3a59ad2ed5b9cc6cb2411efdd4e2385d207d2ee88fbf14cc4a9c6f6ca9"));
var parseBillOcr = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("17e1ada9a07f871faac4a486cd96bd5ea39000843cfb480a6f55a00c054990ff"));
var annotatePhoto = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("0399bdf8837e81b9c25f16c497ab642f0df4a787e0e5ddb496e440da1838ccc3"));
var extractPlanQuantities = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("5e27f30e9c9e20d659ffcad35fbee2491cbefdf859a2579a5e3ae9b66da5039c"));
var optimizeSchedule = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("9c9a6f1b154e71ef90596c4ff21b37d4e2304a37d7a7f92ede28578d103b4de3"));
//#endregion
export { optimizeSchedule as a, listAiMessages as i, askAssistant as n, parseBillOcr as o, extractPlanQuantities as r, annotatePhoto as t };
