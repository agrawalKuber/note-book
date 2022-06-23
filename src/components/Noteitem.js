import React, { useContext } from "react";
import noteContext from "../context and States/noteContext";

const sty = {
  cursor: "pointer",
};

const col = ["#FF06B7", "#FFE400", "#9ADCFF", "#A3DDCB", "#FFB562"];
const idx = Math.floor(Math.random() * 5);
const cardsty = {
  backgroundColor: col[idx],
};

const Noteitem = (props) => {
  const { note, updateNote } = props;
  const context = useContext(noteContext);
  const { deleteNote } = context;
  return (
    <div className="col-md-3 ">
      <div className="card my-3">
        <div className="card-body" style={cardsty}>
          <div className="d-flex justify-content-between">
            <h5 className="card-title">{note.title}</h5>
          </div>
          <p className="card-text">{note.content}</p>
          <div className="d-flex justify-content-between">
            <i
              style={sty}
              className="fa-solid fa-pen-to-square "
              onClick={() => {
                updateNote(note);
              }}
            ></i>
            <i
              style={sty}
              className="fa-solid fa-trash-can"
              onClick={() => {
                deleteNote(note._id);
              }}
            ></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Noteitem;
