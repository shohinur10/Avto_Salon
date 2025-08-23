import { CarLocation } from '../enums/car.enum';

/**
 * Converts a CarLocation enum value to a user-friendly display name
 * @param location - The CarLocation enum value
 * @returns A formatted, readable location name
 */
export const getLocationDisplayName = (location: CarLocation): string => {
	switch (location) {
		case CarLocation.LOS_ANGELES:
			return 'Los Angeles';
		case CarLocation.NEW_YORK:
			return 'New York';
		case CarLocation.RIO_DE_JANEIRO:
			return 'Rio de Janeiro';
		case CarLocation.CAR:
			return 'Select Location';
		default:
			// For other locations, convert underscore to space and capitalize each word
			return location.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
	}
};








