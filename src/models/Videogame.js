const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('Videogame', {
    id:{
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement:true,
      primaryKey:true,      
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description:{
      type: DataTypes.TEXT,
      allowNull: false,
    },
    released:{
      type: DataTypes.STRING,
      allowNull: false,

    },
    rating:{
      type: DataTypes.STRING,
      allowNull: false,

    },
    background_image:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    website:{
      type: DataTypes.STRING,      
    },
    platforms:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    origen:{
      type: DataTypes.STRING,
      
    }

    

  }, {timestamps: false});
};

//id, name, description, released, rating, background_image, plataforms