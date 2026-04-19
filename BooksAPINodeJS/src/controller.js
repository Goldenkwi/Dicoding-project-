import { nanoid } from "nanoid";
import books from "./books.js";

export const createBooks = (req, res) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.body;
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  let finished = false;
  if (pageCount === readPage) {
    finished = true;
  }

  if (!name) {
    return res.status(400).json({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
  }

  if (readPage > pageCount) {
    return res.status(400).json({
      status: "fail",
      message:
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
  }

  const book = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(book);
  return res.status(201).json({
    status: "success",
    message: "Buku berhasil ditambahkan",
    data: { bookId: id },
  });
};

export const getBooks = (req, res) => {
  const mapped = books.map((books) => ({
    id: books.id,
    name: books.name,
    publisher: books.publisher,
  }));

  return res.status(200).json({
    status: "success",
    data: {
      books: mapped,
    },
  });
};

export const getDetails = (req, res) => {
  const { id } = req.params;
  const data = books.find((data) => data.id === id);

  if (data) {
    return res.status(200).json({
      status: "success",
      data: {
        book: data,
      },
    });
  }

  return res.status(404).json({
    status: "fail",
    message: "Buku tidak ditemukan",
  });
};

export const changeBook = (req, res) => {
  const { id } = req.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.body;
  const index = books.findIndex((data) => data.id === id);

  let finished = false;
  if (pageCount === readPage) {
    finished = true;
  }
  const updatedAt = new Date().toISOString();

  if (!name) {
    return res.status(400).json({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });
  }

  if (pageCount < readPage) {
    return res.status(400).json({
      status: "fail",
      message:
        "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
    });
  }

  if (index == -1) {
    return res.status(404).json({
      status: "fail",
      message: "Gagal memperbarui buku. Id tidak ditemukan",
    });
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      updatedAt,
    };
    return res.status(200).json({
      status: "success",
      message: "Buku berhasil diperbarui",
    });
  }
};

export const deleteBook = (req, res) => {
  const { id } = req.params;
  const index = books.findIndex((books) => books.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    return res.status(200).json({
      status: "success",
      message: "Buku berhasil dihapus",
    });
  }

  return res.status(404).json({
    status: "fail",
    message: "Buku gagal dihapus. Id tidak ditemukan",
  });
};
