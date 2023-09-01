const axios = require('axios');
const {Router} = require('express');
const { Genre } = require('../db');

const router = Router();


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
 
 
  router.get("/", async (req,res)=>{ 
    try{   
     const genres = await getGenresFromDb();
   //  console.log('desde back getgenresfromdb')
    // console.log(genres)
      return res.status(200).json({genres});
    }catch(error){
        return res.status(400).json({"Error": error.message});
    }    
});

/**
 *asi estaba
  router.get("/", async (req,res)=>{ 
    try{   
     const genres = await getGenresFromDb();
   //  console.log('desde back getgenresfromdb')
    // console.log(genres)
      return res.status(200).send({ genres });
    }catch(error){
        return res.status(400).json({"Error": error.message});
    }    
});
 * 
 */

module.exports = router;