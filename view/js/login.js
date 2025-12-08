(() => {
  const LS_KEY = "ESFERA_USERS";

  const loadUsers = () => JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  let USERS = loadUsers();

  const form = document.querySelector("form");
  const emailInput = document.querySelector(".input-email");
  const passwordInput = document.querySelector(".input-password");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    const user = USERS.find(
      (u) => u.email === email && u.tempPassword === password
    );

    if (user) {
      sessionStorage.setItem("LOGGED_USER", JSON.stringify(user));
      window.location.href = "/dashboard";
    } else {
      const errorEmail = emailInput.nextElementSibling;
      const errorPassword = passwordInput.nextElementSibling;

      errorEmail.textContent = "Email ou senha incorretos";
      errorPassword.textContent = "Email ou senha incorretos";

      setTimeout(() => {
        errorEmail.textContent = "";
        errorPassword.textContent = "";
      }, 3000);

      // Função para criar a mensagem
      function showMessage() {
        let duration = 5;
        const cardColor = "#103560"; // Cor do card

        const messageElement = document.createElement("div");
        messageElement.classList.add("mensagem");
        messageElement.textContent =
          "Ocorreu um erro ao realizar login! Revise suas informações e tente novamente!";
        messageElement.style.position = "absolute";
        messageElement.style.bottom = "20px";
        messageElement.style.right = "-10dvh"; // Começa fora da tela, à direita
        messageElement.style.padding = "10px 20px";
        messageElement.style.backgroundColor = cardColor;
        messageElement.style.color = "white";
        messageElement.style.borderRadius = "5px";
        messageElement.style.fontSize = "1rem";
        messageElement.style.boxShadow =
          "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px";
        messageElement.style.zIndex = "1000";
        messageElement.style.transition =
          "right 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55), opacity 0.6s ease-in-out";

        // Barra de progresso
        const progressBar = document.createElement("div");
        progressBar.style.position = "absolute";
        progressBar.style.bottom = "0";
        progressBar.style.left = "0";
        progressBar.style.width = "100%";
        progressBar.style.height = "5px";
        progressBar.style.backgroundColor = shadeColor(cardColor, -10); // Levemente mais escura que a cor do card
        progressBar.style.borderBottomLeftRadius = "5px";
        progressBar.style.borderBottomRightRadius = "5px";

        const progress = document.createElement("div");
        progress.style.width = "0%";
        progress.style.height = "100%";
        progress.style.backgroundColor = shadeColor(cardColor, 20); // Levemente mais clara que a cor do card
        progress.style.transition = "width " + duration + "s linear";
        progressBar.appendChild(progress);

        messageElement.appendChild(progressBar);
        document.body.appendChild(messageElement);

        setTimeout(() => {
          messageElement.style.right = "20px"; // Move para a posição visível
          setTimeout(() => {
            progress.style.width = "100%"; // Barra de progresso vai na direção contrária
          }, 700);
        }, 0);

        setTimeout(() => {
          messageElement.style.right = "40px";
          messageElement.style.opacity = "0"; // Começa a desaparecer
        }, duration * 1000 + 800);

        setTimeout(() => {
          messageElement.remove();
        }, duration * 1000 + 1300);
      }

      // Função para ajustar o tom da cor
      function shadeColor(color, percent) {
        const num = parseInt(color.slice(1), 16),
          amt = Math.round(2.55 * percent),
          R = (num >> 16) + amt,
          G = ((num >> 8) & 0x00ff) + amt,
          B = (num & 0x0000ff) + amt;
        return (
          "#" +
          (
            0x1000000 +
            (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
            (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
            (B < 255 ? (B < 1 ? 0 : B) : 255)
          )
            .toString(16)
            .slice(1)
            .toUpperCase()
        );
      }
      showMessage();
    }
  });

})();
