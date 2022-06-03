class MenuDropdown {
  constructor(domNode) {
    this.menuDropdown = domNode;
    this.menuButton = this.menuDropdown.querySelector('[role="menuitem"][aria-haspopup="true"]');
    this.menu = this.menuDropdown.querySelector('[role="menu"]');
    this.menuItems = [...this.menu.querySelectorAll('[role="menuitem"]')];

    this.firstMenuItem = null;
    this.lastMenuItem = null;
    this.currentItemIndex = null;
    this.menuItems.forEach((menuItem) => {
      if (!this.firstMenuItem) {
        this.firstMenuItem = menuItem;
      }
      this.lastMenuItem = menuItem;
    });


    this.menuButton.tabIndex = 0;
    this.menuButton.setAttribute('aria-expanded', 'false');

    this.menuDropdown.addEventListener('keydown', this.onKeydown.bind(this));
    this.menu.addEventListener('focusout', this.onFocusOut.bind(this));
    this.menuButton.addEventListener('click', this.onClick.bind(this));
  }

  toggleDropdown() {
    this.menuDropdown.classList.toggle("is-active");
    this.currentItemIndex = -1;

    switch (this.menuButton.getAttribute("aria-expanded")) {
      case "true":
        this.menuButton.setAttribute("aria-expanded", "false");
        break;

      case "false":
        this.menuButton.setAttribute("aria-expanded", "true");
        break;

      default:
        break;
    }
  }

  moveFocusToMenuItem(index = this.currentItemIndex) {
    this.menuItems[index].focus();
  }

  moveFocusToPreviousMenuItem() {
    if (this.currentItemIndex === 0) {
      this.currentItemIndex = this.menuItems.indexOf(this.lastMenuItem) + 1;
    }

    this.currentItemIndex = this.currentItemIndex - 1;
    this.moveFocusToMenuItem();
  }

  moveFocusToNextMenuItem() {
    if (this.currentItemIndex === this.menuItems.indexOf(this.lastMenuItem)) {
      this.currentItemIndex = -1;
    }

    this.currentItemIndex = this.currentItemIndex + 1;
    this.moveFocusToMenuItem();
  }

  onClick() {
    this.toggleDropdown();
  }

  onKeydown(e) {
    let flag = true;

    switch (e.key) {
      case "ArrowUp":
        this.moveFocusToPreviousMenuItem();
        break;

      case "ArrowDown":
        this.moveFocusToNextMenuItem();
        break;

      case "Enter":
        if (e.target === this.menuButton) {
          this.toggleDropdown();
        } else {
          return
        }
        break;

      case "Home":
        this.moveFocusToMenuItem(this.firstMenuItem);
        break;

      case "End":
        this.moveFocusToMenuItem(this.lastMenuItem);
        break;

      default:
        flag = false;
        break;
    }

    if (flag) {
      e.stopPropagation();
      e.preventDefault();
    }
  }

  onFocusOut(e) {
    if (!e.relatedTarget.classList.contains('dropdown-item')) {
      this.toggleDropdown()
    }
  }
}

window.addEventListener('load', () => {
  const menuDropdowns = document.querySelectorAll(".dropdown");
  for (let i = 0; i < menuDropdowns.length; i++) {
    new MenuDropdown(menuDropdowns[i]);
  }
});
