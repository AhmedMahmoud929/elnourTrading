// VIEW MODAL
function openView(src = "", type = "") {
  if (type == "img") document.querySelector(".view-modal img").src = src;
  else if (type == "brochure")
    document.querySelector(".view-modal iframe").src = src;
  document.querySelector(".view-modal").classList.add("active");
}
function closeView() {
  document.querySelector(".view-modal").classList.remove("active");
}
