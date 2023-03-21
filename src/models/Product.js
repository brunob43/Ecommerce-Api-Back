const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
    // defino el modelo
    sequelize.define('Product', {
        idProduct: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey:true       
        },
        productName: {
            type: DataTypes.STRING,
            allowNull: false,
        }, 
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        }, 
        image: {
            type: DataTypes.STRING, 
            allowNull: false,
        }, 
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        }, 
        category: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue:0,
        }, 
        disabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
         
    });
};