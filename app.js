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
    user: 'root',
    password: 'itlean',
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
app.post('/codigo', function (req, res) {
    Codigo.create({
        id: req.body.id,
        codigo: req.body.codigo
    }).then(function () {
        res.redirect('/codigos') // nova página         
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

app.post('/sala', salaController.criarSala)
app.post('/codigo', salaCodigo.criarCodigo)

// Exemplo de rota para listar todas as salas (se você tivesse uma função getSalas no controller)
app.get('/salas', salaController.getTodasSalas)
app.get('/codigo', salaCodigo.getTodasSalas)


app.listen(8080, () => {
    console.log("Servidor rodando na porta 8080: http://localhost:8080")
})