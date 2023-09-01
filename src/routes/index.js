const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const videogamesRouter = require('./videogames');
const vgDetallesRouter = require('./vgdetalle');
const genresRouter = require('./genres');
const genresDbRouter = require('./genresDb');

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.get("/", (req,res)=>{//este general funciono ok
    res.status(200).send("probando conexion");
});


router.use('/videogames', videogamesRouter);
router.use('/videogames/', vgDetallesRouter);
router.use('/genres', genresRouter);
router.use('/genresdb', genresDbRouter);


module.exports = router;
