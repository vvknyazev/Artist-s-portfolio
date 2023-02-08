const scriptURL = 'https://script.google.com/macros/s/AKfycbyDXe3l_ZdXktje2RKLE-W1JAcwLi5WLnlIxwbuDrnwUdlGPIGv-sr1VGONxoXOPsljVA/exec'
const form = document.forms['submit-to-google-sheet']
const msg = document.getElementById("msg");
form.addEventListener('submit', e => {
    e.preventDefault()
    fetch(scriptURL, { method: 'POST', body: new FormData(form)})
        .then(response => {
            msg.innerHTML = "Message sent successfully";
            setTimeout(() => msg.innerHTML = "", 5000);
            form.reset();
        })
        .catch(error => console.error('Error!', error.message))
})