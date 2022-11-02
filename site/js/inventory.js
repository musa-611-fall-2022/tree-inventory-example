function downloadInventory(onSuccess) {
  fetch('data/tree-inventory.geojson')
  .then(resp => resp.json())
  .then(onSuccess);
}

function loadNotes() {
  return JSON.parse(localStorage.getItem('notes') || '{}');
}

function saveNotes(notes) {
  localStorage.setItem('notes', JSON.stringify(notes));
}

export {
  downloadInventory,
  loadNotes,
  saveNotes,
};