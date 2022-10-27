import  { initMap, updateUserPositionOn } from './map.js';
import { initTreeInfoForm, showTreeDataInForm } from './tree-info-form.js';
import { initToast, showToast } from './toast.js';

let app = {
  currentTree: null,
  notes: JSON.parse(localStorage.getItem('notes') || '{}'),
};

const loadOverlayEl = document.getElementById('load-overlay');
const map = initMap();

function downloadInventory() {
  fetch('data/tree-inventory.geojson')
  .then(resp => resp.json())
  .then(data => {
    map.treeLayer.addData(data);
    loadOverlayEl.classList.add('hidden');
  });
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

  localStorage.setItem('notes', JSON.stringify(app.notes));
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
setupInteractionEvents();
downloadInventory();

window.app = app;