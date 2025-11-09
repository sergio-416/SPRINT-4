'use strict';

import './style.css';

interface JokeResponse {
	id: string;
	joke: string;
	status: number;
}

const API_URL = 'https://icanhazdadjoke.com/';

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
	}
}

async function handleNextJoke(): Promise<void> {
	const button = document.querySelector('#next-joke-btn') as HTMLButtonElement;

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
	const button = document.querySelector('#next-joke-btn');

	if (button) {
		button.addEventListener('click', handleNextJoke);
	}

	loadFirstJoke();
}

document.addEventListener('DOMContentLoaded', initializeApp);
