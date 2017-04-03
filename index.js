const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const app = express();

function filter(s) {
	s = s.replace(/\(여,1\)/, '');
	s = s.replace(/\(1여\)/, '');
}
app.get('/:y/:m/:d/:t', function(req, res) {
	request(`http://jungang.jje.hs.kr/jungang-h/food/${req.params.y}/${req.params.m}/${req.params.d}/${req.params.t}`, function(err, data, body) {
		if(!err) {
			$ = cheerio.load(body);
			let list = $('form').find('td');
			let kcal = list.eq(1).text().trim();
			let meals = list.eq(2).find('div').html().trim().split('<br>');
			let mealArr = [];
			meals.forEach(function(e) {
				if(e.length <= 0) {
					return;
				}
				mealArr.push(e.replace(/&#x(.{4});/g, function(match) {
					return filter(String.fromCharCode(parseInt(match.substr(3, 4), 16)));
				}));
			});
			res.json({cal: kcal, meal: mealArr});
		}
	});
});

app.listen(6140);