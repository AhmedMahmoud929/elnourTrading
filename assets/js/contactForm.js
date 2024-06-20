const contactForm = document.querySelector(".login.contact");
const nameInp = document.querySelector(".login.contact input[name='name']");
const emailInp = document.querySelector(".login.contact input[name='email']");
const msgInp = document.querySelector(".login.contact textarea");
const submitInp = document.querySelector(".login.contact input[type='submit']");

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = nameInp.value;
  const email = emailInp.value;
  const msg = msgInp.value;
  const lang = contactForm.getAttribute("lang");
  if (name && email && msg) {
    nameInp.value = emailInp.value = msgInp.value = "";
    submitInp.value = "Wait...";
    fetch("/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, msg, lang }),
    })
      .then((res) => res.json())
      .then(({ title, msg, done }) => {
        console.log(done);
        showNotify(title, msg, done);
        submitInp.value = "Send";
      })
      .catch((err) => console.log(err));
  }
});
