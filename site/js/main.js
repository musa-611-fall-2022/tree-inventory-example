import { initMap, updateUserPositionOn } from './map.js';
import { initTreeInfoForm, showTreeDataInForm } from './tree-info-form.js';
import { initToast, showToast } from './toast.js';
import { downloadInventory, loadNotes, saveNotes } from './inventory.js';

let app = {
  currentTree: null,
  notes: {},
};

const loadOverlayEl = document.getElementById('load-overlay');
const map = initMap();

function onInventoryLoadSuccess(data) {
  map.treeLayer.addData(data);
  loadOverlayEl.classList.add('hidden');
}

function onUserPositionSuccess(pos) {
  updateUserPositionOn(map, pos);
}

function onUserPositionFailure(err) {
  console.log(err);
}

function setupGeolocationEvent() {
  navigator.geolocation.getCurrentPosition(
    onUserPositionSuccess,
    onUserPositionFailure,
  );
}

function onSaveClicked(evt) {
  const note = evt.detail.note;
  const treeId = app.currentTree.properties['OBJECTID'];
  app.notes[treeId] = note;

  saveNotes(app.notes);
  showToast('Saved!', 'toast-success');
}

function onTreeSelected(evt) {
  const tree = evt.detail.tree;
  app.currentTree = tree;

  const treeId = tree.properties['OBJECTID'];
  const notes = app.notes[treeId] || '';
  showTreeDataInForm(tree, notes);
}

function setupInteractionEvents() {
  window.addEventListener('tree-selected', onTreeSelected);
  window.addEventListener('save-clicked', onSaveClicked);
}

initToast();
initTreeInfoForm();
setupGeolocationEvent();
downloadInventory(onInventoryLoadSuccess);

loadNotes(notes => {
  app.notes = notes;
  setupInteractionEvents();
});

window.app = app;