import { UnitAmountToRealPriceDivisor } from "@constants/GlobalValues";

/**
 * Helper function to convert any given `val` unit amount to a real price
 *
 * @param {number} val
 */
export const handleUnitAmountToRealPrice = (val) => {
	let covertedVal = 0;

	if (typeof val !== "undefined" && val !== null && val !== "" && typeof val === "number") {
		covertedVal = val / UnitAmountToRealPriceDivisor;
	}

	return covertedVal;
};
