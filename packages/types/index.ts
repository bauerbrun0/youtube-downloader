import { Type, Static } from '@sinclair/typebox';

export const someType = Type.Object({
	field1: Type.Number(),
	field2: Type.String(),
});

export type SomeType = Static<typeof someType>;