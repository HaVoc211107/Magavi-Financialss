// Book page logic for categories and entries.

(function () {
  window.MagaviAuth.requireLogin();

  const STORAGE_KEY = "magaviData";

  const fallbackData = {
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fallbackData));
      return fallbackData;
    }
    return JSON.parse(raw);
  }

  function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  const params = new URLSearchParams(window.location.search);
  const bookName = params.get("book");

  const bookTitle = document.getElementById("bookTitle");
  const categoryList = document.getElementById("categoryList");
  const categorySelect = document.getElementById("entryCategory");
  const entryList = document.getElementById("entryList");
  const emptyEntries = document.getElementById("emptyEntries");
  const newCategoryForm = document.getElementById("newCategoryForm");
  const newCategoryName = document.getElementById("newCategoryName");
  const entryForm = document.getElementById("entryForm");
  const entryDate = document.getElementById("entryDate");
  const entryDesc = document.getElementById("entryDesc");
  const entryAmount = document.getElementById("entryAmount");
  const entryType = document.getElementById("entryType");

  function getBookData(data) {
    if (!bookName || !data.books[bookName]) {
      window.location.href = "dashboard.html";
      return null;
    }
    return data.books[bookName];
  }

  function renderCategories(data) {
    const book = getBookData(data);
    if (!book) return;

    const categories = Object.keys(book.categories);
    categoryList.innerHTML = "";
    categorySelect.innerHTML = "";

    if (categories.length === 0) {
      const emptyChip = document.createElement("span");
      emptyChip.className = "chip";
      emptyChip.textContent = "No categories yet";
      categoryList.appendChild(emptyChip);

      const opt = document.createElement("option");
      opt.textContent = "Add a category first";
      opt.disabled = true;
      opt.selected = true;
      categorySelect.appendChild(opt);

      entryForm.querySelector("button").disabled = true;
      return;
    }

    entryForm.querySelector("button").disabled = false;

    categories.forEach((cat) => {
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.textContent = cat;
      chip.addEventListener("click", function () {
        categorySelect.value = cat;
      });
      categoryList.appendChild(chip);

      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      categorySelect.appendChild(option);
    });
  }

  function formatAmount(amount, type) {
    const sign = type === "expense" ? "-" : "+";
    return `${sign} ${Number(amount).toFixed(2)}`;
  }

  function renderEntries(data) {
    const book = getBookData(data);
    if (!book) return;

    const rows = [];
    Object.keys(book.categories).forEach((cat) => {
      const entries = book.categories[cat];
      entries.forEach((entry) => {
        rows.push({ ...entry, category: cat });
      });
    });

    rows.sort((a, b) => new Date(b.date) - new Date(a.date));

    entryList.innerHTML = "";
    if (rows.length === 0) {
      emptyEntries.style.display = "block";
      return;
    }
    emptyEntries.style.display = "none";

    rows.forEach((row) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${row.date}</td>
        <td>${row.description}</td>
        <td>${row.category}</td>
        <td>${row.type}</td>
        <td>${formatAmount(row.amount, row.type)}</td>
      `;
      entryList.appendChild(tr);
    });
  }

  newCategoryForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = newCategoryName.value.trim();
    if (!name) return;

    const data = loadData();
    const book = getBookData(data);
    if (!book) return;

    if (book.categories[name]) {
      alert("Category already exists.");
      return;
    }

    book.categories[name] = [];
    saveData(data);
    newCategoryName.value = "";
    renderCategories(data);
    renderEntries(data);
  });

  entryForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const data = loadData();
    const book = getBookData(data);
    if (!book) return;

    const category = categorySelect.value;
    if (!book.categories[category]) {
      alert("Please select a valid category.");
      return;
    }

    const entry = {
      date: entryDate.value,
      description: entryDesc.value.trim(),
      amount: Number(entryAmount.value),
      type: entryType.value
    };

    book.categories[category].push(entry);
    saveData(data);
    entryForm.reset();
    entryDate.value = new Date().toISOString().split("T")[0];
    renderEntries(data);
  });

  function init() {
    const data = loadData();
    const book = getBookData(data);
    if (!book) return;

    bookTitle.textContent = bookName;
    entryDate.value = new Date().toISOString().split("T")[0];

    renderCategories(data);
    renderEntries(data);
  }

  init();
})();
