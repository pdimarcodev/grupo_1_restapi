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

const getProductos =  () => {
	const url = path.join(__dirname, `/../db/dbProductos.json`);
	return JSON.parse(fs.readFileSync(url, {encoding: 'utf-8'}));
}

const saveProductos = (productos) => {
	const url = path.join(__dirname, `/../db/dbProductos.json`);
	fs.writeFileSync(url, JSON.stringify(productos, null, ' '));
}

const generateId = () => {
	let products = getProductos();
	if (products.length == 0) {
		return 1;
	}
	let lastProduct = products.pop();
	return lastProduct.id + 1;
}

const controller = {
	cargaProducto: (req, res) => {
		Categories
			.findAll()
			.then(categories => {
				Brands
					.findAll()
					.then(brands => {
						Colors
							.findAll()
							.then(colors => {
								return res.render('carga', {categories, brands, colors});
							})
							.catch(error => res.send(error));	
					})
					.catch(error => res.send(error));			
		})
			.catch(error => res.send(error));
	},
	detalle: (req, res) => {
		Products
			.findByPk(req.params.id,{
				include: ['brand', 'category','colors']
			})
			.then(product => res.json(product))
			.catch(error => res.send(error));
	},
	listado: (req, res, next) => {
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
	guardar: (req, res, next) => {
		Products
			.create(req.body)
			.then (product => {
				product.addColors(req.body.color);
				res.redirect('/')
			})
			.catch(error => res.send(error));	
	},
	editar: (req, res) => {
		Products
			.findByPk(req.params.id)
			.then (product => {
				Categories
					.findAll()
					.then (categories => {
						Brands
							.findAll()
							.then (brands => {
								Colors
									.findAll()
									.then (colors => res.render('editar-producto', {product, categories, brands, colors}) )
									.catch(error => res.send(error));
							})
							.catch(error => res.send(error));
					})
					.catch(error => res.send(error));
				})
			.catch(error => res.send(error));
	},
	editarCambios: (req, res) => {	
		Products
			.update(req.body, {
				where: {
					id: req.params.id
				},
				include: ['colors']
			})
			.then(product => {
				product.removeColors(product.colors);
				product.addColors(req.body.color);
				return res.redirect('/products')})
			.catch(error => res.send(error));
	}, 
	borrar: (req, res) => {
		Products
			.findByPk(req.params.id, {
				include: ['colors']
			})
			.then (product => {
				product.removeColors(product.colors);
				product.destroy();
				return res.redirect('/products');
		})
			.catch(error => res.send(error));
	}
};

module.exports = controller;