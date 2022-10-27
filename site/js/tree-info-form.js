const treeNameEl = document.getElementById('tree-name');
const treeNotesEl = document.getElementById('tree-notes');
const saveTreeNotesEl = document.getElementById('save-tree-notes');

function showTreeDataInForm(tree, notes) {
  const treeName = tree.properties['TREE_NAME'];
  treeNameEl.innerHTML = treeName;
  treeNotesEl.value = notes;
}

function onSaveButtonClicked() {
  const note = treeNotesEl.value;
  const saveClickedEvent = new CustomEvent('save-clicked', { detail: { note } });
  window.dispatchEvent(saveClickedEvent);
}

function initTreeInfoForm() {
  saveTreeNotesEl.addEventListener('click', onSaveButtonClicked);
}

export {
  showTreeDataInForm,
  initTreeInfoForm,
};