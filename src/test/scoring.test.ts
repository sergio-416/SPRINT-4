import { describe, it, expect, beforeEach } from 'vitest';

interface JokeReport {
	joke: string;
	score: 1 | 2 | 3;
	date: string;
}

let reportJokes: JokeReport[] = [];
let currentJoke: string = '';
let currentScore: 1 | 2 | 3 | null = null;

function handleScoreClick(score: 1 | 2 | 3): void {
	currentScore = score;
}

function saveCurrentReport(): void {
	if (currentScore !== null && currentJoke !== '') {
		const report: JokeReport = {
			joke: currentJoke,
			score: currentScore,
			date: new Date().toISOString(),
		};

		reportJokes.push(report);
	}

	currentScore = null;
}

describe('Scoring System', () => {
	beforeEach(() => {
		reportJokes = [];
		currentJoke = '';
		currentScore = null;
	});

	describe('handleScoreClick', () => {
		it('should update currentScore when score button is clicked', () => {
			handleScoreClick(2);

			expect(currentScore).toBe(2);
		});

		it('should overwrite previous score when clicked again', () => {
			handleScoreClick(1);
			handleScoreClick(3);

			expect(currentScore).toBe(3);
		});
	});

	describe('saveCurrentReport', () => {
		it('should save report when both joke and score are present', () => {
			currentJoke = 'Test joke';
			currentScore = 3;

			saveCurrentReport();

			expect(reportJokes).toHaveLength(1);
			expect(reportJokes[0].joke).toBe('Test joke');
			expect(reportJokes[0].score).toBe(3);
			expect(reportJokes[0].date).toBeDefined();
		});

		it('should not save report if no score is set', () => {
			currentJoke = 'Test joke';
			currentScore = null;

			saveCurrentReport();

			expect(reportJokes).toHaveLength(0);
		});

		it('should not save report if no joke is set', () => {
			currentJoke = '';
			currentScore = 2;

			saveCurrentReport();

			expect(reportJokes).toHaveLength(0);
		});

		it('should reset currentScore after saving', () => {
			currentJoke = 'Test joke';
			currentScore = 2;

			saveCurrentReport();

			expect(currentScore).toBeNull();
		});

		it('should save multiple reports correctly', () => {
			currentJoke = 'First joke';
			currentScore = 1;
			saveCurrentReport();

			currentJoke = 'Second joke';
			currentScore = 3;
			saveCurrentReport();

			expect(reportJokes).toHaveLength(2);
			expect(reportJokes[0].joke).toBe('First joke');
			expect(reportJokes[1].joke).toBe('Second joke');
		});

		it('should generate valid ISO date format', () => {
			currentJoke = 'Test joke';
			currentScore = 2;

			saveCurrentReport();

			const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
			expect(reportJokes[0].date).toMatch(isoDateRegex);
		});
	});
});
