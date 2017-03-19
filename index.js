const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const app = express();

app.get('/:y/:m/:d/:t', function(req, res) {
	request(`http://jungang.jje.hs.kr/jungang-h/food/${req.params.y}/${req.params.m}/${req.params.d}/${req.params.t}`, function(err, data, body) {
		if(!err) {
			$ = cheerio.load(body);
			let list = $('form').find('td');
			let kcal = list.eq(1).text().trim();
			let meals = list.eq(2).find('div').html().trim().split('<br>');
			let mealArr = [];
			meals.forEach(function(e) {
				if(e.length < 8) {
					return;
				}
				let meal = '';
				for(let i = 0; i < e.length / 8; i++) {
					meal += String.fromCharCode(parseInt(e.substr((i * 8) + 3, 4), 16));
				}
				mealArr.push(meal);
			});
			res.json({cal: kcal, meal: mealArr});
		}
	});
});

app.listen(6140);