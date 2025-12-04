document.getElementById('signup-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const nome = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('password').value;
    const salvarSenha = document.getElementById('save-password').checked;

    let msgErro = document.getElementById("cadastro-erro");

    if (!msgErro) {
        msgErro = document.createElement("p");
        msgErro.id = "cadastro-erro";
        msgErro.style.marginTop = "10px";
        msgErro.style.fontSize = "14px";
        document.querySelector(".form-container").appendChild(msgErro);
    }

    if (!nome || !email || !senha) {
        msgErro.style.color = "red";
        msgErro.textContent = "Preencha todos os campos!";
        return;
    }

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email)) {
        msgErro.style.color = "red";
        msgErro.textContent = "E-mail inválido!";
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    const usuarioExistente = usuarios.find(
        user => user.email.toLowerCase() === email.toLowerCase()
    );

    if (usuarioExistente) {
        msgErro.style.color = "red";
        msgErro.textContent = "Este e-mail já está cadastrado!";
        return;
    }

    const novoUsuario = {
        nome: nome,
        email: email.toLowerCase(),
        senha: senha
    };

    usuarios.push(novoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    if (salvarSenha) {
        localStorage.setItem("emailSalvo", email);
        localStorage.setItem("senhaSalva", senha);
    }

    sessionStorage.setItem("usuarioLogado", JSON.stringify(novoUsuario));

    msgErro.style.color = "green";
    msgErro.textContent = "Conta criada com sucesso! Redirecionando...";

    sessionStorage.setItem("usuarioLogado", JSON.stringify(novoUsuario));

    setTimeout(() => {
        window.location.href = "1 Home.html";
    }, 800);
});
