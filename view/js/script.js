let logo = 0;

document.getElementById("esferaIcon").addEventListener("click", function () {
    logo++;
    if (logo > 9) {
        console.log("Easter Egg Activated");
        logo = 0;
        document.getElementById("cardLabubu").style.display = "block";
    }
});
