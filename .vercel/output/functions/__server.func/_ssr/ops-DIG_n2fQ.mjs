import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-ClXSlXuj.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ops-DIG_n2fQ.js
var addChangeOrder = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("59cc0c6cb21be9e0fcac852b7fa53acbce9e351863c3fd06acdbe3f7eea620ab"));
var decideChangeOrder = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("e6956c39d61611ef393416c105032b76e40be24ed4a622145ff0a92459fed7ad"));
var addDailyLog = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("2bc1689edeeb3e8e1b2f8eeb5963941700b19ae8fab0d18573e165be84d79420"));
var exportProjectReport = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("c09c06b8e76fd748a1ea6615374553a1df6deac8c123daa10d61c2bb5326187b"));
var listMyDesk = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("ddd840228c6fa726b1aa1789f6a732d65a0676541bab144474e43be74a34639e"));
var updateOrderStatus = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("d30d95627b96231cd1494bc87df99c0dd82a46be8202e9bb7a858a0907fe33ec"));
var getAdminOverview = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("5f8a988a16656da064cad5fb46cacead60a34550cde4b8af9da3c1479d5bf530"));
var verifyProfessional = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("bc125fb145b50e60bec1b623391b75508742aa89580f81faf4a556c83d167f1f"));
//#endregion
export { getAdminOverview as a, verifyProfessional as c, exportProjectReport as i, addDailyLog as n, listMyDesk as o, decideChangeOrder as r, updateOrderStatus as s, addChangeOrder as t };
