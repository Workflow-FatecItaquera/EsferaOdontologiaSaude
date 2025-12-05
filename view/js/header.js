document.addEventListener("DOMContentLoaded", function () {
    const toggles = document.querySelectorAll(".toggle-section");

    toggles.forEach(toggle => {
        const section = toggle.nextElementSibling;
        const icon = toggle.querySelector("i");

        toggle.addEventListener("click", function () {
            const isOpen = section.classList.contains("open");

            section.classList.toggle("open");

            if (isOpen) {
                icon.classList.remove("bi-caret-down-fill");
                icon.classList.add("bi-caret-right-fill");
            } else {
                icon.classList.remove("bi-caret-right-fill");
                icon.classList.add("bi-caret-down-fill");
            }
        });
    });
});
