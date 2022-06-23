import React, { useContext, useState } from "react";
import noteContext from "../context and States/noteContext";

const AddNote = () => {
  const context = useContext(noteContext);
  const { addNote } = context;

  const [note, setNote] = useState({
    title: "",
    content: "",
  });

  const handleClick = (e) => {
    e.preventDefault();
    addNote(note.title, note.content);
    setNote({ title: "", content: "" });
  };

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };
  return (
    <div className="container my-3">
      <h2>Add a Note</h2>
      <form className="my-3">
        <div className="mb-3">
          <label htmlFor="TitleBox" className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="TitleBox"
            name="title"
            value={note.title}
            aria-describedby="titlebox"
            onChange={onChange}
            minLength={5}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="ContentBox" className="form-label">
            Content
          </label>
          <textarea
            id="ContentBox"
            name="content"
            value={note.content}
            className="form-control"
            aria-label="cotentbox"
            onChange={onChange}
            minLength={5}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary" onClick={handleClick}>
          Add Note
        </button>
      </form>
    </div>
  );
};

export default AddNote;
