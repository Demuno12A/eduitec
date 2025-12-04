const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");

admin.initializeApp();

const app = express();
app.use(express.json({ type: "*/*" }));
app.use(express.urlencoded({ extended: true }));

app.post("/api/salvar-pontuacao", async (req, res) => {
  let body = req.body;
  const { playerName, score } = body;

  if (playerName === undefined || playerName === null || playerName.trim() === "") {
    return res.status(400).json({ error: "Nome é obrigatório." });
  }

  if (score === undefined || score === null || score === "" || isNaN(Number(score))) {
    return res.status(400).json({ error: "Pontuação é obrigatória." });
  }

  const scoreNumber = Number(score);

  try {
    await admin.firestore().collection("scores").add({
      playerName: playerName.trim(),
      score: scoreNumber,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
    return res.status(201).json({ message: "Pontuação salva com sucesso!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro interno ao salvar pontuação." });
  }
});

app.get("/api/getRanking", async (req, res) => {
  try {
    const snapshot = await admin
      .firestore()
      .collection("scores")
      .orderBy("score", "desc")
      .limit(10)
      .get();

    const ranking = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      ranking.push({
        id: doc.id,
        playerName: data.playerName,
        score: data.score,
        date: data.timestamp?.toDate()?.toISOString() || null,
      });
    });

    return res.status(200).json(ranking);
  } catch (error) {
    console.error("Erro ao buscar ranking:", error);
    return res.status(500).json({ error: "Falha ao buscar ranking." });
  }
});

exports.api = functions.https.onRequest(app);
