import { describe, it, expect, beforeEach } from 'vitest';
import { setupDOM } from './helpers';

interface JokeReport {
	joke: string;
	score: 1 | 2 | 3;
	date: string;
}

let reportJokes: JokeReport[] = [];
let currentJoke: string = '';
let currentScore: 1 | 2 | 3 | null = null;

function handleScoreClick(score: 1 | 2 | 3): void {
	const clickedButton = document.querySelector(`#score-${score}`);

	if (!clickedButton) {
		return;
	}

	const isAlreadySelected = clickedButton.classList.contains('selected');

	if (isAlreadySelected) {
		clickedButton.classList.remove('selected');
		currentScore = null;
	} else {
		const allScoreButtons = document.querySelectorAll(
			'#score-1, #score-2, #score-3'
		);
		allScoreButtons.forEach(button => button.classList.remove('selected'));

		clickedButton.classList.add('selected');
		currentScore = score;
	}
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

	const allScoreButtons = document.querySelectorAll(
		'#score-1, #score-2, #score-3'
	);
	allScoreButtons.forEach(button => button.classList.remove('selected'));
}

describe('Score Button Interactions', () => {
	beforeEach(() => {
		setupDOM();
		reportJokes = [];
		currentJoke = '';
		currentScore = null;
	});

	describe('Visual State Persistence', () => {
		it('should add selected class when score button is clicked', () => {
			const button = document.querySelector('#score-2');

			handleScoreClick(2);

			expect(button?.classList.contains('selected')).toBe(true);
		});

		it('should update currentScore when button is clicked', () => {
			handleScoreClick(3);

			expect(currentScore).toBe(3);
		});

		it('should remove selected class from previous button when selecting different button', () => {
			const button1 = document.querySelector('#score-1');
			const button2 = document.querySelector('#score-2');

			handleScoreClick(1);
			handleScoreClick(2);

			expect(button1?.classList.contains('selected')).toBe(false);
			expect(button2?.classList.contains('selected')).toBe(true);
		});

		it('should maintain selected class until user changes selection', () => {
			const button = document.querySelector('#score-3');

			handleScoreClick(3);

			expect(button?.classList.contains('selected')).toBe(true);
			expect(currentScore).toBe(3);
		});

		it('should ensure only one button has selected class at a time', () => {
			handleScoreClick(1);
			handleScoreClick(2);

			const selectedButtons = document.querySelectorAll('.selected');

			expect(selectedButtons.length).toBe(1);
			expect(selectedButtons[0].id).toBe('score-2');
		});
	});

	describe('Toggle Deselection Behavior', () => {
		it('should remove selected class when clicking already selected button', () => {
			const button = document.querySelector('#score-2');

			handleScoreClick(2);
			handleScoreClick(2);

			expect(button?.classList.contains('selected')).toBe(false);
		});

		it('should set currentScore to null when deselecting button', () => {
			handleScoreClick(1);
			handleScoreClick(1);

			expect(currentScore).toBeNull();
		});

		it('should allow reselection after deselection', () => {
			const button = document.querySelector('#score-3');

			handleScoreClick(3);
			handleScoreClick(3);
			handleScoreClick(3);

			expect(button?.classList.contains('selected')).toBe(true);
			expect(currentScore).toBe(3);
		});

		it('should handle multiple toggle cycles correctly', () => {
			const button = document.querySelector('#score-2');

			handleScoreClick(2);
			expect(currentScore).toBe(2);
			expect(button?.classList.contains('selected')).toBe(true);

			handleScoreClick(2);
			expect(currentScore).toBeNull();
			expect(button?.classList.contains('selected')).toBe(false);

			handleScoreClick(2);
			expect(currentScore).toBe(2);
			expect(button?.classList.contains('selected')).toBe(true);
		});
	});

	describe('Complex Interaction Scenarios', () => {
		it('should handle selection change followed by toggle deselection', () => {
			const button1 = document.querySelector('#score-1');
			const button2 = document.querySelector('#score-2');

			handleScoreClick(1);
			handleScoreClick(2);
			handleScoreClick(2);

			expect(button1?.classList.contains('selected')).toBe(false);
			expect(button2?.classList.contains('selected')).toBe(false);
			expect(currentScore).toBeNull();
		});

		it('should clean visual state when saving report and advancing to next joke', () => {
			const button = document.querySelector('#score-3');
			currentJoke = 'Test joke';

			handleScoreClick(3);
			saveCurrentReport();

			expect(button?.classList.contains('selected')).toBe(false);
			expect(currentScore).toBeNull();
		});

		it('should clean visual state even when no report is saved', () => {
			const button = document.querySelector('#score-1');
			currentJoke = '';

			handleScoreClick(1);
			saveCurrentReport();

			expect(button?.classList.contains('selected')).toBe(false);
			expect(currentScore).toBeNull();
		});

		it('should not break when clicking non-existent button', () => {
			document.body.innerHTML = '';

			expect(() => handleScoreClick(1)).not.toThrow();
			expect(currentScore).toBeNull();
		});
	});

	describe('State Synchronization', () => {
		it('should keep visual and logical state synchronized during selection', () => {
			const button = document.querySelector('#score-2');

			handleScoreClick(2);

			const visualState = button?.classList.contains('selected');
			const logicalState = currentScore === 2;

			expect(visualState).toBe(logicalState);
			expect(visualState).toBe(true);
		});

		it('should keep visual and logical state synchronized during deselection', () => {
			const button = document.querySelector('#score-3');

			handleScoreClick(3);
			handleScoreClick(3);

			const visualState = button?.classList.contains('selected');
			const logicalState = currentScore === null;

			expect(visualState).toBe(false);
			expect(logicalState).toBe(true);
		});

		it('should maintain synchronization through multiple operations', () => {
			const button1 = document.querySelector('#score-1');
			const button2 = document.querySelector('#score-2');
			const button3 = document.querySelector('#score-3');

			handleScoreClick(1);
			expect(button1?.classList.contains('selected')).toBe(true);
			expect(currentScore).toBe(1);

			handleScoreClick(2);
			expect(button1?.classList.contains('selected')).toBe(false);
			expect(button2?.classList.contains('selected')).toBe(true);
			expect(currentScore).toBe(2);

			handleScoreClick(2);
			expect(button2?.classList.contains('selected')).toBe(false);
			expect(currentScore).toBeNull();

			handleScoreClick(3);
			expect(button3?.classList.contains('selected')).toBe(true);
			expect(currentScore).toBe(3);
		});
	});
});
