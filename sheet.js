const { GoogleSpreadsheet } = require('google-spreadsheet');

module.exports = class Sheet {
	constructor() {
		this.doc = new GoogleSpreadsheet('1lN0Jhm5_vPyyV38wBO8SBiuJSXVwH1LKcz1NvCfmq24');
	}

	async load() {
		//load credentials for api access from json file
		await this.doc.useServiceAccountAuth(require('./credentials.json'));

		// load document properties and worksheets
		await this.doc.loadInfo();
		console.log(this.doc.title);
	}

	async addRows(rows) {
		await this.doc.updateProperties({ title: 'Job Scraper' });

		const sheet = this.doc.sheetsByIndex[0];

		await sheet.addRows(rows);
	}
};
