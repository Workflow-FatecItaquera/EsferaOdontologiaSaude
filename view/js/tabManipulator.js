// Função para criar a mensagem
function showMessage(messageText) {
    let duration = 5;
    const cardColor = '#103560'; // Cor do card

    const messageElement = document.createElement('div');
    messageElement.classList.add('mensagem');
    messageElement.textContent = messageText;
    messageElement.style.position = 'absolute';
    messageElement.style.bottom = '20px';
    messageElement.style.right = '-10dvh'; // Começa fora da tela, à direita
    messageElement.style.padding = '10px 20px';
    messageElement.style.backgroundColor = cardColor;
    messageElement.style.color = 'white';
    messageElement.style.borderRadius = '5px';
    messageElement.style.fontSize = '1rem';
    messageElement.style.boxShadow = 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px';
    messageElement.style.zIndex = '1000';
    messageElement.style.transition = 'right 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55), opacity 0.6s ease-in-out';
    
    // Barra de progresso
    const progressBar = document.createElement('div');
    progressBar.style.position = 'absolute';
    progressBar.style.bottom = '0';
    progressBar.style.left = '0';
    progressBar.style.width = '100%';
    progressBar.style.height = '5px';
    progressBar.style.backgroundColor = shadeColor(cardColor, -10); // Levemente mais escura que a cor do card
    progressBar.style.borderBottomLeftRadius = '5px';
    progressBar.style.borderBottomRightRadius = '5px';

    const progress = document.createElement('div');
    progress.style.width = '0%';
    progress.style.height = '100%';
    progress.style.backgroundColor = shadeColor(cardColor, 20); // Levemente mais clara que a cor do card
    progress.style.transition = 'width ' + duration + 's linear';
    progressBar.appendChild(progress);

    messageElement.appendChild(progressBar);
    document.body.appendChild(messageElement);

    setTimeout(() => {
        messageElement.style.right = '20px'; // Move para a posição visível
        setTimeout(() => {
            progress.style.width = '100%'; // Barra de progresso vai na direção contrária
        }, 700)
    }, 0);

    setTimeout(() => {
        messageElement.style.right = '40px';
        messageElement.style.opacity = '0'; // Começa a desaparecer
    }, (duration * 1000) + 800);

    setTimeout(() => {
        messageElement.remove();
    }, (duration * 1000) + 1300);
}

// Função para ajustar o tom da cor
function shadeColor(color, percent) {
    const num = parseInt(color.slice(1),16),
        amt = Math.round(2.55 * percent),
        R = (num >> 16) + amt,
        G = (num >> 8 & 0x00FF) + amt,
        B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R<255 ? R<1 ? 0 : R : 255)*0x10000 + (G<255 ? G<1 ? 0 : G : 255)*0x100 + (B<255 ? B<1 ? 0 : B : 255)).toString(16).slice(1).toUpperCase();
}



const buttons = document.querySelectorAll(".sidebar-item");
const sections = document.querySelectorAll(".content-area");
const arrow = document.querySelector(".sidebar-arrow");
const nav = document.querySelector(".sidebar-nav");

let currentSection = document.querySelector(".content-area");

function moveArrowTo(element) {
  const relativeOffset = element.offsetTop - nav.offsetTop;
  const center = element.offsetHeight / 2;
  const arrowHeight = 20;

  arrow.style.transform = `translateY(calc(10rem + ${
    relativeOffset + center - arrowHeight
  }px))`;
}

function changeSection(nextSectionId) {
  document.dispatchEvent(
    new CustomEvent("sectionChange", { detail: nextSectionId })
  );

  const nextSection = document.getElementById(nextSectionId);
  if (nextSection === currentSection) return;

  currentSection.style.opacity = 0;
  currentSection.style.transform = "translateY(10px)";

  setTimeout(() => {
    currentSection.style.display = "none";

    nextSection.style.display = "flex";
    nextSection.style.opacity = 0;
    nextSection.style.transform = "translateY(10px)";

    nextSection.getBoundingClientRect();

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        nextSection.style.opacity = 1;
        nextSection.style.transform = "translateY(0)";
      });
    });

    currentSection = nextSection;
  }, 400);
}

buttons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const target = btn.dataset.section;

    buttons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    moveArrowTo(btn);
    changeSection(target);
  });
});

window.addEventListener("load", () => {
  const activeItem = document.querySelector(".sidebar-item.active");

  sections.forEach((sec) => {
    if (sec.id === activeItem.dataset.section) {
      sec.style.display = "flex";
      sec.style.opacity = 1;
      sec.style.transform = "translateY(0)";
      currentSection = sec;
    } else {
      sec.style.display = "none";
      sec.style.opacity = 0;
      sec.style.transform = "translateY(10px)";
    }
  });

  const loggedUser = JSON.parse(sessionStorage.getItem("LOGGED_USER"));

  if (!loggedUser) {
    window.location.href = "/login";
    return;
  }

  const roleEl = document.querySelector(".topbar small");
  const nameEl = document.querySelector(".topbar strong");
  const colorIcon = document.querySelector(".user-circle");

  roleEl.textContent = loggedUser.role || "Usuário";
  nameEl.textContent = loggedUser.name || loggedUser.email;
  colorIcon.style.background = loggedUser.color || "#abbbdbff";

  moveArrowTo(activeItem);
});

const LS_KEY = "ESFERA_USERS";

function loadUsers() {
  return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
}

function saveUsers(users) {
  localStorage.setItem(LS_KEY, JSON.stringify(users));
}

const userCircle = document.querySelector(".user-circle");
const userOptions = document.getElementById("userOptions");
const changePasswordModal = document.getElementById("changePasswordModal");
const editUserModal = document.getElementById("editUserModal");

const changePasswordBtn = document.getElementById("changePasswordBtn");
const editUserBtn = document.getElementById("editUserBtn");
const logoutBtn = document.getElementById("logoutBtn");

const cancelPasswordBtn = document.getElementById("cancelPasswordBtn");
const savePasswordBtn = document.getElementById("savePasswordBtn");

const cancelEditBtn = document.getElementById("cancelEditBtn");
const saveEditBtn = document.getElementById("saveEditBtn");

function toggleModal(modal, show = true) {
  if (show) {
    modal.style.display = "flex";
    requestAnimationFrame(() => {
      modal.classList.add("show");
    });
    modal.style.pointerEvents = "auto";
  } else {
    modal.classList.remove("show");
    modal.style.pointerEvents = "none";

    setTimeout(() => {
      modal.style.display = "none";
    }, 300);
  }
}

userCircle.addEventListener("click", () => {
  const isVisible = userOptions.classList.contains("show");
  toggleModal(userOptions, !isVisible);
  if (!isVisible) {
    toggleModal(changePasswordModal, false);
    toggleModal(editUserModal, false);
  }
});

changePasswordBtn.addEventListener("click", () => {
  toggleModal(userOptions, false);
  toggleModal(changePasswordModal, true);
  toggleModal(editUserModal, false);
});

editUserBtn.addEventListener("click", () => {
  const loggedUser = JSON.parse(sessionStorage.getItem("LOGGED_USER"));

  if (loggedUser) {
    document.getElementById("editName").value = loggedUser.name || "";
    document.getElementById("editEmail").value = loggedUser.email || "";
    document.getElementById("editPhone").value = loggedUser.phone || "";
    document.getElementById("editRole").value = loggedUser.role || "";
    document.getElementById("editColor").value = loggedUser.color || "#cccccc";
  }

  toggleModal(userOptions, false);
  toggleModal(editUserModal, true);
  toggleModal(changePasswordModal, false);
});

cancelPasswordBtn.addEventListener("click", () =>
  toggleModal(changePasswordModal, false)
);
cancelEditBtn.addEventListener("click", () =>
  toggleModal(editUserModal, false)
);

savePasswordBtn.addEventListener("click", () => {
  const newP = document.getElementById("newPassword").value;
  const confirm = document.getElementById("confirmPassword").value;

  if (!newP || !confirm) {
    return showMessage("Preencha todos os campos");
  }

  const loggedUser = JSON.parse(sessionStorage.getItem("LOGGED_USER"));
  if (!loggedUser) {
    return showMessage("Usuário não encontrado. Faça login novamente.");
  }

  if (newP !== confirm) {
    return showMessage("As senhas não conferem.");
  }

  const users = loadUsers();
  const index = users.findIndex((u) => u.id === loggedUser.id);

  if (index === -1) {
    return showMessage("Erro ao localizar usuário no banco local.");
  }

  users[index].tempPassword = newP;
  users[index].edited = new Date().toISOString();

  saveUsers(users);

  loggedUser.tempPassword = newP;
  sessionStorage.setItem("LOGGED_USER", JSON.stringify(loggedUser));

  showMessage("Senha alterada com sucesso!");
  toggleModal(changePasswordModal, false);
});

saveEditBtn.addEventListener("click", () => {
  const name = document.getElementById("editName").value;
  const email = document.getElementById("editEmail").value;
  const phone = document.getElementById("editPhone").value;
  const role = document.getElementById("editRole").value;
  const color = document.getElementById("editColor").value;

  if (!name) return showMessage("Nome é obrigatório");
  if (!email) return showMessage("Email é obrigatório");

  const loggedUser = JSON.parse(sessionStorage.getItem("LOGGED_USER"));
  if (!loggedUser) {
    return showMessage("Usuário não encontrado. Faça login novamente.");
  }

  const users = loadUsers();
  const index = users.findIndex((u) => u.id === loggedUser.id);

  if (index === -1) {
    return showMessage("Erro ao localizar usuário no banco local.");
  }

  // Atualiza os dados
  users[index].name = name;
  users[index].email = email;
  users[index].phone = phone;
  users[index].role = role;
  users[index].color = color;
  users[index].edited = new Date().toISOString();

  saveUsers(users);

  // Atualiza sessionStorage
  loggedUser.name = name;
  loggedUser.email = email;
  loggedUser.phone = phone;
  loggedUser.role = role;
  loggedUser.color = color;
  sessionStorage.setItem("LOGGED_USER", JSON.stringify(loggedUser));

  // Atualiza elementos visuais
  document.querySelector(".topbar strong").textContent = name;
  document.querySelector(".topbar small").textContent = role;
  document.querySelector(".user-circle").style.background = color;

  showMessage("Usuário atualizado com sucesso!");
  toggleModal(editUserModal, false);
});

logoutBtn.addEventListener("click", () => {
  sessionStorage.removeItem("LOGGED_USER");
  window.location.href = "/login";
});

document.querySelectorAll(".modal-dropdown").forEach((modal) => {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) toggleModal(modal, false);
  });
});
