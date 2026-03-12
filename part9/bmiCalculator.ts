import { parseNumberArguments } from './utils';

export const calculateBmi = (heightInCm: number, weightInKg: number): string => {
	const heightInMeters = heightInCm / 100;
	const bmi = weightInKg / (heightInMeters ** 2);

	if (bmi < 16) {
		return 'Severely underweight';
	}

	if (bmi < 18.5) {
		return 'Underweight';
	}

	if (bmi < 25) {
		return 'Normal range';
	}

	if (bmi < 30) {
		return 'Overweight';
	}

	return 'Obese';
};

const parseBmiArguments = (args: string[]): { heightInCm: number; weightInKg: number } => {
	const values = parseNumberArguments(args);

	if (values.length !== 2) {
		throw new Error('BMI calculator expects exactly 2 arguments: height and weight.');
	}

	const [heightInCm, weightInKg] = values;

	return { heightInCm, weightInKg };
};

if (require.main === module) {
	try {
		const { heightInCm, weightInKg } = parseBmiArguments(process.argv.slice(2));
		console.log(calculateBmi(heightInCm, weightInKg));
	} catch (error: unknown) {
		let errorMessage = 'Something bad happened.';

		if (error instanceof Error) {
			errorMessage += ` ${error.message}`;
		}

		console.error(errorMessage);
		process.exit(1);
	}
}