const Sala = require('./Sala');
const Codigo = require('./Codigo');

// Definir associações
Sala.hasMany(Codigo, { foreignKey: 'sala_id' });
Codigo.belongsTo(Sala, { foreignKey: 'sala_id' });

module.exports = { Sala, Codigo };