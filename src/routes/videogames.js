const axios = require("axios");
const { Op } = require("sequelize");
const { Videogame, VideogameGenre, Genre } = require("../db");

const { Router } = require("express");
const router = Router();
//https://api.rawg.io/api/games?key=928a106257314462a3a43bf37033df35  aqui no hay description

/**📍 GET | /videogames
Obtiene un arreglo de objetos, donde cada objeto es un videojuego con su información. OJO del api y de la bd*/

//si hay query

/**
 * 📍 GET | /videogames/name?="..."
Esta ruta debe obtener los primeros 15 videojuegos que se encuentren con la palabra recibida por query.
Debe poder buscarlo independientemente de mayúsculas o minúsculas.
Si no existe el videojuego, debe mostrar un mensaje adecuado.
Debe buscar tanto los de la API como los de la base de datos

//https://api.rawg.io/api/games?search=${name}&key=928a106257314462a3a43bf37033df35
 */


const getVideogamesFromApi = async (name) => {
  try {
    let apiData = [];
    let arrayApi = [];
    let videogamesApi = [];
    let cant = 0;

    if (name) {
      console.log("entre al metodo con name antes de axios");
      apiData = await axios(
        `https://api.rawg.io/api/games?search=${name}&key=928a106257314462a3a43bf37033df35`
      );
      arrayApi = apiData.data.results;

      if (arrayApi.length) {
        videogamesApi = arrayApi.map((vg) => {
          return {
            id: vg.id,
            name: vg.name,
            genres: vg.genres.map((g) => g.name).join("-"),
            released: vg.released,
            rating: vg.rating,
            website: vg.website,
            background_image: vg.background_image,
          };
        });
        console.log("entre al metodo con name despues de axios");
      } else {
        return [];
      }
    } else {
      //si no hay name traigo 100
      //let arrayApi = [];
      for (let i = 5; i < 10; i++) {
        apiData = await axios(
          `https://api.rawg.io/api/games?key=928a106257314462a3a43bf37033df35&page=${i}`
        );
        arrayApi.push(apiData);
      }

      if (arrayApi.length) {
        arrayApi = await Promise.all(arrayApi);

        videogamesApi = arrayApi.map((response) =>
          response.data.results.map((vg) => {
            return {
              id: vg.id,
              name: vg.name,
              released: vg.released,
              rating: vg.rating,
              website: vg.website,
              description: vg.description,
              background_image: vg.background_image,
              genres: vg.genres.map((g) => g.name).join("-"),
            };
          })
        );
        videogamesApi = videogamesApi.flat();
        //esto es pq era un array de arrays y con esto se junta en un solo []
      } else {
        return [];
      }
    }

    cant = videogamesApi.length;
    return videogamesApi;
  } catch (error) {
    return { error: error.message };
  }
};

const getVideogamesFromDb = async (name) => {
  
  try {
    if (!name) {
      let vgsBd = await Videogame.findAll({
        //este funciona con un [] de generos
        //where: { name },
        include: {
          model: Genre,
          through: {
            attributes: [],
          },
        },
      });
     // let vgs = addArrayGenres(vgsBd);
      //return vgs;
      return vgsBd;

    } else {
      let vgsBd = await Videogame.findAll({
        where: { name: { [Op.iLike]: `%${name}%` } },
        include: {
          model: Genre,
          through: {
            attributes: [],
          },
        },
      });
     // let vgs = addArrayGenres(vgsBd);
      //return vgs;
      return vgsBd;
    }
  } catch (error) {
    return { error: error };
  }
};

router.get("/", async (req, res) => {
  try {
    const { con,  name } = req.query;

    console.log(` estoy en back con es `);
    console.log(con);

    console.log(` estoy en back name es `);
    console.log(name);

    let vgsApi = [];
    let vgsDb = [];
    let videogames = [];
/*
    if (con === "0") {
      console.log(` otra vez estoy en back con con 0`);
      //se conecta x primera vez a la api
      vgsApi = await getVideogamesFromApi();
      videogames = vgsApi;
    }

    if(con === "1"){
      console.log(` otra vez estoy en back con con =1`);
      vgsDb = await getVideogamesFromDb();
      videogames = vgsDb;
    }

*/
    if(name){
      vgsApi = await getVideogamesFromApi(name); 
      vgsDb = await getVideogamesFromDb(name);

      videogames = [...vgsApi, ...vgsDb]; //agrego los vg de la bd
    }  
       

    else if(con === "1"){//si con es 1 obtengo solo de la base de datos
      
      vgsDb = await getVideogamesFromDb();
       console.log('back - get solo from  bd con = 1, imprimo solo lo que trajo de la bd')
        console.log(vgsDb)
      videogames = [ ...vgsDb]; //agrego los vg de la bd 

      if (!videogames.length) {   
        return res
          .status(400)
          .json({ Message: "No existen videogames en la base de datos" });
      }
    }
    else {//si no obtengo api y base de datos
      vgsApi = await getVideogamesFromApi();
      vgsDb = await getVideogamesFromDb();
            videogames = [...vgsApi, ...vgsDb]; //agrego los vg de la bd 
    }

   

    //const vgsBd = await Videogame.findAll();
    

    if (videogames.length) {
      console.log(`cant total ${videogames.length}`);
      console.log(
        `lo que hay en la rta del router.get("/", async (req, res) => { ${videogames}`
      );
      //console.log(videogames);
      return res.status(200).json({ videogames });
    } else {
      return res
        .status(400)
        .json({ Message: "No existen videogames con ese nombre" });
    }
  } catch (error) {
    res.status(400).json({ Error: error.message });
  }
});

/*📍 POST | /videogames
Esta ruta recibirá todos los datos necesarios para crear un videojuego y relacionarlo con sus géneros solicitados.
Toda la información debe ser recibida por body.
Debe crear un videojuego en la base de datos, y este debe estar relacionado con sus géneros indicados (al menos uno).
*/
router.post("/", async (req, res) => {
  try {
    const {
      name,
      description,
      released,
      rating,
      background_image,
      platforms,
      genres, 
      origen
    } = req.body;
     if (
      !name |
      !description |
      !released |
      !rating |
      !background_image |
      !platforms|
      !genres.length
    ) {
      return res.status(400).json({ Message: "Datos incompletos" });
    } else {
    let newVideogameBd = await Videogame.create({
      name,
      description,
      released,
      rating,
      background_image,
      platforms,
      origen
    });

    let genreIntance;
    let arrayGenreInstances = [];
    const long = genres.length;//genres es un [] que viene del front 

    for (let i = 0; i < long; i++) {     
      genreIntance = await Genre.findOne({ where: { name: genres[i] } });
      arrayGenreInstances.push(genreIntance);
    }

    //if (arrayGenreInstances.length) {
    newVideogameBd.addGenres(arrayGenreInstances); //aqui le paso las instancias de genero al vg creado
    console.log("imprimiendo la longitud de los generos del vg");
    console.log(await newVideogameBd.countGenres());

    /*   const result = await Videogame.findOne({ //este funciona con un solo genero
          where: { name },
          include: Genre  
        });*/

    const videogame = await Videogame.findOne({
      //este funciona con un [] de generos
      where: { name },
      include: {
        model: Genre,
        through: {
          attributes: [],
        },
      },
    });
   

    return res.status(201).json({videogame}); //devuelve el objeto creado en la bd
    // }
    }  
  } catch (error) {
    return res.status(400).json({ Error: error.message });
  }
});

/*router.put('/transfer', async (req, res) => {
  try{
    const { idVg, codeGenre } = req.body;
    const videogame = await Videogame.findByPk(idVg);
    console.log(videogame.toJSON());
    const respuesta = await videogame.addGenre(codeGenre);
    res.status(201).json({respuesta});

  } catch (error) {
    return res.status(400).json({ Error: error.message });
  }
 
});*/

/*server.put('/multipletransfer', async (req, res) => {
  const { override } = req.query;
  const { idPlayer, codeTeams } = req.body;
  const player = await Player.findByPk(idPlayer);
  if(override) return res.json(await player.setTeams(codeTeams))
  res.json(await player.addTeams(codeTeams));
});*/

module.exports = router;
