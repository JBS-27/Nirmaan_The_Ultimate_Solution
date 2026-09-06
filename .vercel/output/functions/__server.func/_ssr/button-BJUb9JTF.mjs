import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { c as Slot } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { i as cn } from "./utils-Dhq_xXK2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/button-BJUb9JTF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-[opacity,transform,background-color,color,box-shadow] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/50 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98] [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-forest text-cream hover:bg-forest-deep",
			ink: "bg-ink text-cream hover:opacity-90",
			outline: "border border-line bg-bg-elevated text-ink hover:bg-bg-sunken",
			ghost: "text-ink-soft hover:bg-bg-sunken",
			danger: "bg-danger text-cream hover:opacity-90",
			secondary: "bg-forest-soft text-forest-deep hover:bg-forest-soft/80"
		},
		size: {
			default: "h-11 px-4 text-sm",
			sm: "h-9 px-3 text-sm",
			lg: "h-12 px-5 text-base",
			icon: "size-11"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = (0, import_react.forwardRef)(({ className, variant, size, asChild, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		ref,
		...props
	});
});
Button.displayName = "Button";
//#endregion
export { Button as t };
