import Elysia from "elysia";
import i18n from "./i18n";
import { getDict } from "./i18n";
import { CustomError } from "./errors";

export default new Elysia()
	.use(i18n)
	.onError(({ code, error, set, dict, request }) => {
		if (error instanceof CustomError) {
			set.status = error.status;
			return { error: error.message };
		}

		if (code === "NOT_FOUND") {
			set.status = 404;
			// when on Request Hook throws not found, dict will be undefined
			// I guess Elysia.derive is 'called' after on Request Hook
			dict = getDict(request.url);
			return { error: dict("errors.notFound") };
		}

		set.status = 500;
		return { error: dict("errors.internalServer") };
	});