// Generated by CoffeeScript 1.8.0

/*
 * Copyright 2014, 2015 Simon Lydell
 * X11 (“MIT”) Licensed. (See LICENSE.)
 */
var BranchPoint, createTree;

createTree = function(elements, numBranches, options) {
  var branchPointIndex, branchPoints, childIndex, children, element, elementIndex, latestBranchPointIndex, lowestWeight, nextBranchPoint, nextElement, numBranchPoints, numElements, numPadding, root, weight;
  if (options == null) {
    options = {};
  }
  if (!(numBranches >= 2)) {
    throw new RangeError("`n` must be at least 2");
  }
  numElements = elements.length;
  if (numElements === 0) {
    return new BranchPoint([], 0);
  }
  if (numElements === 1) {
    element = elements[0];
    return new BranchPoint([element], element.weight);
  }
  if (!options.sorted) {
    elements = elements.slice(0).sort(function(a, b) {
      return a.weight - b.weight;
    });
  }
  numBranchPoints = Math.ceil((numElements - 1) / (numBranches - 1));
  numPadding = 1 + (numBranches - 1) * numBranchPoints - numElements;
  branchPoints = Array(numBranchPoints);
  latestBranchPointIndex = 0;
  branchPointIndex = 0;
  elementIndex = 0;
  if (numPadding > 0) {
    elementIndex = numBranches - numPadding;
    weight = 0;
    children = Array(elementIndex);
    childIndex = 0;
    while (childIndex < elementIndex) {
      element = elements[childIndex];
      children[childIndex] = element;
      weight += element.weight;
      childIndex++;
    }
    branchPoints[0] = new BranchPoint(children, weight);
    latestBranchPointIndex = 1;
  }
  nextElement = elements[elementIndex];
  while (latestBranchPointIndex < numBranchPoints) {
    weight = 0;
    children = Array(numBranches);
    childIndex = 0;
    nextBranchPoint = branchPoints[branchPointIndex];
    while (childIndex < numBranches) {
      if ((nextElement == null) || ((nextBranchPoint != null) && nextBranchPoint.weight <= nextElement.weight)) {
        lowestWeight = nextBranchPoint;
        branchPointIndex++;
        nextBranchPoint = branchPoints[branchPointIndex];
      } else {
        lowestWeight = nextElement;
        elementIndex++;
        nextElement = elements[elementIndex];
      }
      children[childIndex] = lowestWeight;
      weight += lowestWeight.weight;
      childIndex++;
    }
    branchPoints[latestBranchPointIndex] = new BranchPoint(children, weight);
    latestBranchPointIndex++;
  }
  root = branchPoints[numBranchPoints - 1];
  return root;
};

BranchPoint = (function() {
  function BranchPoint(children, weight) {
    this.children = children;
    this.weight = weight;
  }

  BranchPoint.prototype.assignCodeWords = function(alphabet, callback, prefix) {
    var codeWord, index, node, _i, _ref;
    if (prefix == null) {
      prefix = "";
    }
    index = 0;
    _ref = this.children;
    for (_i = _ref.length - 1; _i >= 0; _i += -1) {
      node = _ref[_i];
      codeWord = prefix + alphabet[index++];
      if (node instanceof BranchPoint) {
        node.assignCodeWords(alphabet, callback, codeWord);
      } else {
        callback(node, codeWord);
      }
    }
  };

  return BranchPoint;

})();

module.exports = {
  createTree: createTree,
  BranchPoint: BranchPoint
};
