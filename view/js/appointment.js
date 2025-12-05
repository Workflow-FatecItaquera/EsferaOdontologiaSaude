document.addEventListener("DOMContentLoaded", function () {
    const addBtn = document.querySelector(".add-option");
    const procedureSelect = document.querySelector("select[name='procedures']");
    const container = document.querySelector(".all-appointments");

    addBtn.addEventListener("click", function (e) {
        e.preventDefault();

        const selectedValue = procedureSelect.value;
        const selectedText = procedureSelect.options[procedureSelect.selectedIndex].text;

        if (!selectedValue) return;

        // IDs genéricos (trocar pelos reais do banco de dados)
        //Puxar o profissional ligado a um procedimento/honorário
        //Se tiver mais de um profissional por procedimento, criar um array json e inserir no campo de id no banco (profissional e procedimento)
        const idProcedimento = "{id_do_procedimento}";
        const idProfissional = "{id_do_profissional}";

        const div = document.createElement("div");
        div.classList.add("appointment", "d-flex", "flex-row", "justify-content-between", "align-items-center");

        div.innerHTML = `
            <div class="d-flex flex-column">
                <p>${selectedText}</p>
                <input type="hidden" name="procedures[]" value="${idProcedimento}">
                <p class="professional">Dentista: Nome do Profissional</p>
                <input type="hidden" name="professionals[]" value="${idProfissional}">
            </div>
            <i class="bi bi-x remove"></i>
        `;

        container.appendChild(div);
    });

    // Remover item
    document.addEventListener("click", function (e) {
        if (e.target.classList.contains("remove")) {
            e.target.closest(".appointment").remove();
        }
    });
});
