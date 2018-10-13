function EdgeNode(id) {
  this.id = id;
  this.afters = [];
  this.indegree = 0;
}

function topsort(edges) {
  var nodes = {};
  var result = [];
  var queue = [];

  // build data structres
  edges.forEach(function(edge) {
    var fromEdge = edge[0];
    var fromStr = fromEdge.toString();
    var fromNode;

    if (!(fromNode = nodes[fromStr])) {
      fromNode = nodes[fromStr] = new EdgeNode(fromEdge);
    }

    edge.forEach(function(toEdge) {
      // since from and to are in same array, we'll always see from again, so make sure we skip it..
      if (toEdge == fromEdge) {
        return;
      }

      var toEdgeStr = toEdge.toString();

      if (!nodes[toEdgeStr]) {
        nodes[toEdgeStr] = new EdgeNode(toEdge);
      }
      nodes[toEdgeStr].indegree++;
      fromNode.afters.push(toEdge);
    });
  });

  // topsort
  var keys = Object.keys(nodes);
  keys.forEach(function(key) {
    if (nodes[key].indegree === 0) {
      queue.push(key);
    }
  });
  while (queue.length !== 0) {
    let vertex = queue.shift();
    result.push(nodes[vertex].id);

    nodes[vertex].afters.forEach(function(after) {
      var afterStr = after.toString();

      nodes[afterStr].indegree--;
      if (nodes[afterStr].indegree === 0) {
        queue.push(afterStr);
      }
    });
  }

  return result;
}

// var edges = [["one", "two", "three"], ["three", "four"]];
// var sorted = topsort(edges);

module.exports = topsort;
