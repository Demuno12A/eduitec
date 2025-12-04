// ===== CADASTRO =====
document.getElementById("cadastroForm")?.addEventListener("submit", function(e) {
    e.preventDefault();

    const nome = document.getElementById("cadastroNome").value.trim();
    const email = document.getElementById("cadastroEmail").value.trim();
    const senha = document.getElementById("cadastroSenha").value.trim();

    if (!nome || !email || !senha) {
        document.getElementById("cadastroError").textContent = "Preencha todos os campos!";
        return;
    }

    // Cria objeto usuário
    const usuario = {
        nome: nome,
        email: email,
        senha: senha
    };

    // Salva no localStorage
    localStorage.setItem("usuario", JSON.stringify(usuario));

    // Redireciona para login
    window.location.href = "login.html";
});
