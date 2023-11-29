export class CustomError extends Error {
	status: 400 | 404 | 500;

	constructor(message: string, status: 400 | 404 | 500) {
		super(message);
		this.status = status;
	}
}

export class InternalError extends CustomError {
	constructor(message: string) {
		super(message, 500);
	}
}

export class NotFoundError extends CustomError {
	constructor(message: string) {
		super(message, 404);
	}
}

export class BadRequestError extends CustomError {
	constructor(message: string) {
		super(message, 400);
	}
}
