// models/Sala.js Estruturar os campos da tabela
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Importa sua instância de conexão

const Codigo = sequelize.define('salaCodigo', {
  id: {
    type: DataTypes.UUID, // Define o tipo como UUID
    defaultValue: DataTypes.UUIDV4, // Gera UUID automaticamente (Sequelize cuida da conversão para STRING no MySQL)
    primaryKey: true
},
  codigo: {
    type: DataTypes.STRING(50), // VARCHAR(50) no MySQL
    allowNull: false // Corresponde ao NOT NULL
  },
  
}, {
  tableName: 'salaCodigo', // Opcional: Define o nome da tabela no banco (Sequelize pluraliza por padrão)
  timestamps: false // Se você não quiser colunas createdAt/updatedAt
});

module.exports = Codigo;