const fs = require('fs');
const path = require('path');
const db = require('../database/models');
const Products = db.products;
const Categories = db.categories;
const Brands = db.brands;
const Colors = db.colors;

const toThousand = function (n) {
	return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

//const getProductos =  () => {
//	const url = path.join(__dirname, `/../db/dbProductos.json`);
//	return JSON.parse(fs.readFileSync(url, {encoding: 'utf-8'}));
//}

const controller = {
	root: (req, res, next) => {
		Products
			.findAll({
				include: ['brand', 'category','colors']
			})
			.then (products => res.json(products))
			.catch(error => 
				{ 	console.log(error);
					next();
				});
	},
	
};

module.exports = controller
