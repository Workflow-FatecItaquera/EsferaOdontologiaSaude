/* users.js
   CRUD de usuários em LocalStorage
   - Funcionários e Pacientes
   - Modal Wizard em 3 passos
*/

(() => {
  // ==============================
  // LocalStorage Helpers
  // ==============================
  const LS_KEY = "ESFERA_USERS";

  const loadUsers = () => JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  const saveUsers = (users) =>
    localStorage.setItem(LS_KEY, JSON.stringify(users));

  // ==============================
  // State
  // ==============================
  let USERS = loadUsers();
  let CURRENT_USER = null;
  let STEP = 1;

  // ==============================
  // Elements
  // ==============================
  const modal = document.getElementById("userModal");
  const modalClose = document.getElementById("u_modalClose");
  const btnNewUser = document.getElementById("btnNewUser");

  const usersList = document.getElementById("usersList");
  const usersListCount = document.getElementById("usersListCount");

  const typeFilter = document.getElementsByName("uType");

  const modalPrev = document.getElementById("u_modalPrev");
  const modalNext = document.getElementById("u_modalNext");
  const modalError = document.getElementById("u_modalError");

  const u_modalTitle = document.getElementById("u_modalTitle");

  // Inputs
  const u_name = document.getElementById("u_name");
  const u_type = document.getElementById("u_type");
  const u_phone = document.getElementById("u_phone");
  const u_email = document.getElementById("u_email");

  const employeeFields = document.getElementById("employeeFields");
  const patientFields = document.getElementById("patientFields");

  const u_role = document.getElementById("u_role");
  const u_doc = document.getElementById("u_doc");
  const u_color = document.getElementById("u_color");
  const u_birth = document.getElementById("u_birth");
  const u_obs = document.getElementById("u_obs");

  const u_review = document.getElementById("u_review");

  const userSearch = document.getElementById("userSearch");
  const userSort = document.getElementById("userSort");

  const userStatus = document.getElementById("userStatus");
  userStatus.onchange = renderUsers;

  userSearch.oninput = renderUsers;
  userSort.onchange = renderUsers;

  document
    .getElementById("u_type")
    .addEventListener("change", toggleUserTypeFields);

  // ==============================
  // Render Users
  // ==============================
  function renderUsers() {
    const value = [...typeFilter].find((r) => r.checked).value;

    let filtered = USERS;
    if (value !== "all") filtered = USERS.filter((u) => u.type === value);

    usersListCount.textContent = `${filtered.length} usuário(s)`;
    usersList.innerHTML = "";

    if (filtered.length === 0) {
      usersList.innerHTML = `<p class="text-muted small">Nenhum usuário encontrado.</p>`;
      return;
    }

    // FILTRO DE STATUS (ativo/inativo)
    if (userStatus.value !== "all") {
      filtered = filtered.filter((u) =>
        userStatus.value === "active" ? u.active : !u.active
      );
    }

    // FILTRO DE TEXTO
    const search = userSearch.value.trim().toLowerCase();
    filtered = filtered.filter(
      (u) =>
        u.name.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search)
    );

    // ORDENAÇÃO
    switch (userSort.value) {
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name_desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "recent":
        filtered.sort((a, b) => new Date(b.created) - new Date(a.created));
        break;
      case "old":
        filtered.sort((a, b) => new Date(a.created) - new Date(b.created));
        break;
    }

    filtered.forEach((u) => {
      const div = document.createElement("div");
      div.className = "user-card p-3 rounded mb-2";

      div.innerHTML = `
        <div class="d-flex justify-content-between align-items-start w-100">

          <div class="flex-grow-1">
            <div class="d-flex align-items-center gap-2">
              <span style="
                width: 14px;
                height: 14px;
                border-radius: 50%;
                background: ${u.color || "#777"};
                display: inline-block;
              "></span>

              <strong>${u.name}</strong>

              ${
                !u.active
                  ? `<span class="badge bg-secondary">Inativo</span>`
                  : `<span class="badge bg-success">Ativo</span>`
              }
            </div>

            <p class="small mb-0 text-muted">
              ${u.type === "employee" ? u.role : "Paciente"}
            </p>

            <p class="small text-muted mb-0">${u.email}</p>
          </div>

          <div class="d-flex flex-column align-items-end gap-1 ms-2">
            
            <button class="btn btn-sm btn-outline-primary p-1 px-2 u-edit"
              data-id="${u.id}">
              Editar
            </button>

            <button class="btn btn-sm btn-outline-${
              u.active ? "warning" : "success"
            } p-1 px-2 u-toggle"
              data-id="${u.id}">
              ${u.active ? "Inativar" : "Ativar"}
            </button>

            <button class="btn btn-sm btn-outline-danger p-1 px-2 u-delete"
              data-id="${u.id}">
              Excluir
            </button>

          </div>

        </div>
      `;

      usersList.appendChild(div);
    });

    attachUserButtons();
  }

  function generateTempPassword(length = 10) {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // ==============================
  // Buttons inside cards
  // ==============================
  function attachUserButtons() {
    usersList.querySelectorAll(".u-edit").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const id = Number(btn.dataset.id);
        openEditUser(id);
      };
    });

    usersList.querySelectorAll(".u-toggle").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const id = Number(btn.dataset.id);
        const user = USERS.find((u) => u.id === id);
        user.active = !user.active;
        saveUsers(USERS);
        if (
          window._ESFERA &&
          typeof window._ESFERA.refreshProfessionals === "function"
        ) {
          window._ESFERA.refreshEmployees();
          window._ESFERA.refreshProfessionals();
        }
        renderUsers();
      };
    });

    usersList.querySelectorAll(".u-delete").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();

        if (!confirm("Deseja realmente excluir este usuário?")) return;

        const id = Number(btn.dataset.id);
        USERS = USERS.filter((u) => u.id !== id);
        saveUsers(USERS);
        if (
          window._ESFERA &&
          typeof window._ESFERA.refreshProfessionals === "function"
        ) {
          window._ESFERA.refreshEmployees();
          window._ESFERA.refreshProfessionals();
        }
        renderUsers();
      };
    });
  }

  // ==============================
  // Toggle fields
  // ==============================
  function toggleUserTypeFields() {
    const type = u_type.value;

    if (type === "employee") {
      employeeFields.classList.remove("d-none");
      patientFields.classList.add("d-none");
    } else {
      employeeFields.classList.add("d-none");
      patientFields.classList.remove("d-none");
    }
  }

  // ==============================
  // New User
  // ==============================
  btnNewUser.onclick = () => openModal();

  // ==============================
  // Edit User
  // ==============================
  function openEditUser(id) {
    CURRENT_USER = USERS.find((u) => u.id === id);
    openModal(true);
  }

  // ==============================
  // Modal
  // ==============================
  function openModal(isEdit = false) {
    modal.setAttribute("aria-hidden", "false");

    STEP = 1;
    updateSteps();
    toggleUserTypeFields();
    modalError.classList.add("d-none");

    u_modalTitle.textContent = isEdit ? "Editar Usuário" : "Novo Usuário";

    if (isEdit) {
      u_name.value = CURRENT_USER.name;
      u_type.value = CURRENT_USER.type;
      u_phone.value = CURRENT_USER.phone;
      u_email.value = CURRENT_USER.email;

      if (CURRENT_USER.type === "employee") {
        employeeFields.classList.remove("d-none");
        patientFields.classList.add("d-none");
        u_role.value = CURRENT_USER.role;
        u_color.value = CURRENT_USER.color || "#4A90E2";
        u_doc.value = CURRENT_USER.document;
      } else {
        employeeFields.classList.add("d-none");
        patientFields.classList.remove("d-none");
        u_birth.value = CURRENT_USER.birth;
        u_obs.value = CURRENT_USER.obs;
      }
    } else {
      CURRENT_USER = null;
      clearFields();
    }
  }

  modalClose.onclick = () => modal.setAttribute("aria-hidden", "true");

  // ==============================
  // Wizard Navigation
  // ==============================
  modalPrev.onclick = () => {
    if (STEP > 1) STEP--;
    updateSteps();
  };

  modalNext.onclick = () => {
    if (STEP === 1 && !validateStep1()) return;
    if (STEP === 2 && !validateStep2()) return;

    if (STEP < 3) {
      STEP++;
      updateSteps();
    } else {
      saveUser();
      modal.setAttribute("aria-hidden", "true");
    }
  };

  function updateSteps() {
    [...document.querySelectorAll("#userModalSteps .modal-step")].forEach(
      (step) => {
        step.classList.add("d-none");
        if (Number(step.dataset.step) === STEP) step.classList.remove("d-none");
      }
    );

    modalPrev.style.visibility = STEP === 1 ? "hidden" : "visible";

    if (STEP === 3) {
      modalNext.textContent = CURRENT_USER ? "Salvar alterações" : "Concluir";
      generateReview();
    } else {
      modalNext.textContent = "Próximo";
    }
  }

  // ==============================
  // Validation
  // ==============================
  function validateStep1() {
    if (!u_name.value.trim() || !u_phone.value.trim()) {
      showError("Preencha nome e telefone.");
      return false;
    }
    hideError();
    return true;
  }

  function validateStep2() {
    if (u_type.value === "employee") {
      if (!u_role.value.trim() || !u_doc.value.trim()) {
        showError("Preencha cargo e documento.");
        return false;
      }
    } else {
      if (!u_birth.value.trim()) {
        showError("Data de nascimento obrigatória.");
        return false;
      }
    }
    hideError();
    return true;
  }

  function showError(msg) {
    modalError.textContent = msg;
    modalError.classList.remove("d-none");
  }

  function hideError() {
    modalError.classList.add("d-none");
  }

  // ==============================
  // Review
  // ==============================
  function generateReview() {
    let html = `
      <p><strong>${u_name.value}</strong></p>
      <p class="mb-1">Tipo: ${
        u_type.value === "employee" ? "Funcionário" : "Paciente"
      }</p>
      <p class="mb-1">Telefone: ${u_phone.value}</p>
      <p class="mb-1">Email: ${u_email.value || "—"}</p>
    `;

    if (u_type.value === "employee") {
      html += `
        <p class="mb-1">Cargo: ${u_role.value}</p>
        <p class="mb-1">Cor: <span style="display:inline-block;width:18px;height:18px;border-radius:4px;background:${u_color.value};margin-left:4px;"></span></p>
        <p class="mb-1">Documento: ${u_doc.value}</p>
      `;
    } else {
      html += `
        <p class="mb-1">Nascimento: ${u_birth.value}</p>
        <p class="mb-1">Obs: ${u_obs.value || "—"}</p>
      `;
    }

    u_review.innerHTML = html;
  }

  // ==============================
  // Save User
  // ==============================
  function saveUser() {
    const data = {
      id: CURRENT_USER ? CURRENT_USER.id : Date.now(),
      type: u_type.value,
      name: u_name.value.trim(),
      phone: u_phone.value.trim(),
      email: u_email.value.trim(),
      created: CURRENT_USER ? CURRENT_USER.created : new Date(),
      active: CURRENT_USER ? CURRENT_USER.active : true,
      edited: new Date(),
    };

    if (u_type.value === "employee") {
      data.role = u_role.value.trim();
      data.color = u_color.value;
      data.document = u_doc.value.trim();
    } else {
      data.birth = u_birth.value;
      data.obs = u_obs.value.trim();
    }
    
    if (CURRENT_USER) {
      USERS = USERS.map((u) => (u.id === CURRENT_USER.id ? data : u));
    } else {
      data.tempPassword = generateTempPassword();
      console.log(data)
      USERS.push(data);
    }

    saveUsers(USERS);
    if (
      window._ESFERA &&
      typeof window._ESFERA.refreshProfessionals === "function"
    ) {
      window._ESFERA.refreshEmployees();
      window._ESFERA.refreshProfessionals();
    }
    renderUsers();
  }

  // ==============================
  // Clear fields
  // ==============================
  function clearFields() {
    u_name.value = "";
    u_type.value = "employee";
    u_phone.value = "";
    u_email.value = "";

    u_role.value = "";
    u_doc.value = "";
    u_color.value = "#4A90E2";

    u_birth.value = "";
    u_obs.value = "";

    employeeFields.classList.remove("d-none");
    patientFields.classList.add("d-none");
  }

  // ==============================
  // Filters
  // ==============================
  typeFilter.forEach((r) => (r.onchange = () => renderUsers()));

  // Inicializar
  renderUsers();
})();
