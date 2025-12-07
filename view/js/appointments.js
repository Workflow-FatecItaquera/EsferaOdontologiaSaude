(() => {
  // ==============================
  // Helpers: load professionals from users
  // ==============================
  const USERS_LS_KEY = "ESFERA_USERS"; // chave do users.js
  const APPTS_LS_KEY = "esfera_appointments_v1";

  // fallback hardcoded professionals (mantive os originais só como fallback)
  const PROFESSIONALS_FALLBACK = [
    {
      id: 1,
      name: "Recepcionista | Matheus Sobreira",
      short: "Matheus",
      color: "#9ad1aeff",
    },
    { id: 2, name: "Dentista | Marcelo", short: "Marcelo", color: "#E4D9FF" },
    {
      id: 3,
      name: "Psicanalista | Dr. Auzio Varella",
      short: "Auzio",
      color: "#FFE8A3",
    },
    { id: 4, name: "Dr. Pedro F", short: "Pedro", color: "#CDEBF6" },
  ];

  // mutable professionals list (vai ser carregada dos users)
  let PROFESSIONALS = [];

  function loadProfessionalsFromUsers() {
    try {
      const raw = JSON.parse(localStorage.getItem(USERS_LS_KEY) || "[]");
      // pegar apenas funcionários ativos
      const employees = raw
        .filter((u) => u && u.type === "employee")
        .filter((u) =>
          typeof u.active === "undefined" ? true : Boolean(u.active)
        )
        .map((u) => {
          const id =
            typeof u.id === "number"
              ? u.id
              : isNaN(Number(u.id))
              ? String(u.id)
              : Number(u.id);
          const short = (u.name || "").split(" ")[0] || u.name || "Prof";
          const role = u.role ? `${u.role} | ${u.name}` : u.name;
          return {
            id,
            name: role,
            short,
            color: u.color || "#CDEBF6",
          };
        });

      // se não houver funcionários cadastrados, retorna fallback
      if (!employees.length) return PROFESSIONALS_FALLBACK.slice();

      return employees;
    } catch (e) {
      console.warn("Erro ao carregar usuários para profissionais:", e);
      return PROFESSIONALS_FALLBACK.slice();
    }
  }

  // ==============================
  // Appointments LS
  // ==============================
  let appointments = JSON.parse(localStorage.getItem(APPTS_LS_KEY) || "[]");

  function saveAppointments() {
    localStorage.setItem(APPTS_LS_KEY, JSON.stringify(appointments));
  }

  // ==============================
  // DOM Refs
  // ==============================
  const dateInput = document.getElementById("ap-date");
  const professionalsList = document.getElementById("professionalsList");
  const timelineContainer = document.getElementById("timelineContainer");
  const agendaDateLabel = document.getElementById("agendaDateLabel");
  const agendaLegend = document.getElementById("agendaLegend");
  const btnNew = document.getElementById("btnNewAppointment");
  const btnFilterAll = document.getElementById("btnFilterAll");

  const modal = document.getElementById("appointmentModal");
  const modalClose = document.getElementById("modalClose");
  const modalPrev = document.getElementById("modalPrev");
  const modalNext = document.getElementById("modalNext");
  const modalSteps = document.querySelectorAll(".modal-step");
  const modalError = document.getElementById("modalError");
  const m_patientName = document.getElementById("m_patientName");
  const m_patientPhone = document.getElementById("m_patientPhone");
  const m_patientEmail = document.getElementById("m_patientEmail");
  const m_professionals = document.getElementById("m_professionals");
  const m_date = document.getElementById("m_date");
  const m_timeSlots = document.getElementById("m_timeSlots");
  const m_review = document.getElementById("m_review");

  // ==============================
  // State
  // ==============================
  let modalState = { step: 1, professionalId: null, slotISO: null };
  let activeProfessionalFilter = null;

  // ==============================
  // Utilidades de data/format
  // ==============================
  function formatTime(date) {
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  function formatDateLabel(d) {
    const date = new Date(d);
    return date.toLocaleDateString();
  }

  // ==============================
  // Inicializa PROFESSIONALS a partir dos users
  // ==============================
  function initProfessionals() {
    PROFESSIONALS = loadProfessionalsFromUsers();
  }

  // expose refresh to be called from users.js
  window._ESFERA = window._ESFERA || {};
  window._ESFERA.refreshProfessionals = function () {
    initProfessionals();
    renderProfessionals();
    renderTimeline();
  };

  // ==============================
  // seed appointments (se vazio)
  // ==============================
  (function seedIfEmpty() {
    if (appointments.length) return;
    initProfessionals();
    const today = new Date();
    const sampleDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      10,
      0
    );

    // tenta usar um profissional real, se houver
    const profId =
      PROFESSIONALS && PROFESSIONALS.length
        ? PROFESSIONALS[0].id
        : PROFESSIONALS_FALLBACK[1].id;

    appointments.push({
      id: Date.now(),
      professionalId: profId,
      patientName: "Rodrigo Oliveira",
      phone: "(11) 99999-0000",
      email: "",
      datetimeISO: sampleDate.toISOString(),
      durationMin: 30,
      reminder: true,
    });
    saveAppointments();
  })();

  // ==============================
  // Render Professionals (sidebar)
  // ==============================
  function renderProfessionals() {
    // garante que PROFESSIONALS esteja carregado
    if (!PROFESSIONALS || !PROFESSIONALS.length) initProfessionals();

    professionalsList.innerHTML = "";
    PROFESSIONALS.forEach((p) => {
      const el = document.createElement("div");
      el.className =
        "professionalsCards d-flex align-items-center justify-content-between p-2 rounded";
      el.style.border =
        activeProfessionalFilter === String(p.id) ||
        activeProfessionalFilter === p.id
          ? "1px solid rgba(16,53,96,0.50)"
          : "1px solid rgba(0,0,0,0.09)";
      el.style.cursor = "pointer";
      el.innerHTML = `
        <div class="d-flex align-items-center" style="gap:0.75rem">
          <span class="dot" style="background:${
            p.color
          }; width:14px;height:14px;border-radius:50%;display:inline-block;"></span>
          <div>
            <div class="small fw-bold">${p.short}</div>
            <div class="small text-muted" style="font-size:0.8rem">${
              p.name
            }</div>
          </div>
        </div>
        <div class="small text-muted">${countAppointmentsForProfessionalOnDate(
          p.id,
          dateInput.value
        )}</div>
      `;
      el.addEventListener("click", () => {
        activeProfessionalFilter =
          activeProfessionalFilter === p.id ||
          activeProfessionalFilter === String(p.id)
            ? null
            : p.id;
        renderProfessionals();
        renderTimeline();
      });
      professionalsList.appendChild(el);
    });

    if (!PROFESSIONALS.length) {
      professionalsList.innerHTML = `<div class="text-muted small">Nenhum profissional cadastrado. Cadastre em Usuários → Funcionário.</div>`;
    }
  }

  function countAppointmentsForProfessionalOnDate(profId, dateISO) {
    if (!dateISO) return "";
    const date = new Date(dateISO);
    const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    return appointments.filter(
      (a) =>
        String(a.professionalId) === String(profId) &&
        new Date(a.datetimeISO) >= start &&
        new Date(a.datetimeISO) < end
    ).length;
  }

  // ==============================
  // Render Timeline
  // ==============================
  function renderTimeline() {
    const dateValue = dateInput.value ? new Date(dateInput.value) : new Date();
    const dayStart = new Date(
      dateValue.getFullYear(),
      dateValue.getMonth(),
      dateValue.getDate(),
      8,
      0
    );
    const dayEnd = new Date(
      dateValue.getFullYear(),
      dateValue.getMonth(),
      dateValue.getDate(),
      18,
      0
    );

    agendaDateLabel.textContent = formatDateLabel(dayStart);
    agendaLegend.textContent = activeProfessionalFilter
      ? `Agenda — ${
          (
            PROFESSIONALS.find(
              (p) => String(p.id) === String(activeProfessionalFilter)
            ) || {}
          ).short || "—"
        }`
      : "Todos os agendamentos";

    timelineContainer.innerHTML = "";

    const slotMin = 15;
    for (
      let t = new Date(dayStart);
      t < dayEnd;
      t.setMinutes(t.getMinutes() + slotMin)
    ) {
      const slotISO = new Date(t).toISOString();
      const slotEnd = new Date(t);
      slotEnd.setMinutes(slotEnd.getMinutes() + slotMin);

      const booked = appointments.find((ap) => {
        if (
          activeProfessionalFilter &&
          String(ap.professionalId) !== String(activeProfessionalFilter)
        )
          return false;
        const aStart = new Date(ap.datetimeISO);
        const aEnd = new Date(aStart);
        aEnd.setMinutes(aEnd.getMinutes() + ap.durationMin);
        return aStart < slotEnd && aEnd > t;
      });

      const row = document.createElement("div");
      row.className = "time-row " + (booked ? "booked" : "free");

      const left = document.createElement("div");
      left.className = "slot-time";
      left.textContent = formatTime(t);

      const right = document.createElement("div");
      right.className =
        "slot-card d-flex justify-content-between align-items-center";

      if (booked) {
        const prof =
          PROFESSIONALS.find(
            (p) => String(p.id) === String(booked.professionalId)
          ) || {};
        right.innerHTML = `
          <div class="slot-info">
            <span class="slot-dot" style="background:${
              prof.color || "#ddd"
            }"></span>
            <div>
              <div class="small fw-bold">${booked.patientName}</div>
              <div class="small text-muted">${prof.short || ""} • ${formatTime(
          booked.datetimeISO
        )}</div>
            </div>
          </div>
          <div class="small text-muted"> ${booked.durationMin} min </div>
        `;
      } else {
        right.innerHTML = `
          <div class="small text-muted">Livre</div>
          <div><button class="btn btn-sm btn-schedule">Agendar</button></div>
        `;
      }

      if (!booked) {
        row.addEventListener("click", (e) => {
          if (
            e.target.closest(".btn-schedule") ||
            e.target.classList.contains("btn-schedule") ||
            !e.target.closest("button")
          ) {
            openModalPrefill(dateValue, new Date(t).toISOString());
          }
        });
      }

      row.appendChild(left);
      row.appendChild(right);
      timelineContainer.appendChild(row);
    }
  }

  function closeModal() {
    modal.setAttribute("aria-hidden", "true");
  }

  function showModalStep(step) {
    modalSteps.forEach((s) => {
      if (+s.dataset.step === step) s.classList.remove("d-none");
      else s.classList.add("d-none");
    });
    modalState.step = step;
    modalPrev.style.display = step === 1 ? "none" : "";
    modalNext.textContent =
      step === modalSteps.length ? "Confirmar" : "Próximo";
    if (step === 3) renderModalTimeSlots();
    if (step === 4) renderModalReview();
  }

  function renderModalProfessionals() {
    // garante que PROFESSIONALS esteja atualizado
    if (!PROFESSIONALS || !PROFESSIONALS.length) initProfessionals();

    m_professionals.innerHTML = "";
    PROFESSIONALS.forEach((p) => {
      const el = document.createElement("div");
      el.className =
        "d-flex align-items-center justify-content-between p-2 rounded";
      el.style.cursor = "pointer";
      el.style.border = "1px solid rgba(0,0,0,0.03)";
      el.innerHTML = `
        <div style="display:flex;align-items:center;gap:0.75rem">
          <span class="dot" style="background:${p.color}; width:12px;height:12px;border-radius:50%;display:inline-block;"></span>
          <div>
            <div class="small fw-bold">${p.short}</div>
            <div class="small text-muted" style="font-size:0.8rem">${p.name}</div>
          </div>
        </div>
      `;
      el.addEventListener("click", () => {
        modalState.professionalId = p.id;
        Array.from(m_professionals.children).forEach(
          (c) => (c.style.border = "1px solid rgba(0,0,0,0.03)")
        );
        el.style.border = "1px solid rgba(16,53,96,0.50)";
      });
      m_professionals.appendChild(el);
    });

    if (!PROFESSIONALS.length) {
      m_professionals.innerHTML =
        '<div class="small text-muted">Nenhum profissional disponível. Cadastre funcionários em Usuários.</div>';
    }
  }

  function renderModalTimeSlots() {
    m_timeSlots.innerHTML = "";
    if (!modalState.professionalId) {
      m_timeSlots.innerHTML =
        '<div class="small text-muted">Selecione um profissional primeiro.</div>';
      return;
    }
    const dateVal = m_date.value ? new Date(m_date.value) : new Date();
    const start = new Date(
      dateVal.getFullYear(),
      dateVal.getMonth(),
      dateVal.getDate(),
      8,
      0
    );
    const end = new Date(
      dateVal.getFullYear(),
      dateVal.getMonth(),
      dateVal.getDate(),
      18,
      0
    );
    for (let t = new Date(start); t < end; t.setMinutes(t.getMinutes() + 15)) {
      const slotStart = new Date(t);
      const slotEnd = new Date(slotStart);
      slotEnd.setMinutes(slotEnd.getMinutes() + 15);
      const conflict = appointments.find((ap) => {
        if (String(ap.professionalId) !== String(modalState.professionalId))
          return false;
        const aStart = new Date(ap.datetimeISO);
        const aEnd = new Date(aStart);
        aEnd.setMinutes(aEnd.getMinutes() + ap.durationMin);
        return aStart < slotEnd && aEnd > slotStart;
      });
      const row = document.createElement("div");
      row.className =
        "d-flex justify-content-between align-items-center p-2 rounded";
      row.style.border = "1px solid rgba(0,0,0,0.03)";
      row.style.marginBottom = "6px";
      row.innerHTML = `
        <div class="small">${formatTime(slotStart)}</div>
        <div>${
          conflict
            ? '<span class="small text-muted">Ocupado</span>'
            : `<button class="btn modal-choose-time">Escolher</button>`
        }</div>
      `;
      if (!conflict) {
        row
          .querySelector(".modal-choose-time")
          .addEventListener("click", () => {
            modalState.slotISO = slotStart.toISOString();
            showModalStep(4);
          });
      }
      m_timeSlots.appendChild(row);
    }
  }

  function renderModalReview() {
    const prof = PROFESSIONALS.find(
      (p) => String(p.id) === String(modalState.professionalId)
    );
    const slot = modalState.slotISO ? new Date(modalState.slotISO) : null;
    m_review.innerHTML = `
      <div><strong>Paciente:</strong> ${
        m_patientName.value || "(não informado)"
      }</div>
      <div><strong>Profissional:</strong> ${
        prof ? prof.name : "(não selecionado)"
      }</div>
      <div><strong>Data / Horário:</strong> ${
        slot
          ? formatDateLabel(slot) + " • " + formatTime(slot)
          : "(não selecionado)"
      }</div>
      <div><strong>Telefone:</strong> ${
        m_patientPhone.value || "(não informado)"
      }</div>
    `;
  }

  // ==============================
  // Modal navigation / confirm
  // ==============================
  modalNext.addEventListener("click", () => {
    modalError.classList.add("d-none");

    if (modalState.step === 1) {
      if (!m_patientName.value.trim()) {
        modalError.textContent = "Por favor insira o nome do paciente.";
        modalError.classList.remove("d-none");
        return;
      }
      showModalStep(2);
    } else if (modalState.step === 2) {
      if (!modalState.professionalId) {
        modalError.textContent = "Selecione um profissional.";
        modalError.classList.remove("d-none");
        return;
      }
      showModalStep(3);
    } else if (modalState.step === 3) {
      if (!modalState.slotISO) {
        modalError.textContent = "Escolha um horário disponível.";
        modalError.classList.remove("d-none");
        return;
      }
      showModalStep(4);
    } else if (modalState.step === 4) {
      const newAp = {
        id: Date.now(),
        professionalId: modalState.professionalId,
        patientName: m_patientName.value.trim(),
        phone: m_patientPhone.value.trim(),
        email: m_patientEmail.value.trim(),
        datetimeISO: modalState.slotISO,
        durationMin: 15,
      };

      // conflito
      const aStart = new Date(newAp.datetimeISO);
      const aEnd = new Date(aStart);
      aEnd.setMinutes(aEnd.getMinutes() + newAp.durationMin);
      const conflict = appointments.find((ap) => {
        if (String(ap.professionalId) !== String(newAp.professionalId))
          return false;
        const s = new Date(ap.datetimeISO);
        const e = new Date(s);
        e.setMinutes(e.getMinutes() + ap.durationMin);
        return s < aEnd && e > aStart;
      });
      if (conflict) {
        modalError.textContent =
          "Este horário já foi ocupado. Escolha outro horário.";
        modalError.classList.remove("d-none");
        showModalStep(3);
        return;
      }

      appointments.push(newAp);
      saveAppointments();
      closeModal();
      renderProfessionals();
      renderTimeline();
    }
  });

  modalPrev.addEventListener("click", () => {
    const prev = Math.max(1, modalState.step - 1);
    showModalStep(prev);
  });

  modalClose.addEventListener("click", closeModal);
  document.getElementById("modalClose").addEventListener("click", closeModal);
  document.getElementById("appointmentModal").addEventListener("click", (e) => {
    if (e.target.classList.contains("appointments-modal-backdrop"))
      closeModal();
  });


  function openModalPrefill(dateObj, slotISO = null) {
    modalState = {
      step: 1,
      professionalId: activeProfessionalFilter || null,
      slotISO,
    };

    m_patientName.value = "";
    m_patientPhone.value = "";
    m_patientEmail.value = "";
    m_date.value = dateObj.toISOString().slice(0, 10);

    modalError.classList.add("d-none");

    renderModalProfessionals();

    if (modalState.professionalId) {
      // já seleciona o profissional visualmente
      [...m_professionals.children].forEach((child) => {
        const id = child.dataset.profId;
        if (String(id) === String(modalState.professionalId))
          child.style.border = "1px solid rgba(16,53,96,0.50)";
      });
    }

    showModalStep(1);
    modal.setAttribute("aria-hidden", "false");
  }

  // ==============================
  // Init
  // ==============================
  function init() {
    initProfessionals();

    const todayISO = new Date().toISOString().slice(0, 10);
    dateInput.value = todayISO;
    renderProfessionals();
    renderTimeline();

    dateInput.addEventListener("change", () => {
      renderProfessionals();
      renderTimeline();
    });

    btnNew.addEventListener("click", () => {
      openModalPrefill(new Date(dateInput.value || new Date()), null);
    });

    btnFilterAll.addEventListener("click", () => {
      activeProfessionalFilter = null;
      renderProfessionals();
      renderTimeline();
    });
  }

  init();

  // expose some utils for debug/interaction
  window._ESFERA.appointments = appointments;
  window._ESFERA.renderTimeline = renderTimeline;
  window._ESFERA.renderProfessionals = renderProfessionals;
})();
