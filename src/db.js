require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

const {
  DB_USER, DB_PASSWORD, DB_HOST, DB_NAME
} = process.env;

let sequelize =
  process.env.NODE_ENV === "production"
    ? new Sequelize({
        database: DB_NAME,
        dialect: "postgres",
        host: DB_HOST,
        port: 5432,
        username: DB_USER,
        password: DB_PASSWORD,
        pool: {
          max: 3,
          min: 1,
          idle: 10000,
        },
        dialectOptions: {
          ssl: {
            require: true,
            // Ref.: https://github.com/brianc/node-postgres/issues/2009
            rejectUnauthorized: false,
          },
          keepAlive: true,
        },
        ssl: true,
      })
    : new Sequelize(
        `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/development`,
        { logging: false, native: false }
      );

/* const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/ecommerce`, {
  logging: false, // set to console.log to see the raw SQL queries
  native: false, // lets Sequelize know we can use pg-native for ~30% more speed
}); */
const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach(model => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring

const { User, Product, ShoppingCart,
        Review, PersonalData, PurchaseOrder,
        ShippingAddress, Question, Answer } = sequelize.models;


// Aca vendrian las relaciones
// Product.hasMany(Reviews);
/* RELACIÓN ENTYRE PRODUCTO y USUARIO = CARRITO */
/* Product.belongsToMany(User, { through: 'Cart' })
User.belongsToMany(Product, { through: 'Cart' })  */


/* RELACIÓN ENTRE PRODUCTO Y REVIEW */
Product.hasMany(Review);
Review.belongsTo(Product);
/* RELACIÓN ENTRE USUARIO Y REVIEW */
User.hasMany(Review);
Review.belongsTo(User);

/* RELACIÓN ENTRE PRODUCTO Y QUESTION */
Product.hasMany(Question);
Question.belongsTo(Product);
/* RELACIÓN ENTRE USUARIO Y QUESTION */
User.hasMany(Question);
Question.belongsTo(User);
/* RELACIÓN ENTRE QUESTION Y ANSWER */
Question.hasOne(Answer);
Answer.belongsTo(Question);

/* RELACIÓN ENTRE USUARIO Y PERSONALDATA(P/COMPLETAR EN EL PERFIL PARA ENVIO) */
User.hasOne(PersonalData);
PersonalData.belongsTo(User);
/* RELACIÓN ENTRE USUARIO Y PURCHASEORDER */
User.hasMany(PurchaseOrder);
PurchaseOrder.belongsTo(User);
/* RELACIÓN ENTRE PRODUCTO Y CARRITO */
Product.hasMany(ShoppingCart);
ShoppingCart.belongsTo(Product);
/* RELACIÓN ENTRE USUARIO Y CARRITO */
User.hasMany(ShoppingCart);
ShoppingCart.belongsTo(User);
/* RELACIÓN ENTRE ORDEN Y CARRITO */
PurchaseOrder.hasOne(ShoppingCart)
ShoppingCart.belongsTo(PurchaseOrder);
/* RELACIÓN ENTRE USUARIO Y SHIPPINGADDRESS */
User.hasMany(ShippingAddress);
ShippingAddress.belongsTo(User);
/* RELACION ENTRE USUARIO Y PRODUCTO */ 
User.belongsToMany(Product,{ through: 'Favourite' });
Product.belongsToMany(User,{ through: 'Favourite' });


module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize,     // para importart la conexión { conn } = require('./db.js');
};