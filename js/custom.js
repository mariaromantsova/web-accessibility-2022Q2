(function() {
  var burger = document.querySelector(".burger");
  var menu = document.querySelector("#" + burger.dataset.target);
  burger.addEventListener("click", function() {
    burger.classList.toggle("is-active");
    menu.classList.toggle("is-active");
  });
})();

class Tabs {
  constructor(groupNode) {
    this.tablistNode = groupNode;

    this.tabpanes = [];
    this.firstTab = null;
    this.lastTab = null;
    this.tabs = [...this.tablistNode.querySelectorAll("[role=tab]")];
    this.tabs.forEach((tab) => {
      var tabpane = document.getElementById(tab.getAttribute("aria-controls"));

      tab.tabIndex = -1;
      tab.setAttribute("aria-selected", "false");
      this.tabpanes.push(tabpane);

      tab.addEventListener("keydown", this.onKeydown.bind(this));
      tab.addEventListener("click", this.onClick.bind(this));

      if (!this.firstTab) {
        this.firstTab = tab;
      }
      this.lastTab = tab;
    });

    this.setSelectedTab(this.firstTab);
  }

  setSelectedTab(currentTab) {
    this.tabs.forEach((tab, index) => {
      if (currentTab === tab) {
        tab.setAttribute("aria-selected", "true");
        tab.classList.add("is-active");
        tab.removeAttribute("tabindex");
        tab.tabIndex = 0;

        this.tabpanes[index].classList.remove("is-hidden");
        this.tabpanes[index].classList.add("is-active");
      } else {
        tab.setAttribute("aria-selected", "false");
        tab.classList.remove("is-active");
        tab.tabIndex = -1;

        this.tabpanes[index].classList.add("is-hidden");
        this.tabpanes[index].classList.remove("is-active");
      }
    });
  }

  moveFocusToTab(currentTab) {
    currentTab.focus();
  }

  moveFocusToPreviousTab(currentTab) {
    let index;

    if (currentTab === this.firstTab) {
      this.moveFocusToTab(this.lastTab);
    } else {
      index = this.tabs.indexOf(currentTab);
      this.moveFocusToTab(this.tabs[index - 1]);
    }
  }

  moveFocusToNextTab(currentTab) {
    let index;

    if (currentTab === this.lastTab) {
      this.moveFocusToTab(this.firstTab);
    } else {
      index = this.tabs.indexOf(currentTab);
      this.moveFocusToTab(this.tabs[index + 1]);
    }
  }

  onKeydown(e) {
    let { currentTarget } = e;
    let flag = false;

    if (e.key == " " || e.code == "Space" || e.keyCode == 32) {
      this.setSelectedTab(currentTarget);
      this.moveFocusToTab(currentTarget);
      flag = true;
    }

    switch (e.key) {
      case "ArrowLeft":
        this.moveFocusToPreviousTab(currentTarget);
        flag = true;
        break;

      case "ArrowRight":
        this.moveFocusToNextTab(currentTarget);
        flag = true;
        break;

      case "Enter":
        this.setSelectedTab(currentTarget);
        this.moveFocusToTab(currentTarget);
        flag = true;
        break;

      case "Home":
        this.moveFocusToTab(this.firstTab);
        flag = true;
        break;

      case "End":
        this.moveFocusToTab(this.lastTab);
        flag = true;
        break;

      default:
        break;
    }

    if (flag) {
      e.stopPropagation();
      e.preventDefault();
    }
  }

  onClick(e) {
    this.setSelectedTab(e.currentTarget);
  }
}

window.addEventListener("load", () => {
  const tablists = document.querySelectorAll("[role=tablist]");
  tablists.forEach((tablist) => {
    new Tabs(tablist);
  });
});
