export const capitalizeFirstLetter = (string: string) => string.charAt(0).toUpperCase() + string.slice(1);

export const capitalize = (string: string) =>
	string
		.split(" ")
		.map((str) => capitalizeFirstLetter(str))
		.join(" ");

export const twoDigits = (integer: number) => String(integer).padStart(2, "0");

export const cleanText = (string: string) => string.replaceAll("\\n", " ").replaceAll("\\,", ", ");

export const stringToBoolean = (strBool: string) => {
	switch (strBool) {
		case "true":
			return true;
		case "false":
			return false;
		default:
			return undefined;
	}
};

export const pluriel = (string: string, integer: number) => (integer > 1 ? string + "s" : string);
