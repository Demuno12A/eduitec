// Coloque aqui o link do seu Firebase Functions
const BASE_URL = "https://us-central1-edutec.cloudfunctions.net/app/api";


// Salva pontuação no backend
async function salvarPontuacao(nome, pontuacao) {
  try {
    const response = await fetch(`${BASE_URL}/salvar-pontuacao`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, pontuacao })
    });
    const data = await response.json();
    if (response.ok) {
      alert(data.mensagem || "Pontuação salva com sucesso!");
    } else {
      alert(data.error || "Erro ao salvar pontuação.");
    }
  } catch (err) {
    console.error(err);
    alert("Erro ao conectar com o servidor.");
  }
}

// Busca ranking do backend
async function buscarRanking() {
  try {
    const response = await fetch(`${BASE_URL}/ranking`);
    if (!response.ok) throw new Error("Erro ao buscar ranking");
    return await response.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}
