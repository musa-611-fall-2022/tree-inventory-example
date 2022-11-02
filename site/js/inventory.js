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

function downloadInventory(onSuccess, onFailure) {
  fetch('data/tree-inventory.geojson')
  .then(resp => {
    if (resp.status === 200) {
      const data = resp.json();
      return data;
    } else {
      alert('Oh no, I failed to download the data.');
      if (onFailure) { onFailure() }
    }
  })
  .then(onSuccess);
}

async function loadNotes(onSuccess, onFailure) {
  try {
    const notesDoc = doc(firestoreDb, "tree-inventory-notes", "notes");
    const result = await getDoc(notesDoc);
    const notes = result.data().notes;
    localStorage.setItem('notes', JSON.stringify(notes));
    onSuccess(notes);
  } catch {
    if (onFailure) {
      onFailure();
    }
  }
}

async function saveNotes(notes, onSuccess, onFailure) {
  // Save locally.
  localStorage.setItem('notes', JSON.stringify(notes));

  // Save in the cloud.
  try {
    const notesDoc = doc(firestoreDb, "tree-inventory-notes", "notes");
    await setDoc(notesDoc, { notes });
    console.log("Document written with ID: ", notesDoc.id);
    if (onSuccess) {
      onSuccess(notesDoc);
    }
  } catch (e) {
    console.error("Error adding document: ", e);
    if (onFailure) {
      onFailure(e);
    }
  }
}

export {
  downloadInventory,
  loadNotes,
  saveNotes,
};