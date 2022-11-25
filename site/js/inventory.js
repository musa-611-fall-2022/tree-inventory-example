import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js';
import { getFirestore, doc, setDoc, getDoc } from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js';

// Config object gotten aaccording to https://support.google.com/firebase/answer/7015592
const firebaseConfig = {
  apiKey: "AIzaSyBogSi6Saxt3ebZqIV5XPsuwmHiAoJpFUM",
  authDomain: "musa-344004.firebaseapp.com",
  projectId: "musa-344004",
  storageBucket: "musa-344004.appspot.com",
  messagingSenderId: "483377634328",
  appId: "1:483377634328:web:ff3fe8c8ee9a3240bfb76d",
  measurementId: "G-ERMCD4JF79",
};
const firebaseApp = initializeApp(firebaseConfig);
const firestoreDb = getFirestore(firebaseApp);

async function downloadInventory(onSuccess, onFailure) {
  const resp = await fetch('data/tree-inventory.geojson');
  if (resp.status === 200) {
    const data = await resp.json();
    if (onSuccess) { onSuccess(data) }
  } else {
    alert('Oh no, I failed to download the data.');
    if (onFailure) { onFailure() }
  }
}

async function loadNotes(onSuccess, onFailure) {
  try {
    // const notes = JSON.parse(localStorage.getItem('notes'));
    const notesDoc = doc(firestoreDb, "tree-inventory-notes", "notes");
    const result = await getDoc(notesDoc);
    const docData = result.data() || {};
    const notes = docData.content || {};
    onSuccess(notes);
  } catch {
    if (onFailure) {
      onFailure();
    }
  }
}

async function saveNote(treeId, note, app, onSuccess, onFailure) {
  // Save in memory
  app.notes[treeId] = note;
  /*
    For example, app.notes might look something like this...

    app.notes = {
      "1": "this is the note for tree 1",
      "56": "this is the note for tree 56",
      "8235": "this is the note for tree 8235"
    }
  */

  // Save locally.
  // localStorage.setItem('notes', JSON.stringify(app.notes));

  // Save in the cloud.
  try {
    const notesDoc = doc(firestoreDb, "tree-inventory-notes", "notes");
    await setDoc(notesDoc, { content: app.notes });
    if (onSuccess) {
      onSuccess(notesDoc);
    }
  } catch (e) {
    alert(`Shoot, I failed to save the notes in firestore. ${e}`);
    if (onFailure) {
      onFailure(e);
    }
  }
}

export {
  downloadInventory,
  loadNotes,
  saveNote,
};