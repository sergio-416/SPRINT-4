'use strict';

import './style.css';

interface JokeResponse {
	id: string;
	joke: string;
	status: number;
}

interface JokeReport {
	joke: string;
	score: 1 | 2 | 3;
	date: string;
}

const API_URL = 'https://icanhazdadjoke.com/';

let reportJokes: JokeReport[] = [];
let currentJoke: string = '';
let currentScore: 1 | 2 | 3 | null = null;

async function fetchDadJoke(): Promise<string> {
	try {
		const response = await fetch(API_URL, {
			headers: {
				Accept: 'application/json',
			},
		});

		if (!response.ok) {
			throw new Error(`HTTP error. Status: ${response.status}`);
		}

		const data: JokeResponse = await response.json();
		return data.joke;
	} catch (error) {
		console.error('Error fetching joke:', error);
		return "Oops! I'm out of ideas. Please try again.";
	}
}

function displayJoke(joke: string): void {
	const jokeTextElement = document.querySelector('#joke-text');

	if (jokeTextElement) {
		jokeTextElement.textContent = joke;
		currentJoke = joke;
	}
}

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
		console.log('Report saved:', report);
		console.log('All reports:', reportJokes);
	}

	currentScore = null;
}

async function handleNextJoke(): Promise<void> {
	const button = document.querySelector('#next-joke-btn') as HTMLButtonElement;

	saveCurrentReport();

	if (button) {
		button.disabled = true;
		button.textContent = 'Joking...';
	}

	const joke = await fetchDadJoke();
	displayJoke(joke);

	if (button) {
		button.disabled = false;
		button.textContent = 'Next Joke';
	}
}

async function loadFirstJoke(): Promise<void> {
	const joke = await fetchDadJoke();
	displayJoke(joke);
}

function initializeApp(): void {
	const nextButton = document.querySelector('#next-joke-btn');
	const score1Button = document.querySelector('#score-1');
	const score2Button = document.querySelector('#score-2');
	const score3Button = document.querySelector('#score-3');

	if (nextButton) {
		nextButton.addEventListener('click', handleNextJoke);
	}

	if (score1Button) {
		score1Button.addEventListener('click', () => handleScoreClick(1));
	}

	if (score2Button) {
		score2Button.addEventListener('click', () => handleScoreClick(2));
	}

	if (score3Button) {
		score3Button.addEventListener('click', () => handleScoreClick(3));
	}

	loadFirstJoke();
}

document.addEventListener('DOMContentLoaded', initializeApp);
