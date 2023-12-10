import { dict } from "./i18n/en";
import { Flatten, Translator } from "@solid-primitives/i18n";

export type Theme = "light" | "dark";

export type Locale = "en" | "hu";

export type RawDict = typeof dict;
export type FlatDict = Flatten<RawDict>;
export type Dict = Translator<FlatDict>;