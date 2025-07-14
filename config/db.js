// config/database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('gestao_sala', 'root', 'itlean', {
  host: 'localhost', // Ou o IP/hostname do seu servidor MySQL
  dialect: 'mysql', // ESSENCIAL: define o dialeto como MySQL
  logging: false, // Opcional: define como 'console.log' para ver as queries SQL
  port: 3306 // Porta padrão do MySQL, altere se for diferente
});

// Sincroniza os modelos com o banco de dados (cria/atualiza tabelas se necessário)
async function syncDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o MySQL estabelecida com sucesso.');
    // Isso cria as tabelas se não existirem, ou as altera (ALTER TABLE)
    // CUIDADO com 'alter: true' em produção, pois pode levar a perda de dados
    await sequelize.sync({ alter: true }); // Use { force: true } para recriar tabelas a cada inicialização (apenas para DEV)
    console.log('Modelos sincronizados com o MySQL.');
  } catch (error) {
    console.error('Erro ao conectar ou sincronizar com o MySQL:', error);
  }
} 

syncDatabase(); // Chama a função para sincronizar na inicialização da aplicação

module.exports = sequelize;