const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
  
  sequelize.define('User', {
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        validate: {
            isEmail: {
            msg: "Debe ser un email válido",}
        }
    },
    admin:{
        type:DataTypes.BOOLEAN,
        defaultValue: false,
    },
    status: {
        type:DataTypes.STRING,
        defaultValue:'Autorizado'
    } ,
    profile: {
        type:DataTypes.TEXT,
    } 
    },{
        // timestamps:false
    });
};