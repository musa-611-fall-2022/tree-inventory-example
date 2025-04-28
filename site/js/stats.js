function countBy(arr, keyfunc) {
  return arr.reduce((cnts, item) {
    const key = keyfunc(item);
    cnts[key] = (cnts[key] || 0) + 1;
  }, {});
}

// The argument `data` is a featureCollection of trees as loaded from the
// inventory.
function updateTreeCounts(data) {
  // Using the `countBy` function above, this will result in an object that
  // looks something like:
  // ```
  // {
  //   "FIR": 7,
  //   "WILLOW": 12,
  //   "OAK": 3,
  //   ...
  // }
  const counts = countBy(
    data.features,
    tree => tree.properties['TREE_NAME'],
  );
  const countsSeries = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  d3.selectAll('rect')
    .data()
}