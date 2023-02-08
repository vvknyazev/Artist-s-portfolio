const menu = document.querySelector(".menu");

window.addEventListener("scroll", function () {
    if (window.scrollY >= 100) {
        menu.classList.add("_active");
    } else {
        menu.classList.remove("_active");
    }
});
//
// // read the body of the response
// const data = await response.json();
// console.log(data);
//
// if (document.querySelector(".reg-message")){
//     const message = document.querySelector(".reg-message");
//     setTimeout(() => {
//         message.classList.add(".reg-message_active");
//     },2000);
// }