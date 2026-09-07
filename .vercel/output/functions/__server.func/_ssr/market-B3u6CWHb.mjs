import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-ClXSlXuj.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/market-B3u6CWHb.js
var listProfessionals = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input = {}) => input).handler(createSsrRpc("a5720b07415edc2b0285a0d96695b4cf7a5dd60eca2bb44b90689f1cc63b9ed5"));
var getProfessional = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("b09a85c0746ba947b29b309b1035ee72520fdc9f2b83ae114df08b75a915bf8e"));
var listSuppliers = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input = {}) => input).handler(createSsrRpc("e8db1f6314bd4f1962ad52c070e4d7eb56ea22331a95cb86b670d2759508c70c"));
var requestQuote = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("f7512fab3619a10aa51224cc1da03f0722aa6fb61b955f0e12609f75003c5cda"));
var hireProfessional = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("ce376a081ef9ab70538e09b25c25b92a27e6c6bd29d1b4d5e52f0d5f429297f1"));
var matchProfessionals = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("ea245cee147f8e726e879e0d40cb69193a923a24ab20f9238e6b51c8ea4e1dd9"));
var placeOrder = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("eff12e028cf476f6e11931cc9890b0cda92fc20361d33e4e4bf3592435b84596"));
//#endregion
export { matchProfessionals as a, listSuppliers as i, hireProfessional as n, placeOrder as o, listProfessionals as r, requestQuote as s, getProfessional as t };
