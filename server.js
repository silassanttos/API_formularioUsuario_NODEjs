const express = require('express');
const sql = require('mssql');
const bodyParser = require('body-parser');
const cors = require('cors'); // Importando o CORS

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Configuração de conexão com o banco de dados
const config = {
    user: 'adm',
    password: 'admusr',
    server: 'localhost',  
    database: 'teste_aplicacoes',
    options: {
        encrypt: true, 
        trustServerCertificate: true  
    }
};

// Rota para obter todas as pessoas
app.get("/pessoas", async (req, res) => {
    try {
        await sql.connect(config);
        const result = await sql.query("SELECT * FROM TB_PESSOAS");
        res.json(result.recordset); 
    } catch (err) {
        console.error("Erro ao buscar pessoas", err);
        res.status(500).json({ message: "Erro ao buscar pessoas" });
    }
});

app.get("/pessoas/:id", async (req, res) => {
    const { id } = req.params;
    console.log(`Buscando pessoa com id: ${id}`);
    try {
        await sql.connect(config);
        const result = await sql.query`SELECT * FROM TB_PESSOAS WHERE id = ${id}`;
        const pessoa = result.recordset[0];
        if (pessoa) {

            pessoa.idade = pessoa.idade !== null ? pessoa.idade : '';
            res.json(pessoa); 
        } else {
            console.log("Pessoa não encontrada");
            res.status(404).json({ message: "Pessoa não encontrada" });
        }
    } catch (err) {
        console.error("Erro ao obter pessoa", err);
        res.status(500).json({ message: "Erro ao obter pessoa" });
    }
});


// Rota para criar uma nova pessoa
app.post("/pessoas", async (req, res) => {
    const { nome, email, idade } = req.body;
    try {
        await sql.connect(config);
        await sql.query`INSERT INTO TB_PESSOAS (nome, email, idade) VALUES (${nome}, ${email}, ${idade})`;
        res.status(201).json({ message: "Pessoa criada com sucesso!" });
    } catch (err) {
        console.error("Erro ao criar pessoa", err);
        res.status(500).json({ message: "Erro ao criar pessoa" });
    }
});

// Rota para atualizar uma pessoa
app.put("/pessoas/:id", async (req, res) => {
    const { id } = req.params;
    const { nome, email, idade } = req.body;
    try {
        await sql.connect(config);
        await sql.query`UPDATE TB_PESSOAS SET nome = ${nome}, email = ${email}, idade = ${idade} WHERE id = ${id}`;
        res.json({ message: "Pessoa atualizada com sucesso!" });
    } catch (err) {
        console.error("Erro ao atualizar pessoa", err);
        res.status(500).json({ message: "Erro ao atualizar pessoa" });
    }
});

// Rota para deletar uma pessoa
app.delete("/pessoas/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await sql.connect(config);
        await sql.query`DELETE FROM TB_PESSOAS WHERE id = ${id}`;
        res.json({ message: "Pessoa deletada com sucesso!" });
    } catch (err) {
        console.error("Erro ao deletar pessoa", err);
        res.status(500).json({ message: "Erro ao deletar pessoa" });
    }
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
