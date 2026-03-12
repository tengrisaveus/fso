export const isNotNumber = (argument: string): boolean => Number.isNaN(Number(argument));

export const parseNumberArguments = (args: string[]): number[] => {
	if (args.some(isNotNumber)) {
		throw new Error('Provided values were not numbers.');
	}

	return args.map(Number);
};