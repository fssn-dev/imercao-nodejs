const express = require("express")
const app = express()
const bodyParser = require('body-parser');
// Firebase:
const firebase = require('firebase');
// Configuração do Firebase
const firebaseConfig = require('../nodeprojectimercao-firebase.json')
// Inicializando o firebase a partir das configurações:
firebase.initializeApp(firebaseConfig);

// Cors:
const cors = require('cors');

// Firestore:
const db = firebase.firestore();

const swaggerUi = require('swagger-ui-express');
const swaggerJson = require('../swagger.json');

// Usando dependências:
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



// Criação da coleção carros:
const Carro = db.collection('carros');

// app.listen(4000);
// Para retornar uma mensagem de sucesso, podemos chamar uma função no próprio parâmetro:
app.listen(4000, function () {
    console.log('O servidor está rodando na porta 4000.')
})

// app.use('/rota', constDoSwaggerUi.serve, constDoSwaggerUi.setup(constDoArquivoJson));
app.use('/documentacao', swaggerUi.serve, swaggerUi.setup(swaggerJson));

app.get("/", (request, response) => {
    return response.send("Hello world!");
});

app.get("/retornoJSON", (request, response) => {
    return response.json({ message: "Hello" });
})

// Definimos a rota desejada (/carros) e retornamos os dados desejados:
app.get("/carros", async (request, response) => {
    // Método get a partir da coleção (Carro):
    const snapshot = await Carro.get();
    // Método map para devolver todos os elementos consultados na coleção, porém com as informações que queremos,
    // e não todas que serão geradas na variável *snapshot*
    const carros = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // O retorno será a constante carros (com os dados vindos acima)
    response.send(carros);
});

// Passamos o id por parâmetro na URL:
app.get("/:id", async (request, response) => {
    // Atribuindo o id recebido por parâmetro à variável id:
    const { id } = request.params;
    // Método get a partir da coleção (Carro):
    const snapshot = await Carro.get();
    // Método map para devolver todos os elementos consultados na coleção, porém com as informações que queremos,
    // e não todas que serão geradas na variável *snapshot*:
    const carros = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Filtramos o resultado a partir do ID com o método filter:
    const carro = carros.filter(c => {
        // Retorna o documento com o id igual o id passado por parâmetro:
        return c.id == id;
    });
    // O retorno é o carro (documento) filtrado:
    response.send(carro);
})

// Observe que mudamos a URL dependendo dos métodos:
app.post("/addCarro", async (request, response) => {
    // Atribuímos à variável data os dados vindos do body da requisição:
    const data = request.body;
    // Usamos o método add juntamente com a variável data para adicionarmos os dados ao banco:
    await Carro.add(data);
    // O retorno para o status igual a 201 será uma mensagem:
    response.status(201).send({ msg: "Carro adicionado!" });
});

// Na rota, passaremos o id do documento desejado após carros:
app.put("/carros/:id", async (request, response) => {
    // Atribuímos à variável id o id passado por parâmetro:
    const id = request.params.id;
    // Com base no documento que possui o id, usamos o método update
    // e passamos os dados recebidos pelo body da requisição:
    await Carro.doc(id).update(request.body);
    // O retorno será a seguinte mensagem:
    response.send({ msg: "Carro editado com sucesso!" })
});

// Ele também deverá receber um id/index por parâmetro para saber qual documento excluir:
app.delete("/carro/:id", async (request, response) => {
    // Atribuímos à variável id o que foi passado por parâmetro:
    const { id } = request.params;
    // Usamos o método delete no documento que possui o id igual ao passado na URL:
    await Carro.doc(id).delete();
    // O retorno será a seguinte mensagem:
    response.send({ msg: "Carro deletado com sucesso!" })
});