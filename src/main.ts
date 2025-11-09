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

interface WeatherData {
	current_condition: Array<{
		temp_C: string;
		weatherDesc: Array<{ value: string }>;
	}>;
}

const API_JOKE_URL = 'https://icanhazdadjoke.com/';
const WEATHER_CITY = 'Barcelona';
const API_WEATHER_URL = `https://wttr.in/${WEATHER_CITY}?format=j1`;

let reportJokes: JokeReport[] = [];
let currentJoke: string = '';
let currentScore: 1 | 2 | 3 | null = null;

async function fetchDadJoke(): Promise<string> {
	try {
		const response = await fetch(API_JOKE_URL, {
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

async function fetchWeatherData(): Promise<string> {
	try {
		const response = await fetch(API_WEATHER_URL);

		if (!response.ok) {
			throw new Error(`Weather API error! status: ${response.status}`);
		}

		const data: WeatherData = await response.json();
		const temp = data.current_condition[0].temp_C;
		const condition = data.current_condition[0].weatherDesc[0].value;

		return `${condition}, ${temp}°C`;
	} catch (error) {
		console.error('Error fetching weather:', error);
		return 'Weather unavailable';
	}
}

function displayWeather(weatherInfo: string): void {
	const weatherElement = document.querySelector('#weather-widget');

	if (weatherElement) {
		weatherElement.textContent = weatherInfo;
	}
}

async function loadWeather(): Promise<void> {
	const weatherInfo = await fetchWeatherData();
	displayWeather(weatherInfo);
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
	loadWeather();
}

document.addEventListener('DOMContentLoaded', initializeApp);
