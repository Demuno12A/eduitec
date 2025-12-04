const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

// Inicializa o app Express
const app = express();

// Permite requisições de qualquer origem (útil durante desenvolvimento)
app.use(cors({ origin: true }));
app.use(express.json());

// Inicializa o Firestore
const admin = require("firebase-admin");
admin.initializeApp();
const firestore = admin.firestore();

const COLLECTION_NAME = "pontuacoes";

// Rota para salvar pontuação
app.post("/api/salvar-pontuacao", async (req, res) => {
  try {
    const { nome, pontuacao } = req.body;

    if (!nome || pontuacao === undefined) {
      return res.status(400).json({ error: "Nome e pontuação são obrigatórios." });
    }

    // Salva no Firestore
    await firestore.collection(COLLECTION_NAME).add({
      nome: nome.trim(),
      pontuacao: Number(pontuacao),
      data: new Date(),
    });

    res.status(200).json({ mensagem: "Pontuação salva com sucesso!" });
  } catch (error) {
    console.error("Erro ao salvar pontuação:", error);
    res.status(500).json({ error: "Erro interno ao salvar pontuação." });
  }
});

// Rota para obter o ranking (top 10)
app.get("/api/ranking", async (req, res) => {
  try {
    const snapshot = await firestore
      .collection(COLLECTION_NAME)
      .orderBy("pontuacao", "desc")
      .limit(10)
      .get();

    const ranking = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      ranking.push({
        id: doc.id,
        nome: data.nome,
        pontuacao: data.pontuacao,
        data: data.data ? data.data.toDate().toISOString() : null,
      });
    });

    res.status(200).json(ranking);
  } catch (error) {
    console.error("Erro ao buscar ranking:", error);
    res.status(500).json({ error: "Erro interno ao buscar ranking." });
  }
});

// Exporta a função chamável pelo Firebase
exports.app = functions.https.onRequest(app);