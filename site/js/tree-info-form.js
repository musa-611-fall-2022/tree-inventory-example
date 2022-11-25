const treeNameEl = document.getElementById('tree-name');
const treeNotesEl = document.getElementById('tree-notes');

function showTreeDataInForm(tree, app) {
  const treeName = tree.properties['TREE_NAME'];
  const treeId = tree.properties['OBJECTID'];
  const note = app.notes[treeId] || '';
  treeNameEl.innerHTML = treeName;
  treeNotesEl.value = note;
}

function getFormContent() {
  const note = treeNotesEl.value;
  return note;
}

export {
  showTreeDataInForm,
  getFormContent,
};