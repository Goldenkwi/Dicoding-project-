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
customElements.define('app-bar', AppBar);


//Notes list 

class NoteItem extends HTMLElement {
    connectedCallback() {
        const title = this.getAttribute('note-title') || 'Tanpa Judul';
        const body = this.getAttribute('note-body') || 'Tanpa Isi';
        const date = this.getAttribute('note-date') || '-';

        const formattedDate = new Date(date).toLocaleDateString('id-ID', {
            year: 'numeric', month: 'long', day: 'numeric'
        });

        this.innerHTML = `
        <article tabindex="0" class="notes-item">
            <p class="data-notes-date">${formattedDate}</p>
            <h3 class="data-notes-title">${title}</h3>
            <p class="data-notes-body">${body}</p>
        </article>
        `;
    }
}
customElements.define('note-item', NoteItem);

// Form submit

class NoteForm extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <form id="form-tambah-catatan" class="form-sembunyi">
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
customElements.define('note-form', NoteForm);

// render web

const notesListEl = document.querySelector('#notes-list');

function render() {
    notesListEl.innerHTML = '';
    notesData.forEach((note) => {
        notesListEl.innerHTML += `
            <note-item 
                note-title="${note.title}" 
                note-body="${note.body}" 
                note-date="${note.createdAt}">
            </note-item>
        `;
    });
}

render();

const btnTambah = document.querySelector('.tambah-notes');
const formCatatan = document.querySelector('#form-tambah-catatan');

btnTambah.addEventListener('click', () => {
    formCatatan.classList.toggle('form-muncul');
    if (formCatatan.classList.contains('form-muncul')) {
        btnTambah.innerText = 'Batal Tambah';
    } else {
        btnTambah.innerText = 'Tambah Catatan';
    }
});

// Fitur Submit Form
formCatatan.addEventListener('submit', function(event) {
    event.preventDefault();

    const titleInput = document.querySelector('#title').value;
    const bodyInput = document.querySelector('#body').value;

    const noteBaru = {
        id: `notes-${Math.random().toString(36).substr(2, 9)}`,
        title: titleInput,
        body: bodyInput,
        createdAt: new Date().toISOString(),
        archived: false,
    };

    notesData.unshift(noteBaru);
    render();
    formCatatan.reset();
    
    formCatatan.classList.remove('form-muncul');
    btnTambah.innerText = 'Tambah Catatan';
});

// realtime checking error

const titleInput =  document.querySelector('#title');
const titleError = document.querySelector('#title-error');

titleInput.addEventListener('input', () => {
    if(titleInput.value.length === 0) {
        titleError.textContent = 'Judul gak boleh kosong!';
        titleError.style.display = 'block'
    } else if (titleInput.value.length < 3) {
        titleError.textContent = 'judul lebih dari 3 karakter!';
        titleError.style.display = 'block'
    } else {
        titleError.style.display = 'none';
    }
})