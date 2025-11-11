import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
	mockJokeResponse,
	mockOfficialJokeResponse,
	mockWeatherResponse,
} from './helpers';

const API_DAD_JOKE_URL = 'https://icanhazdadjoke.com/';
const API_OFFICIAL_JOKE_URL =
	'https://official-joke-api.appspot.com/random_joke';
const WEATHER_CITY = 'Barcelona';
const API_WEATHER_URL = `https://wttr.in/${WEATHER_CITY}?format=j1`;

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

		const data = await response.json();
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

		const data = await response.json();
		return `${data.setup} ${data.punchline}`;
	} catch (error) {
		console.error('Error fetching official joke:', error);
		return "Oops! I'm out of ideas. Please try again.";
	}
}

async function fetchWeatherData(): Promise<string> {
	try {
		const response = await fetch(API_WEATHER_URL);

		if (!response.ok) {
			throw new Error(`Weather API error! status: ${response.status}`);
		}

		const data = await response.json();
		const temp = data.current_condition[0].temp_C;
		const condition = data.current_condition[0].weatherDesc[0].value;

		return `${condition}, ${temp}°C`;
	} catch (error) {
		console.error('Error fetching weather:', error);
		return 'Weather unavailable';
	}
}

describe('API Functions', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('fetchDadJoke', () => {
		it('should fetch and return a dad joke successfully', async () => {
			vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
				new Response(JSON.stringify(mockJokeResponse), {
					status: 200,
					headers: { 'Content-Type': 'application/json' },
				})
			);

			const joke = await fetchDadJoke();

			expect(joke).toBe(mockJokeResponse.joke);
			expect(fetch).toHaveBeenCalledWith(API_DAD_JOKE_URL, {
				headers: { Accept: 'application/json' },
			});
		});

		it('should return error message when API fails', async () => {
			vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
				new Response(null, { status: 500 })
			);

			const joke = await fetchDadJoke();

			expect(joke).toBe("Oops! I'm out of ideas. Please try again.");
		});

		it('should handle network errors gracefully', async () => {
			vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(
				new Error('Network error')
			);

			const joke = await fetchDadJoke();

			expect(joke).toBe("Oops! I'm out of ideas. Please try again.");
		});
	});

	describe('fetchOfficialJoke', () => {
		it('should fetch and combine setup with punchline', async () => {
			vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
				new Response(JSON.stringify(mockOfficialJokeResponse), {
					status: 200,
					headers: { 'Content-Type': 'application/json' },
				})
			);

			const joke = await fetchOfficialJoke();

			expect(joke).toBe(
				`${mockOfficialJokeResponse.setup} ${mockOfficialJokeResponse.punchline}`
			);
		});

		it('should return error message on failure', async () => {
			vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(
				new Error('API Error')
			);

			const joke = await fetchOfficialJoke();

			expect(joke).toBe("Oops! I'm out of ideas. Please try again.");
		});
	});

	describe('fetchWeatherData', () => {
		it('should fetch and format weather data correctly', async () => {
			vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
				new Response(JSON.stringify(mockWeatherResponse), {
					status: 200,
					headers: { 'Content-Type': 'application/json' },
				})
			);

			const weather = await fetchWeatherData();

			expect(weather).toBe('Sunny, 22°C');
		});

		it('should return unavailable message on error', async () => {
			vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(
				new Error('Weather API down')
			);

			const weather = await fetchWeatherData();

			expect(weather).toBe('Weather unavailable');
		});
	});
});
