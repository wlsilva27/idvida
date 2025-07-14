const Sequelize = require('sequelize');
const sequelize = new Sequelize('gestao_sala', 'root', 'itlean', {
  host: 'localhost', // Ou o IP/hostname do seu servidor MySQL
  dialect: 'mysql', // ESSENCIAL: define o dialeto como MySQL
  logging: false, // Opcional: define como 'console.log' para ver as queries SQL
  port: 3306 // Porta padrão do MySQL, altere se for diferente
});

// exportando as 2 variáveis
module.exports = {
    Sequelize : Sequelize,
    sequelize : sequelize 
}