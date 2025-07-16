// controllers/salaController.js
const Codigo = require('../models/Codigo'); // Importa o modelo Sala


// Função para criar e salvar uma nova sala no banco de dados
async function criarCodigo(req, res) {
  try {
    // Você não precisa fornecer o ID; o Sequelize/MySQL vai gerá-lo automaticamente
    const { sala_id, codigo } = req.body;

    if (!codigo) {
      return res.status(400).json({ message: 'O campo "codigo" é obrigatório.' });
    }
    
    const result = await Codigo.findAndCountAll({
      where: { sala_id: sala_id }
    })

    if(result.count <4){
      const novoCodigo = await Codigo.create({
      sala_id,    // Usa o 'id' vindo do req.body
      codigo  // Usa o 'codigo' vindo do req.body
    })
    }else{
      return res.status(400).json({ message: 'Número de códigos excedido.' });
    }

    console.log('Sala salva com sucesso:', novoCodigo.toJSON());
    return res.status(400).json({ message: result });
  } catch (error) {
    console.error('Erro ao salvar sala no MySQL:', error);
    res.status(500).json({ message: 'Erro ao criar sala', error: error.message });
  }
}
  async function getTodasSalas(req, res) {
  try {
    // Usa o método 'findAll()' do Sequelize para buscar todos os registros
    const codigos = await Codigo.findAll();

    // Retorna a lista de salas com status 200 OK
    res.status(200).json(codigos);
  } catch (error) {
    console.error('Erro ao buscar salas no MySQL:', error);
    // Retorna uma resposta de erro (status 500 Internal Server Error)
    res.status(500).json({ message: 'Erro ao buscar salas', error: error.message });
  }
}


// Exemplo de como você usaria essa função em uma rota Express:
/*
const express = require('express');
const router = express.Router();
router.post('/salas', criarSala); // Endpoint POST para criar uma nova sala
module.exports = router;
*/

module.exports = {
  criarCodigo, 
  getTodasSalas
};