export const mockJokeResponse = {
	id: 'test-id-123',
	joke: 'Why did the scarecrow win an award? Because he was outstanding in his field!',
	status: 200,
};

export const mockOfficialJokeResponse = {
	setup: 'What do you call a fake noodle?',
	punchline: 'An impasta!',
	type: 'general',
	id: 456,
};

export const mockWeatherResponse = {
	current_condition: [
		{
			temp_C: '22',
			weatherDesc: [{ value: 'Sunny' }],
		},
	],
};

export function setupDOM() {
	document.body.innerHTML = `
		<div id="weather-widget"></div>
		<main>
			<section id="joke-container">
				<p id="joke-text"></p>
			</section>
			<section>
				<button id="score-1" data-score="1">😖</button>
				<button id="score-2" data-score="2">🥱</button>
				<button id="score-3" data-score="3">😆</button>
			</section>
			<button id="next-joke-btn">Next Joke</button>
		</main>
	`;
}
