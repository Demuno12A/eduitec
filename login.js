// ========================
// LOGIN.JS
// ========================

document.getElementById('form-login').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const email = document.getElementById('email-login').value.trim();
    const senha = document.getElementById('senha-login').value;
    const salvarSenha = document.getElementById('salvar-senha').checked;
  
    const msgErro = document.getElementById("login-erro");
  
    // Carrega usuários cadastrados
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
  
    // Verifica credenciais
    const usuarioValido = usuarios.find(
      user => user.email.toLowerCase() === email.toLowerCase() && user.senha === senha
    );
  
    if (usuarioValido) {
      // Salva login
      if (salvarSenha) {
        localStorage.setItem("usuarioLogado", JSON.stringify(usuarioValido));
      } else {
        sessionStorage.setItem("usuarioLogado", JSON.stringify(usuarioValido));
      }
  
      msgErro.style.color = "green";
      msgErro.textContent = "Login realizado com sucesso!";
  
      // Redireciona após 500ms
      setTimeout(() => {
        window.location.href = "1 Home.html";
      }, 500);
  
    } else {
      msgErro.style.color = "red";
      msgErro.textContent = "E-mail ou senha incorretos!";
    }
  });
  
  
  // ========================
  // ESQUECEU A SENHA
  // ========================
  document.getElementById('esqueceu-senha').addEventListener('click', function (e) {
    e.preventDefault();
  
    const email = prompt("Digite seu e-mail para recuperar sua senha:");
  
    if (!email) return alert("Digite um e-mail válido!");
  
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuario = usuarios.find(user => user.email.toLowerCase() === email.toLowerCase());
  
    if (usuario) {
      alert(`Sua senha cadastrada é: ${usuario.senha}`);
    } else {
      alert("E-mail não encontrado.");
    }
  });
  