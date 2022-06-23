import React from "react";
import NoteContext from "./noteContext";
import { useState } from "react";
const axios = require("axios");

const Host = "http://localhost:8080/OneNote/notes";

const NoteState = (props) => {
  const notesInitial = [];
  const [notes, setNotes] = useState(notesInitial);

  const getNotes = async () => {
    try {
      const options = {
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      };
      const response = await axios.get(`${Host}/fetchallnotes`, options);
      setNotes(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Add a Note
  const addNote = async (title, content) => {
    try {
      const body = {
        title,
        content,
      };
      const options = {
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      };
      const response = await axios.post(`${Host}/addnote`, body, options);
      setNotes((prevNotes) => [...prevNotes, response]);
      getNotes();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete a Note
  const deleteNote = async (id) => {
    try {
      const options = {
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      };
      await axios.delete(`${Host}/deletenote/${id}`, options);
    } catch (err) {
      console.error(err);
    }

    const newNotes = notes.filter((note) => {
      return note._id !== id;
    });
    setNotes(newNotes);
    getNotes();
  };
  // Edit a Note
  const editNote = async (id, title, content) => {
    try {
      const body = {
        title,
        content,
      };
      const options = {
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      };
      await axios.put(`${Host}/updatenote/${id}`, body, options);
      let newNotes = await JSON.parse(JSON.stringify(notes));

      for (let index = 0; index < newNotes.length; index++) {
        const element = newNotes[index];
        if (element._id === id) {
          newNotes[index].title = title;
          newNotes[index].content = content;
          break;
        }
      }
      setNotes(newNotes);
      getNotes();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <NoteContext.Provider
      value={{ notes, addNote, deleteNote, editNote, getNotes }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
