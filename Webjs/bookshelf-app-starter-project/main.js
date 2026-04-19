const form = document.getElementById("bookForm");
const isComplete = document.getElementById("bookFormIsComplete");

const simpanBooksDibaca = JSON.parse(localStorage.getItem("booksDibaca"));
const simpanBooksTidak = JSON.parse(localStorage.getItem("booksTidak"));

let booksDibaca = Array.isArray(simpanBooksDibaca) ? simpanBooksDibaca : [];
let booksTidak = Array.isArray(simpanBooksTidak) ? simpanBooksTidak : [];

// bedain button

isComplete.addEventListener("change", () => {
  const textTabel = document.getElementById("bookFormSubmit");
  const checktext = textTabel.querySelector("span");

  if (isComplete.checked) {
    checktext.textContent = "Selesai dibaca";
  } else {
    checktext.textContent = "Belum selesai dibaca";
  }
});

// tambah buku

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = Number(document.getElementById("bookFormYear").value);
  const bookIsComplete = document.getElementById("bookFormIsComplete").checked;

  const id = (parseInt(localStorage.getItem("id")) || 0) + 1;
  localStorage.setItem("id", id);

  const book = { id, title, author, year, isComplete: bookIsComplete };

  if (bookIsComplete) {
    booksDibaca.push(book);
    localStorage.setItem("booksDibaca", JSON.stringify(booksDibaca));
  } else {
    booksTidak.push(book);
    localStorage.setItem("booksTidak", JSON.stringify(booksTidak));
  }

  form.reset();

  const textTabel = document.getElementById("bookFormSubmit");
  const checktext = textTabel.querySelector("span");
  checktext.textContent = "Belum selesai dibaca";

  renderBook();
});

function renderBook() {
  const trueList = document.getElementById("completeBookList");
  const falseList = document.getElementById("incompleteBookList");

  trueList.innerHTML = "";
  falseList.innerHTML = "";

  booksDibaca.forEach((book) => {
    const bookElement = createBookElement(book, true);
    trueList.append(bookElement);
  });

  booksTidak.forEach((book) => {
    const bookElement = createBookElement(book, false);
    falseList.append(bookElement);
  });
}

function createBookElement(book, iscomplete) {
  const wrapper = document.createElement("div");

  wrapper.setAttribute("data-bookid", book.id);
  wrapper.setAttribute("data-testid", "bookItem");

  const title = document.createElement("h3");
  title.setAttribute("data-testid", "bookItemTitle");
  title.textContent = book.title;

  const author = document.createElement("p");
  author.setAttribute("data-testid", "bookItemAuthor");
  author.textContent = `Penulis: ${book.author}`;

  const year = document.createElement("p");
  year.setAttribute("data-testid", "bookItemYear");
  year.textContent = `Tahun: ${book.year}`;

  const buttonContain = document.createElement("div");

  const buttonIsComplete = document.createElement("button");
  buttonIsComplete.setAttribute("data-testid", "bookItemIsCompleteButton");
  buttonIsComplete.textContent = book.isComplete
    ? "Belum selesai dibaca"
    : "Selesai dibaca";

  const buttonDelete = document.createElement("button");
  buttonDelete.setAttribute("data-testid", "bookItemDeleteButton");
  buttonDelete.textContent = "Hapus Buku";

  const buttonEdit = document.createElement("button");
  buttonEdit.setAttribute("data-testid", "bookItemEditButton");
  buttonEdit.textContent = "Edit Buku";

  buttonIsComplete.addEventListener("click", () => {
    moveBook(book.id, iscomplete);
  });

  buttonDelete.addEventListener("click", () => {
    deleteBook(book.id, iscomplete);
  });

  buttonContain.append(buttonIsComplete, buttonDelete, buttonEdit);
  wrapper.append(title, author, year, buttonContain);

  return wrapper;
}

// hapus buku

function deleteBook(id, iscomplete) {
  if (iscomplete) {
    booksDibaca = booksDibaca.filter((book) => book.id !== id);
    localStorage.setItem("booksDibaca", JSON.stringify(booksDibaca));
  } else {
    booksTidak = booksTidak.filter((book) => book.id !== id);
    localStorage.setItem("booksTidak", JSON.stringify(booksTidak));
  }

  renderBook();
}

// ganti rak

function moveBook(id, iscomplete) {
  if (iscomplete) {
    const index = booksDibaca.findIndex((book) => book.id === id);

    if (index !== -1) {
      const pindahBook = booksDibaca.splice(index, 1)[0];
      pindahBook.isComplete = false;
      booksTidak.push(pindahBook);
    }
  } else {
    const index = booksTidak.findIndex((book) => book.id === id);

    if (index !== -1) {
      const pindahBook = booksTidak.splice(index, 1)[0];
      pindahBook.isComplete = true;
      booksDibaca.push(pindahBook);
    }
  }

  localStorage.setItem("booksDibaca", JSON.stringify(booksDibaca));
  localStorage.setItem("booksTidak", JSON.stringify(booksTidak));

  renderBook();
}

renderBook();