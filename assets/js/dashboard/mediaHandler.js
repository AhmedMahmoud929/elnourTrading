const mainSection = document.querySelector("main#content");
const fileInputs = document.querySelectorAll("#imageUpload");
const imageLabels = document.querySelectorAll(".image-label");
const cancelBtn = document.querySelector("button.cancel");
const applyBtn = document.querySelector("button.apply");
const popupForm = document.querySelector(".edit-popup form");
const popup = document.querySelector(".edit-popup");
const imagePreview = document.getElementById("imagePreview");
const videoPreview = document.getElementById("videoPreview");
const videoSource = document.querySelector("#videoPreview source");

fileInputs.forEach((inp, ix) => {
  inp.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        if (file.type == "video/mp4") {
          videoPreview.style.display = "block";
          videoSource.setAttribute("src", e.target.result);
          videoPreview.load();
        } else {
          imagePreview.style.display = "block";
          imagePreview.src = e.target.result;
        }
      };
      reader.readAsDataURL(file);
      popup.classList.remove("hidden");
      popup.setAttribute("inpIx", ix);
    }
    mainSection.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    mainSection.classList.add("disabled");
  });
});

cancelBtn.addEventListener("click", () => {
  popup.classList.add("hidden");
  setTimeout(() => {
    imagePreview.src = "";
  }, 2000);
});

applyBtn.addEventListener("click", () => {
  const ix = popup.getAttribute("inpIx");
  const file = fileInputs[ix].files[0];
  if (file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", file.type);
    formData.append("key", imageLabels[ix].getAttribute("key"));
    applyBtn.innerHTML = "Loading...";
    fetch("/dashboard/media", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } else {
    alert("No file selected");
  }
});
