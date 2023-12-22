/* For i18next translate function type safety */
import { Dictionary } from "./types";

declare module "i18next" {
	// eslint-disable-next-line no-unused-vars
	interface CustomTypeOptions {
		resources: {
			translation: Dictionary
		}
	}
}