require("./style.css");
const {
  getData,
  postData,
  deleteData,
  archiveData,
  unarchiveData,
  getArchivedData,
} = require("./constructor.js");
// Navbar

class AppBar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <style>
            .notesNav {
                margin: 20px auto 40px auto;
                text-align: center;
                background-color: #2d3e50;
                color: beige;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                max-width: 1200px;
            }
        </style>
        <div class="notesNav">
            <h1>Notes App Dicoding</h1>
        </div>
        `;
  }
}
customElements.define("app-bar", AppBar);

// Komponen Loading Indicator

class LoadingIndicator extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <div style="display: flex; 
                justify-content: center;
                align-items: center;
                padding: 40px;">
            <h2 style="color: beige; font-style: italic;">Loading server...</h2>
        </div>
        `;
  }
}
customElements.define("loading-indicator", LoadingIndicator);

//Notes list

class NoteItem extends HTMLElement {
  connectedCallback() {
    const id = this.getAttribute("note-id");
    const title = this.getAttribute("note-title") || "Tanpa Judul";
    const body = this.getAttribute("note-body") || "Tanpa Isi";
    const date = this.getAttribute("note-date") || "-";

    const isArchived = this.getAttribute("note-archived") === "true";

    const formattedDate = new Date(date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    this.innerHTML = `
        <article tabindex="0" class="notes-item">
            <p class="data-notes-date">${formattedDate}</p>
            <h3 class="data-notes-title">${title}</h3>
            <p class="data-notes-body" style="flex-grow: 1;">${body}</p>
            <div class="button-notes">
                
                <button class="btn-archive" data-id="${id}" data-archived="${isArchived}">
                    ${isArchived ? "Kembalikan" : "Arsipkan"}
                </button>
                
                ${!isArchived ? `<button class="btn-delete" data-id="${id}"> Hapus </button>` : ""}
            </div>
        </article>
        `;
  }
}
customElements.define("note-item", NoteItem);

// Form submit
class NoteForm extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <form id="form-tambah-catatan">
            <h3 style="margin-bottom: 15px;">Tambah Catatan Baru</h3>
            <div class="input-group">
                <label for="title">Judul:</label>
                <input type="text" id="title" required>
                <span id="title-error" class="error-msg"></span>
            </div>
            <div class="input-group">
                <label for="body">Isi Catatan:</label>
                <textarea id="body" rows="4" required></textarea>
            </div>
            <button type="submit">Simpan Catatan</button>
        </form>
        `;
  }
}
customElements.define("note-form", NoteForm);

// render web

const notesListEl = document.querySelector("#notes-list");

let isArchiveView = false;

function render(notes) {
  notesListEl.innerHTML = "";

  if (notes.length === 0) {
    notesListEl.innerHTML =
      '<p style="text-align: center; color: #ccc; margin-top: 20px;">Tidak ada catatan di database.</p>';
    return;
  }

  notes.forEach((note) => {
    notesListEl.innerHTML += `
            <note-item 
                note-id="${note.id}"  
                note-title="${note.title}" 
                note-body="${note.body}" 
                note-date="${note.createdAt}"
                note-archived="${note.archived}">
            </note-item>
        `;
  });
}

async function tampilkanCatatan() {
  notesListEl.innerHTML = "<loading-indicator></loading-indicator>";
  const dataAPI = isArchiveView ? await getArchivedData() : await getData();
  render(dataAPI);
}

tampilkanCatatan();

// inisialisasi submit
const btnTambah = document.querySelector(".tambah-notes");
const formContainer = document.querySelector("#form-container");
const btnArsipToggle = document.querySelector("#btn-arsip-toggle");

btnTambah.addEventListener("click", () => {
  if (formContainer.style.display === "block") {
    formContainer.style.display = "none";
    btnTambah.innerText = "Tambah Catatan";
  } else {
    formContainer.style.display = "block";
    btnTambah.innerText = "Batal Tambah";
  }
});

// Logika pas tombol Lihat Arsip diklik
btnArsipToggle.addEventListener("click", async () => {
  isArchiveView = !isArchiveView;

  btnArsipToggle.innerText = isArchiveView
    ? "Kembali ke Catatan Aktif"
    : "Lihat Arsip";

  await tampilkanCatatan();
});

// Fitur Submit Form

document.addEventListener("submit", async (event) => {
  if (event.target && event.target.id === "form-tambah-catatan") {
    event.preventDefault();

    const titleInput = event.target.querySelector("#title").value;
    const bodyInput = event.target.querySelector("#body").value;

    const noteBaru = {
      title: titleInput,
      body: bodyInput,
    };

    await postData(noteBaru);

    event.target.reset(); // Reset formnya

    // Sembunyiin lagi komponennya
    formContainer.style.display = "none";
    btnTambah.innerText = "Tambah Catatan";

    await tampilkanCatatan();
  }
});

// realtime checking error

const titleInput = document.querySelector("#title");
const titleError = document.querySelector("#title-error");

titleInput.addEventListener("input", () => {
  if (titleInput.value.length === 0) {
    titleError.textContent = "Judul gak boleh kosong!";
    titleError.style.display = "block";
  } else if (titleInput.value.length < 3) {
    titleError.textContent = "judul lebih dari 3 karakter!";
    titleError.style.display = "block";
  } else {
    titleError.style.display = "none";
  }
});

// Fitur Klik Tombol Hapus & Arsip
notesListEl.addEventListener("click", async (event) => {
  const target = event.target;
  const noteId = target.getAttribute("data-id");

  if (target.classList.contains("btn-delete")) {
    const yakin = confirm("Yakin mau hapus catatan ini bro?");
    if (yakin) {
      await deleteData(noteId);
      await tampilkanCatatan();
    }
  }

  if (target.classList.contains("btn-archive")) {
    const isArchived = target.getAttribute("data-archived") === "true";
    // Kalau udah diarsip, panggil unarchive. Kalau belum, panggil archive.
    if (isArchived) {
      await unarchiveData(noteId);
    } else {
      await archiveData(noteId);
    }
    await tampilkanCatatan();
  }
});
