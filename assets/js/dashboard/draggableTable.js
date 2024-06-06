// DraggableTable
const table = document.getElementById("draggableTable");
const loader = document.getElementById("loaderCont");
// ViewModal
const tdBtnGroups = document.querySelectorAll(".td-btn-group");
const sureModal = document.querySelectorAll(".sure-modal");
// SureModal
const openBtns = document.querySelectorAll(".open-sure-modal");
const closeBtns = document.querySelectorAll(".close-sure-modal");

const sortable = new Sortable(table, {
  handle: ".handle",
  swap: true,
  animation: 150,
  ghostClass: "sortable-ghost",
  onEnd: async (event) => {
    const elements = sortable.toArray();
    const { oldIndex, newIndex } = event;
    const firstId = elements[newIndex];
    const secondId = elements[oldIndex];

    const formData = new URLSearchParams();
    formData.append("firstId", firstId);
    formData.append("secondId", secondId);

    setTimeout(() => {
      loader.style.display = "flex";
    }, 400);
    try {
      await fetch(`/dashboard/gallery/reorder`, {
        method: "POST",
        body: formData,
      });
      window.location.reload();
      // loader.style.display = "none";
    } catch (error) {
      console.error(error);
    }
  },
});



// SURE MODAL
openBtns.forEach((btn, ix) => {
  // console.log(btn);
  btn.addEventListener("click", () => {
    tdBtnGroups[ix].style.display = "none";
    sureModal[ix].style.display = "block";
  });
});

closeBtns.forEach((btn, ix) => {
  btn.addEventListener("click", () => {
    tdBtnGroups[ix].style.display = window.innerWidth > 800 ? "block" : "flex";
    // if (window.innerWidth > 800)
    //   document.querySelector(
    //     ".main-table .td-btn-group > div:last-child"
    //   ).style.marginTop = "10px";
    sureModal[ix].style.display = "none";
  });
});
