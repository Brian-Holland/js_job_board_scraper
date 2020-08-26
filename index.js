const Sheet = require('./sheet');
const fetch = require('node-fetch');

async function scrapePages(i) {
	try {
		//grab response obj from api
		const res = await fetch(`https://jobs.github.com/positions.json?page=${i}&search=javascript`);

		//convert to raw json object
		const json = await res.json();

		//create row objects to match Google spreadsheet
		const rows = json.map((job) => {
			return {
				company: job.company,
				title: job.title,
				location: job.location,
				date: job.created_at,
				url: job.url,
				type: job.type
			};
		});

		return rows;
	} catch (err) {
		console.log(err);
	}
}

(async function() {
	try {
		let i = 1;
		let rows = [];

		while (true) {
			const newRows = await scrapePages(i);
			console.log(`Page ${i} has ${newRows.length} results`);
			//break if no results on page number
			if (newRows.length === 0) break;
			//add new results to existing results array
			rows = [ ...rows, ...newRows ];
			//increment i (page number)
			i++;
		}

		//log total results in console
		console.log(`Total results: ${rows.length}`);

		//sort results
		rows.sort((a, b) => {
			return new Date(b.date) - new Date(a.date);
		});

		//create sheet, load sheet, and add the job json data fetched to the sheet
		const sheet = new Sheet();
		await sheet.load();
		await sheet.addRows(rows);
	} catch (err) {
		console.log(err);
	}
})();
