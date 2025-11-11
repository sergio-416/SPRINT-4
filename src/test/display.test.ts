import { describe, it, expect, beforeEach } from 'vitest';
import { setupDOM } from './helpers';

function displayJoke(joke: string): void {
	const jokeTextElement = document.querySelector('#joke-text');

	if (jokeTextElement) {
		jokeTextElement.textContent = joke;
	}
}

function displayWeather(weatherInfo: string): void {
	const weatherElement = document.querySelector('#weather-widget');

	if (weatherElement) {
		weatherElement.textContent = weatherInfo;
	}
}

describe('Display Functions', () => {
	beforeEach(() => {
		setupDOM();
	});

	describe('displayJoke', () => {
		it('should display joke text in the joke container', () => {
			const testJoke =
				'Why do programmers prefer dark mode? Because light attracts bugs!';

			displayJoke(testJoke);

			const jokeElement = document.querySelector('#joke-text');
			expect(jokeElement?.textContent).toBe(testJoke);
		});

		it('should handle empty joke text', () => {
			displayJoke('');

			const jokeElement = document.querySelector('#joke-text');
			expect(jokeElement?.textContent).toBe('');
		});

		it('should not throw error if element does not exist', () => {
			document.body.innerHTML = '';

			expect(() => displayJoke('test')).not.toThrow();
		});
	});

	describe('displayWeather', () => {
		it('should display weather information in the widget', () => {
			const weatherInfo = 'Sunny, 25°C';

			displayWeather(weatherInfo);

			const weatherElement = document.querySelector('#weather-widget');
			expect(weatherElement?.textContent).toBe(weatherInfo);
		});

		it('should update existing weather information', () => {
			const widget = document.querySelector('#weather-widget');
			if (widget) widget.textContent = 'Old weather';

			displayWeather('New weather');

			expect(widget?.textContent).toBe('New weather');
		});
	});
});
