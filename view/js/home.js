(() => {
  const LS_USERS = "ESFERA_USERS";

  function loadUsers() {
    return JSON.parse(localStorage.getItem(LS_USERS) || "[]");
  }

  const employeesBox = document.querySelector(".employees-box");

  if (employeesBox) {
    const renderEmployees = () => {
      const USERS = loadUsers();
      const employees = USERS.filter((u) => u.type === "employee" && u.active);

      employeesBox.innerHTML = `<h6 class="fw-bold mb-3">Funcionários ativos</h6>`;

      if (employees.length === 0) {
        employeesBox.innerHTML += `
          <p class="text-muted small">Nenhum funcionário cadastrado.</p>
        `;
        return;
      }

      employees.forEach((u) => {
        const div = document.createElement("div");
        div.className = "employee-card p-3 rounded mb-3";

        div.innerHTML = `
          <strong>
            <span class="dot" style="--color: ${u.color || "#999"}"></span>
            ${u.role || "Cargo indefinido"} | ${u.name}
          </strong>

          <p class="mb-0 small text-muted">
            Identificação: ${u.document || "—"}
          </p>

          <p class="small text-muted">
            Status: ${u.active ? "Ativo" : "Inativo"}
          </p>
        `;

        employeesBox.appendChild(div);
      });
    };

    window._ESFERA = window._ESFERA || {};
    window._ESFERA.refreshEmployees = renderEmployees;
    renderEmployees();
  } else {
    console.warn("[Home] .employees-box não encontrada.");
  }

  // =============================================
  // APPOINTMENTS (NOVO)
  // =============================================
  const LS_APPOINTMENTS = "esfera_appointments_v1";

  function loadAppointments() {
    return JSON.parse(localStorage.getItem(LS_APPOINTMENTS) || "[]");
  }

  const appointmentsBox = document.querySelector(".appointments-box");

  if (!appointmentsBox) {
    console.warn("[Home] .appointments-box não encontrada.");
    return;
  }

  // pega profissionais pelo id
  function getProfessionalName(id) {
    const users = loadUsers();
    const prof = users.find((u) => u.id == id);
    return prof ? prof.name || "Profissional" : "Desconhecido";
  }

  // Dá um tapa bonito no horário
  function formatTime(isoStr) {
    const date = new Date(isoStr);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function renderAppointments(limit = 10) {
    const appointments = loadAppointments();

    appointmentsBox.innerHTML = `
    
  `;

    if (appointments.length === 0) {
      appointmentsBox.innerHTML += `
      <p class="text-muted small">Nenhum agendamento encontrado.</p>
    `;
      return;
    }

    const sorted = appointments
      .filter((a) => a && a.datetimeISO)
      .sort((a, b) => new Date(a.datetimeISO) - new Date(b.datetimeISO))
      .slice(0, limit);

    sorted.forEach((a) => {
      const div = document.createElement("div");
      div.className = "appointment-card p-3 rounded mb-3";

      // pega horas formatadas
      const date = new Date(a.datetimeISO);
      const dia = date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      });
      const horaInicio = date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      // horário final (opcional — ajusta se tiver duração)
      let horaFim = "";
      if (a.endTimeISO) {
        const end = new Date(a.endTimeISO);
        horaFim = end.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      }

      const profName = getProfessionalName(a.professionalId);
      const patient = a.patientName || "Sem nome";

      div.innerHTML = `
    <small>${dia} • ${horaInicio}${horaFim ? ` - ${horaFim}` : ""}</small>
    <p class="mb-0 fw-bold">${profName}</p>
    <p class="text-muted small mb-0">Paciente ${patient}</p>
  `;

      appointmentsBox.appendChild(div);
    });
  }

  window._ESFERA = window._ESFERA || {};
  window._ESFERA.refreshAppointments = renderAppointments;

  function setCurrentMonthLabel() {
    const el = document.querySelector("#appointments-month");
    if (!el) return;

    const now = new Date();
    const formatted = now.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    // Capitaliza a primeira letra (pq o toLocale vem "novembro")
    const cap = formatted.charAt(0).toUpperCase() + formatted.slice(1);

    el.textContent = cap;
  }

  setCurrentMonthLabel();

  renderAppointments();
})();
