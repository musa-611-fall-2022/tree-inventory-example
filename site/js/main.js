// Tree Inventory Surveying App
// ============================

// The _main.js_ module defines the primary functionality of the app, and serves
// as the cross-component coordinator. Additional functionality is found in
// individual component modules:
// * [map.js](map.html) for behavior related to the map
// * [tree-info-form.js](tree-info-form.html) for form behavior
// * [toast.js](toast.html) for the messages that get shown temporarily
// * [inventory.js](inventory.html) for functions governing the loading/saving
//   of tree inventory and notes

import { initMap, updateUserPositionOn } from './map.js';
import { getFormContent, showTreeDataInForm } from './tree-info-form.js';
import { initToast, showToast } from './toast.js';
import { downloadInventory, loadNotes, saveNote } from './inventory.js';

// The state of the app is stored in a global `app` variable. The things that we
// keep track of in this app state are:
// 1.  The ID of the current tree that is selected, and
// 2.  An object that maps tree IDs to notes about that tree.
//
// We initialize the components of the state to `null` to signify that we
// haven't set them to anything yet.

let app = {
  currentTree: null,
  notes: null,
};

const loadOverlayEl = document.getElementById('load-overlay');
const saveTreeNotesEl = document.getElementById('save-tree-notes');
const map = initMap();

// Define event handlers
// ---------------------

// `onInventoryLoadSuccess` will be called if and when `downloadInventory`
// function completes the download of the tree inventory file successfully.
function onInventoryLoadSuccess(data) {
  map.treeLayer.addData(data);
  loadOverlayEl.classList.add('hidden');
}

// `onNoteSaveSuccess` will be called if and when the notes have been saved
// to the cloud successfully.
function onNotesSaveSuccess() {
  showToast('Saved!', 'toast-success');
}

// `onSaveClicked` will be called if and when the save button on the tree info
// form is clicked.
function onSaveClicked() {
  const content = getFormContent();
  const treeId = app.currentTree.properties['OBJECTID'];

  saveNote(treeId, content, app, onNotesSaveSuccess);
}

// `onTreeSelected` will be called if and when the user clicks on a tree on the
// map.
function onTreeSelected(evt) {
  const tree = evt.layer.feature;
  app.currentTree = tree;
  showTreeDataInForm(tree, app);
}

// **Geolocation** -- `onUserPositionSuccess` will be called by the geolocation
// API if and when the user's position is successfully found.
function onUserPositionSuccess(pos) {
  updateUserPositionOn(map, pos);
  downloadInventory(
    pos.coords.longitude,
    pos.coords.latitude,
    onInventoryLoadSuccess,
  );
}

// **Geolocation** -- `onUserPositionSuccess` will be called by the geolocation
// API if and when there is an error in finding the user's position.
function onUserPositionFailure(err) {
  alert(`Oh man, we just failed to find the user's position: ${err}`);
}

// Define global interface setup
// -----------------------------
// Most setup function belong in one component or another. However, there is
// always some setup that doesn't belong to any specific component of your
// application. Here we set up events that have cross-component implications,
// for which we have defined handlers above.

function setupGeolocationEvent() {
  navigator.geolocation.getCurrentPosition(
    onUserPositionSuccess,
    onUserPositionFailure,
  );
}

function setupInteractionEvents() {
  map.treeLayer.addEventListener('click', onTreeSelected);
  saveTreeNotesEl.addEventListener('click', onSaveClicked);
}

// Initialize the app components and events
// ----------------------------------------
//
// Set up the various components of the application, and any events that should
// be initialized. Note that setting up the interaction events is postponed
// until the notes are loaded from the remote data store, because we don't want
// our user to be able to load/save any data before we actually have the
// existing data loaded.

setupInteractionEvents();
setupGeolocationEvent();

loadNotes(notes => {
  app.notes = notes;
});
initToast();

window.app = app;