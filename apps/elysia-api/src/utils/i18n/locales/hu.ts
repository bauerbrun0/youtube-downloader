import { Dictionary } from "../types";

export const dictionary: Dictionary = {
	errors: {
		notFound: "Nem található",
		internalServer: "Szerver hiba",
		urlDoesNotPointToAVideo: "A megadott URL nem egy videóra mutat",
		urlDoesNotPointToAPlaylist: "A megadott URL nem egy lejátszási listára mutat",
		videoOrPlaylistWasNotFound: "A kért videó vagy lejátszási lista nem található",
		invalidRequestURL: "Érvénytelen URL",
		errorOccurredWhileGettingInfoFromYouTube: "Hiba történt az információk lekérdezése közben",
		errorOccurredWhileParsingTheResponseFromYouTube: "Hiba történt a YouTube válaszának feldolgozása közben"
	}
};