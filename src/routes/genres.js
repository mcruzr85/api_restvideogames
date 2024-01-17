/*📍 GET | /genres
Obtiene un arreglo con todos los géneros existentes de la API.
En una primera instancia, cuando la base de datos este vacía, deberás guardar todos los géneros que encuentres en la API.
Estos deben ser obtenidos de la API (se evaluará que no haya hardcodeo). Luego de obtenerlos de la API, deben ser guardados en la base de datos para su posterior consumo desde allí.
*/
//https://api.rawg.io/api/genres?key=928a106257314462a3a43bf37033df35
const axios = require('axios');
const {Router} = require('express');
const { Genre } = require('../db');

const router = Router();

//este metodo obtiene los generos desde la api y los inserta en la base de datos

const getGenresFromApi = async () => {
  try {
    let resultData = await  axios('https://api.rawg.io/api/genres?key=928a106257314462a3a43bf37033df35')  
    let result = resultData.data.results;
    let arrayGenres = result.map(genre => {//los guardo en el array
       return {
           id: genre.id,
           name: genre.name             
       }
   })   //los inserto en la bd
      await Genre.bulkCreate(arrayGenres);//allows you to insert multiple records to your database table with a single function call
      //console.log('desde back getgenresfromapi')
     // console.log(arrayGenres) 
      return arrayGenres;  //devuelvo el array de generos
  } catch (error) {
      return {error: error.message}
  }
};



  const getGenresFromDb = async () => { 
    try {
          const genresBd = await Genre.findAll(); 
          let arrayGenres = genresBd.map(genre => {
            return {
                id: genre.id,
                name: genre.name             
            }
        })   
                  
          return arrayGenres;         
         
      }catch (error) {
      return { error: error.message };  
    }
  };
 

 

router.get("/", async (req,res)=>{ //ok funciona
  let genresArray = [];

    try{   
      genresArray = await getGenresFromDb();
      if(!genresArray.length){
        genresArray = await getGenresFromApi();
      }
   
      return res.status(201).send({ genresArray});

    }catch(error){
        return res.status(400).json({"Error": error.message});
    }    
});



module.exports = router;