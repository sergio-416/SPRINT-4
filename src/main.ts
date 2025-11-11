'use strict';

import './style.css';

interface DadJokeResponse {
	id: string;
	joke: string;
	status: number;
}

interface OfficialJokeResponse {
	setup: string;
	punchline: string;
	type: string;
	id: number;
}

interface WeatherData {
	current_condition: Array<{
		temp_C: string;
		weatherDesc: Array<{ value: string }>;
	}>;
}

interface JokeReport {
	joke: string;
	score: 1 | 2 | 3;
	date: string;
}
const API_DAD_JOKE_URL = 'https://icanhazdadjoke.com/';
const API_OFFICIAL_JOKE_URL =
	'https://official-joke-api.appspot.com/random_joke';
const WEATHER_CITY = 'Barcelona';
const API_WEATHER_URL = `https://wttr.in/${WEATHER_CITY}?format=j1`;

let reportJokes: JokeReport[] = [];
let currentJoke: string = '';
let currentScore: 1 | 2 | 3 | null = null;
let useAlternateApi: boolean = false;

async function fetchDadJoke(): Promise<string> {
	try {
		const response = await fetch(API_DAD_JOKE_URL, {
			headers: {
				Accept: 'application/json',
			},
		});

		if (!response.ok) {
			throw new Error(`HTTP error. Status: ${response.status}`);
		}

		const data: DadJokeResponse = await response.json();
		return data.joke;
	} catch (error) {
		console.error('Error fetching joke:', error);
		return "Oops! I'm out of ideas. Please try again.";
	}
}

async function fetchOfficialJoke(): Promise<string> {
	try {
		const response = await fetch(API_OFFICIAL_JOKE_URL);

		if (!response.ok) {
			throw new Error(`HTTP error. Status: ${response.status}`);
		}

		const data: OfficialJokeResponse = await response.json();
		return `${data.setup} ${data.punchline}`;
	} catch (error) {
		console.error('Error fetching official joke:', error);
		return "Oops! I'm out of ideas. Please try again.";
	}
}

async function fetchJoke(): Promise<string> {
	const joke = useAlternateApi
		? await fetchOfficialJoke()
		: await fetchDadJoke();
	useAlternateApi = !useAlternateApi;
	return joke;
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
		console.log('All reports:', reportJokes);
	}

	currentScore = null;

	const allScoreButtons = document.querySelectorAll(
		'#score-1, #score-2, #score-3'
	);
	allScoreButtons.forEach(button => button.classList.remove('selected'));
}

async function handleNextJoke(): Promise<void> {
	const button = document.querySelector('#next-joke-btn') as HTMLButtonElement;

	saveCurrentReport();

	if (button) {
		button.disabled = true;
		button.textContent = 'Joking...';
	}

	const joke = await fetchJoke();
	displayJoke(joke);

	if (button) {
		button.disabled = false;
		button.textContent = 'Next Joke';
	}
}

async function loadFirstJoke(): Promise<void> {
	const joke = await fetchJoke();
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
