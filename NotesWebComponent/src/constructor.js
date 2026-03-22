async function getData() {
  const url = "https://notes-api.dicoding.dev/v2/notes";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const result = await response.json();

    console.log(result);
    return result.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function postData(notes) {
  try {
    const response = await fetch("https://notes-api.dicoding.dev/v2/notes", {
      method: "POST",
      body: JSON.stringify(notes),
      headers: {
        "Content-Type": "application/json",
      },
    });

    // 1. CEK ERROR DULU DI SINI! (Dan jangan pakai console.error di throw)
    if (!response.ok) {
      throw new Error(`Response Status post: ${response.status}`);
    }

    // 2. BARU BACA JSON-NYA
    const data = await response.json();
    console.log(data.status);
  } catch (error) {
    console.error("Gagal Error: ", error);
  }
}

async function deleteData(id) {
  try {
    const response = await fetch(
      `https://notes-api.dicoding.dev/v2/notes/${id}`,
      {
        method: "DELETE",
      },
    );
    if (!response.ok) throw new Error(`Gagal hapus: ${response.status}`);
    const data = await response.json();
    console.log(`Sukses Hapus: ${data.message}`);
  } catch (error) {
    console.error(`Error delte: ${error}`);
  }
}

// 2. Kurir buat Arsip (POST)
async function archiveData(id) {
  try {
    const response = await fetch(
      `https://notes-api.dicoding.dev/v2/notes/${id}/archive`,
      {
        method: "POST",
      },
    );
    if (!response.ok) throw new Error(`Gagal arsip: ${response.status}`);
    console.log("Sukses Arsip!");
  } catch (error) {
    console.error("Error Archive:", error);
  }
}

// 3. Kurir buat Batal Arsip (POST)
async function unarchiveData(id) {
  try {
    const response = await fetch(
      `https://notes-api.dicoding.dev/v2/notes/${id}/unarchive`,
      {
        method: "POST",
      },
    );
    if (!response.ok) throw new Error(`Gagal batal arsip: ${response.status}`);
    console.log("Sukses Batal Arsip!");
  } catch (error) {
    console.error("Error Unarchive:", error);
  }
}

// Kurir khusus narik data arsip
async function getArchivedData() {
  const url = "https://notes-api.dicoding.dev/v2/notes/archived";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// UPDATE EXPORT JADI GINI:
module.exports = {
  getData,
  postData,
  deleteData,
  archiveData,
  unarchiveData,
  getArchivedData,
};
