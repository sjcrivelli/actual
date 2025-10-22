"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Graph = Graph;
// @ts-strict-ignore
function Graph() {
    var graph = {
        addNode: addNode,
        removeNode: removeNode,
        adjacent: adjacent,
        adjacentIncoming: adjacentIncoming,
        addEdge: addEdge,
        removeEdge: removeEdge,
        removeIncomingEdges: removeIncomingEdges,
        topologicalSort: topologicalSort,
        generateDOT: generateDOT,
        getEdges: getEdges,
    };
    var edges = new Map();
    var incomingEdges = new Map();
    function getEdges() {
        return { edges: edges, incomingEdges: incomingEdges };
    }
    function addNode(node) {
        edges.set(node, adjacent(node));
        incomingEdges.set(node, adjacentIncoming(node));
        return graph;
    }
    function removeIncomingEdges(node) {
        var incoming = adjacentIncoming(node);
        incomingEdges.set(node, new Set());
        var iter = incoming.values();
        var cur = iter.next();
        while (!cur.done) {
            removeEdge(cur.value, node);
            cur = iter.next();
        }
    }
    function removeNode(node) {
        removeIncomingEdges(node);
        edges.delete(node);
        incomingEdges.delete(node);
        return graph;
    }
    function adjacent(node) {
        return edges.get(node) || new Set();
    }
    function adjacentIncoming(node) {
        return incomingEdges.get(node) || new Set();
    }
    // Adds an edge from node u to node v.
    // Implicitly adds the nodes if they were not already added.
    function addEdge(node1, node2) {
        addNode(node1);
        addNode(node2);
        adjacent(node1).add(node2);
        adjacentIncoming(node2).add(node1);
        return graph;
    }
    // Removes the edge from node u to node v.
    // Does not remove the nodes.
    // Does nothing if the edge does not exist.
    function removeEdge(node1, node2) {
        if (edges.has(node1)) {
            adjacent(node1).delete(node2);
        }
        if (incomingEdges.has(node2)) {
            adjacentIncoming(node2).delete(node1);
        }
        return graph;
    }
    function topologicalSort(sourceNodes) {
        var visited = new Set();
        var sorted = [];
        sourceNodes.forEach(function (name) {
            if (!visited.has(name)) {
                topologicalSortIterable(name, visited, sorted);
            }
        });
        return sorted;
    }
    function topologicalSortIterable(name, visited, sorted) {
        var stackTrace = [];
        stackTrace.push({
            count: -1,
            value: name,
            parent: '',
            level: 0,
        });
        while (stackTrace.length > 0) {
            var current = stackTrace.slice(-1)[0];
            var adjacents = adjacent(current.value);
            if (current.count === -1) {
                current.count = adjacents.size;
            }
            if (current.count > 0) {
                var iter = adjacents.values();
                var cur = iter.next();
                while (!cur.done) {
                    if (!visited.has(cur.value)) {
                        stackTrace.push({
                            count: -1,
                            parent: current.value,
                            value: cur.value,
                            level: current.level + 1,
                        });
                    }
                    else {
                        current.count--;
                    }
                    cur = iter.next();
                }
            }
            else {
                if (!visited.has(current.value)) {
                    visited.add(current.value);
                    sorted.unshift(current.value);
                }
                var removed = stackTrace.pop();
                for (var i = 0; i < stackTrace.length; i++) {
                    if (stackTrace[i].value === removed.parent) {
                        stackTrace[i].count--;
                    }
                }
            }
        }
    }
    function generateDOT() {
        var edgeStrings = [];
        edges.forEach(function (adj, edge) {
            if (adj.length !== 0) {
                edgeStrings.push("".concat(edge, " -> {").concat(adj.join(','), "}"));
            }
        });
        return "\n    digraph G {\n      ".concat(edgeStrings.join('\n').replace(/!/g, '_'), "\n    }\n    ");
    }
    return graph;
}
