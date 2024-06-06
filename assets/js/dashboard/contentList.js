const mainTree = document.querySelector(".tree");

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
    })
    .catch((error) => console.error("Error fetching translations:", error));
};

window.onload = fetchTranslations;

const displayContentElements = (mainTitle, obj, arData, ix) => {
  const parentLi = document.createElement("li");
  parentLi.setAttribute("data-aos", "fade-up");
  parentLi.setAttribute("data-aos-duration", "500");
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
        arData[mainTitle][key]
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
          arData[mainTitle][key][key2]
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

const formatOrdinaryElement = (key, en, ar) => `
<li>
  ${key}:
  <div class="trans-cont">
    <div class="form__field">
      <label>EN</label>
      <input autocomplete="off" type="text" class="form__input" placeholder="${key}" value="${en}" />
    </div>
    <div class="form__field">
      <label>AR</label>
      <input autocomplete="off" type="text" class="form__input" placeholder="${key}" 
      value="${ar}"
      />
    </div>
  </div>
</li>`;
