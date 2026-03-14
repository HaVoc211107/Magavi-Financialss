// Dashboard logic for listing and creating books.

(function () {
  window.MagaviAuth.requireLogin();

  const STORAGE_KEY = "magaviData";

  const defaultData = {
    books: {
      Household: {
        categories: {
          Vegetables: [],
          Groceries: [],
          Rent: [],
          Clothing: [],
          Misc: []
        }
      },
      "My Shop": {
        categories: {
          Sales: [],
          Salary: [],
          Inventory: [],
          Loans: []
        }
      },
      Farm: {
        categories: {
          Sales: [],
          Salary: [],
          Inventory: [],
          Loans: []
        }
      }
    }
  };

  function loadData() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(raw);
  }

  function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  const bookList = document.getElementById("bookList");
  const newBookForm = document.getElementById("newBookForm");
  const newBookName = document.getElementById("newBookName");

  function renderBooks() {
    const data = loadData();
    const books = Object.keys(data.books);

    bookList.innerHTML = "";

    books.forEach((book) => {
      const card = document.createElement("div");
      card.className = "card";

      const categoryCount = Object.keys(data.books[book].categories || {}).length;

      card.innerHTML = `
        <strong>${book}</strong>
        <span class="muted tiny">${categoryCount} categories</span>
        <button class="primary">Open</button>
      `;

      card.querySelector("button").addEventListener("click", function () {
        const encoded = encodeURIComponent(book);
        window.location.href = `book.html?book=${encoded}`;
      });

      bookList.appendChild(card);
    });
  }

  newBookForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = newBookName.value.trim();
    if (!name) {
      return;
    }

    const data = loadData();
    if (data.books[name]) {
      alert("A book with that name already exists.");
      return;
    }

    data.books[name] = { categories: {} };
    saveData(data);
    newBookName.value = "";
    renderBooks();
  });

  renderBooks();
})();
