// controllers/salaController.js
const Sala = require('../models/Sala'); // Importa o modelo Sala


// Função para criar e salvar uma nova sala no banco de dados
async function criarSala(req, res) {
  try {
    // Você não precisa fornecer o ID; o Sequelize/MySQL vai gerá-lo automaticamente
    const { nome, apelido } = req.body;

    if (!nome) {
      return res.status(400).json({ message: 'O campo "nome" é obrigatório.' });
    }
    
    const novaSala = await Sala.create({
      nome,    // Usa o 'nome' vindo do req.body
      apelido  // Usa o 'apelido' vindo do req.body
    });

    console.log('Sala salva com sucesso:', novaSala.toJSON());
    res.status(201).json(novaSala); // Retorna o objeto salvo com o ID gerado
  } catch (error) {
    console.error('Erro ao salvar sala no MySQL:', error);
    res.status(500).json({ message: 'Erro ao criar sala', error: error.message });
  }
}
  async function getTodasSalas(req, res) {
  try {
    // Usa o método 'findAll()' do Sequelize para buscar todos os registros
    const salas = await Sala.findAll();

    // Retorna a lista de salas com status 200 OK
    res.status(200).json(salas);
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
  criarSala, 
  getTodasSalas
};