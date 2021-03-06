// ************ Require's ************
const express = require('express');
const router = express.Router();


// ************ Controller Require ************
const productsController = require('../controllers/productsController');

//  *********** Middlewares ***********
const upload = require('../middlewares/upload');

/* GET - home page. */
router.get('/carga', productsController.cargaProducto);
router.post('/carga', upload.single('image') , productsController.guardar);
router.get('/detalle/:id', productsController.detalle);
router.get('/', productsController.listado);
router.get('/:id/edit', productsController.editar);
router.put('/:id/edit',  upload.single('image'), productsController.editarCambios);
router.delete('/:id/delete', productsController.borrar);

module.exports = router;
