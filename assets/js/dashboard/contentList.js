const mainSection = document.querySelector("main#content");
const mainTree = document.querySelector(".tree");
const editPopup = document.querySelector(".edit-popup");
const keysDiv = document.querySelector(".edit-popup .keys");
const hiddenInp = document.querySelector(".inputs-cont input[type='hidden']");
const transInputs = document.querySelectorAll(".edit-popup .form__field");

const activateDropDowns = () => {
  const togglers = document.querySelectorAll(".caret");
  togglers.forEach((ele) => {
    ele.addEventListener("click", function () {
      let nestedList = this.parentElement.querySelector(".nested");
      nestedList.classList.toggle("collapsed");
      this.classList.toggle("caret-down");
    });
  });
};

const fetchTranslations = () => {
  fetch("/dashboard/locales")
    .then((response) => response.json())
    .then((data) => {
      const enData = data.en;
      const arData = data.ar;
      document.querySelector(".dot-spinner").classList.add("hidden");
      Object.entries(enData).forEach(([parent, obj], ix) => {
        displayContentElements(parent, obj, arData, ix);
      });
      activateDropDowns();
      activateEditBtns();
    })
    .catch((error) => console.error("Error fetching translations:", error));
};

window.onload = fetchTranslations;

const displayContentElements = (mainTitle, obj, arData, ix) => {
  const parentLi = document.createElement("li");
  parentLi.setAttribute("data-aos", "fade-up");
  parentLi.setAttribute("data-aos-duration", "500");
  parentLi.setAttribute("data-aos-anchor", ".cert");
  parentLi.setAttribute("data-aos-delay", 100 * (1 + ix));
  const spanTitle = document.createElement("span");
  spanTitle.classList.add("caret", "main", "cert-down");
  spanTitle.textContent = mainTitle;
  const childUl = document.createElement("ul");
  childUl.classList.add("nested", "collapsed");

  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === "string") {
      const ordinaryElement = formatOrdinaryElement(
        key,
        value,
        arData[mainTitle][key],
        mainTitle
      );
      childUl.insertAdjacentHTML("beforeend", ordinaryElement);
    } else if (typeof value === "object") {
      const objLi = document.createElement("li");
      const objTitle = document.createElement("span");
      objTitle.classList.add("caret", "cert-down");
      objTitle.textContent = key;
      const subChildUL = document.createElement("ul");
      subChildUL.classList.add("nested", "collapsed");

      Object.entries(value).forEach(([key2, value2]) => {
        const subElement = formatOrdinaryElement(
          key2,
          value2,
          arData[mainTitle][key][key2],
          mainTitle,
          key
        );
        subChildUL.insertAdjacentHTML("beforeend", subElement);
      });

      objLi.append(objTitle, subChildUL);
      childUl.append(objLi);
    }
  });

  parentLi.append(spanTitle, childUl);
  mainTree.append(parentLi);
};

const formatOrdinaryElement = (key, en, ar, mainTitle, subTitle) => `
<li>
  ${key} :
  <div class="trans-cont">
    <div class="edit-float" key="${key}" en="${en}" ar="${ar}" mainTitle="${mainTitle}" subTitle="${subTitle}" >
      <i class="fa-solid fa-pen"></i>
    </div>
    <div class="inputs-cont">
      <div class="form__field">
          <label>EN</label>
         ${
           en.length > 70
             ? `<textarea readOnly style='pointer-events:none'>${en}</textarea>`
             : `<input  autocomplete="off" style='pointer-events:none' readOnly type="text" class="form__input" placeholder="${key}" value="${en}" />`
         } 
        </div>
        <div class="form__field">
          <label>AR</label>
          ${
            en.length > 70
              ? `<textarea readOnly style='pointer-events:none'>${ar}</textarea>`
              : `<input autocomplete="off" style='pointer-events:none' readOnly type="text" class="form__input" placeholder="${key}" value="${ar}" />`
          } 
        </div>
    </div>
    
  </div>
</li>`;

const activateEditBtns = () =>
  document.querySelectorAll(".edit-float").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("key");
      const en = btn.getAttribute("en");
      const ar = btn.getAttribute("ar");
      const mainTitle = btn.getAttribute("mainTitle");
      const subTitle = btn.getAttribute("subTitle");

      keysDiv.innerHTML = `
      <span>${mainTitle}</span>
      <i class="fa-solid fa-angle-right"></i>
      ${
        subTitle == "undefined"
          ? ""
          : `<span>${subTitle}</span>
        <i class="fa-solid fa-angle-right"></i>`
      }
      <span>${key}</span>
      `;

      transInputs[0].innerHTML +=
        en.length > 70
          ? `<textarea name='en' >${en}</textarea>`
          : `<input
                autocomplete="off"
                type="text" name='en' 
                class="form__input"
                placeholder="${key}"
                value="${en}"
              />`;
      transInputs[1].innerHTML +=
        ar.length > 70
          ? `<textarea name='ar' >${ar}</textarea>`
          : ` <input
                autocomplete="off"
                type="text" name='ar' 
                class="form__input"
                placeholder="${key}"
                value="${ar}"
              />`;

      editPopup.classList.remove("hidden");
      hiddenInp.value =
        subTitle == "undefined"
          ? `${mainTitle}#${key}`
          : `${mainTitle}#${subTitle}#${key}`;
      console.log(hiddenInp.value);
      mainSection.scrollTo({
        top: 0,
        behavior: "smooth", // Optional: 'auto' for instant scrolling
      });
      mainSection.classList.add("disabled");
    });
  });

// Close popup event listener
document.getElementById("closePopupBtn").addEventListener("click", () => {
  console.log("object");
  editPopup.classList.add("hidden");
  transInputs[0].innerHTML = `<label>EN</label>`;
  transInputs[1].innerHTML = `<label>AR</label>`;
  mainSection.classList.remove("disabled");
});
