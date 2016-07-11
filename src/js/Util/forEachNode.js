// would be expanded to something like 'nodeOps.js'
// that could include other common node functions


// run a callback on each node in a list
function forEachNode(nodeList, cb) {
  for (let i = 0; i < nodeList.length; i++) {
    cb(nodeList[i]);
  }

}

export { forEachNode };