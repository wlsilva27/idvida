// importar o módulos
const express = require('express') 
const handlebars = require('express-handlebars')
const path = require('path')
const bodyParser = require('body-parser')
const Sala = require('./models/Sala')
const Codigo = require('./models/Codigo')


// importar modulo mysql
const mysql = require('mysql2')
const app = express() // executar a função

// Configuração de conexão 
const conexao = mysql.createConnection({ //função de conectar ao banco de dados MySQL
    host: 'localhost',
    user: 'admin',
    password: 'admin',
    database: 'gestao_sala'
})

// Teste de conexão, o que está dentro do parênteses é o parâmetro
conexao.connect(function (erro) { // se existir o erro
    if (erro) throw erro;
    console.log("Conexão efetuada com sucesso.")
})

// Configuração do handlebars, usando como template engine
const hbs = handlebars.create({
    defaultLayout: 'main', runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
})

// Configuração Body Parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('public')) // arquivos estáticos

app.set('view engine', 'handlebars')
app.engine('handlebars', hbs.engine)
app.set('views', path.join(__dirname, 'views')) // onde estão os arquivos .hbs


//Rota para o arquivo lista.handlebars
app.get('/salas', function (req, res) {
    Sala.findAll().then(function (salas) {
        res.render('salas', { salas: salas })
    })
})

app.get('/buscasalas', function (req, res) {
    Sala.findOne().then(function (salas) {
        res.render('salas', { salas: salas })
    })
})

//Rota para a página de cadastro de códigos
app.get('/codigos', function (req, res) {
    Codigo.findAll().then(function (codigos) {
        res.render('codigos', { codigos: codigos })
    })
})

// Rota para o form Cadastro
app.get('/sala', function (req, res) {
    res.render('sala')
})

// Rota para o form Codigo
app.get('/codigo', function (req, res) {
    res.render('codigo')
})

// Rota para enviar os dados do arquivo Sala.js
app.post('/sala', function (req, res) {
    Sala.create({
        id: req.body.id,
        nome: req.body.nome,
        apelido: req.body.apelido
    }).then(function () {
        res.redirect('/salas') //redireciona para a rota         
    }).catch(function (erro) {
        res.send("Não foi cadastrado: " + erro)
    })
})

// Rota para enviar os dados do arquivo salacodigo.js
app.post('/codigo', async function (req, res) {
    const result = await Codigo.findAndCountAll({
      where: { sala_id:req.body.sala_id }
    })
    if (result.count > 4){
        res.send("Número de códigos excedido")
    }
    Codigo.create({
        sala_id: req.body.sala_id,
        codigo: req.body.codigo
    }).then(function () {
        res.send(result)         
    }).catch(function (erro) {
        res.send("Não foi cadastrado: " + erro)
    })
})

// rota para deletar os dados da tabela Sala.js
app.get('/deletar/:id', function (req, res) { 
    Sala.destroy({ where: { 'id': req.params.id } }).then(function () {
        // seleciona o id que está na rota
        res.send("SALA DELETADA COM SUCESSO.")
    }).catch(function (erro) {
        res.send("ESTA SALA NÃO EXISTE.")
    })
})

require('./config/db');
const salaController = require('./controllers/salaController');
const salaCodigo = require('./controllers/codigoController');

app.use(express.json())



// Exemplo de rota para listar todas as salas (se você tivesse uma função getSalas no controller)
app.get('/salas', salaController.getTodasSalas)
app.get('/codigo', salaCodigo.getTodasSalas)

//Rota para verificar o código e a sala e realizar a validação
app.post('/verificar', async (req, res) => {
  const { nome, codigo } = req.body;
  
  try {
    const sala = await Sala.findOne({
      where: { nome: nome }
    });
    
    if (sala) {
        const result = await Codigo.findAndCountAll({
      where: { sala_id: sala.id }
    })
      if (result.count <4) {
        return res.status(200).json({ 
          sucesso: true, 
          id: sala.id,
          dados: result.count 
        });
      } else {
          return res.status(400).json({ 
          sucesso: false, 
          mensagem: 'Número de códigos excedido.',
          dados: result.count
        });
    }
    } else {
      return res.status(404).json({ 
        sucesso: false, 
        mensagem: 'Sala não encontrada' 
      });
    }
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: error.message
    });
  }
});

app.listen(8080, () => {
    console.log("Servidor rodando na porta 8080: http://localhost:8080")
})