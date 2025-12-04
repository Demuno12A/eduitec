async function carregarRanking() {
    try {
        const resposta = await fetch(
            "https://us-central1-SEU_PROJECT_ID.cloudfunctions.net/app/api/ranking"
        );

        const ranking = await resposta.json();
        const tabela = document.querySelector("#tabela-ranking tbody");

        tabela.innerHTML = "";

        ranking.forEach((item, index) => {
            const linha = `
                <tr>
                    <td>${index + 1}º</td>
                    <td>${item.nome}</td>
                    <td>${item.pontuacao}</td>
                    <td>${new Date(item.data).toLocaleString()}</td>
                </tr>
            `;
            tabela.innerHTML += linha;
        });

    } catch (erro) {
        console.error("Erro ao carregar ranking:", erro);
        alert("Erro ao carregar ranking.");
    }
}

carregarRanking();
