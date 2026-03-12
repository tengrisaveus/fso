import { parseNumberArguments } from './utils';

export interface ExerciseResult {
	periodLength: number;
	trainingDays: number;
	success: boolean;
	rating: number;
	ratingDescription: string;
	target: number;
	average: number;
}

export const calculateExercises = (dailyHours: number[], target: number): ExerciseResult => {
	const periodLength = dailyHours.length;
	const trainingDays = dailyHours.filter((hours) => hours > 0).length;
	const totalHours = dailyHours.reduce((sum, hours) => sum + hours, 0);
	const average = totalHours / periodLength;
	const success = average >= target;

	let rating = 1;
	let ratingDescription = 'you need to exercise much more';

	if (average >= target) {
		rating = 3;
		ratingDescription = 'great job, target achieved';
	} else if (average >= target - 0.5) {
		rating = 2;
		ratingDescription = 'not too bad but could be better';
	}

	return {
		periodLength,
		trainingDays,
		success,
		rating,
		ratingDescription,
		target,
		average
	};
};

const parseExerciseArguments = (args: string[]): { target: number; dailyHours: number[] } => {
	const values = parseNumberArguments(args);

	if (values.length < 2) {
		throw new Error('Exercise calculator expects at least 2 arguments: target and daily exercise hours.');
	}

	const [target, ...dailyHours] = values;

	return { target, dailyHours };
};

if (require.main === module) {
	try {
		const { target, dailyHours } = parseExerciseArguments(process.argv.slice(2));
		console.log(calculateExercises(dailyHours, target));
	} catch (error: unknown) {
		let errorMessage = 'Something bad happened.';

		if (error instanceof Error) {
			errorMessage += ` ${error.message}`;
		}

		console.error(errorMessage);
		process.exit(1);
	}
}