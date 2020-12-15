const maxBy = (cb) => (a, b) => (cb(b) > cb(a) ? b : a);

const minBy = (cb) => (a, b) => (cb(b) < cb(a) ? b : a);

const findRoutes = (
  graph,
  source,
  dest,
  cbNeighbors,
  portals = {},
  useLevels = false
) => {
  const allKeys = new Set([source]);
  const nodes = new Set([source]);
  const dist = new Map();
  const prev = new Map();
  let level = 0;

  const getDist = (key) => (dist.has(key) ? dist.get(key) : Infinity);
  dist.set(source, 0);

  while (nodes.size) {
    let closest = [...nodes].reduce(minBy((n) => getDist(n)));
    if (dest && closest === dest && level === 0) {
      return [dist.get(dest), toPath(prev, source, dest)];
    }
    nodes.delete(closest);
    const neighbors = cbNeighbors
      ? cbNeighbors(graph, closest, closest.split(',').map(Number)[2])
      : graph[closest];
    neighbors.forEach((neighbor) => {
      if (!allKeys.has(neighbor)) {
        allKeys.add(neighbor);
        nodes.add(neighbor);
      }
      const alt = getDist(closest) + 1;
      if (alt < getDist(neighbor)) {
        dist.set(neighbor, alt);
        prev.set(neighbor, closest);
      }
    });
  }

  return dest ? [] : [dist, prev];
};

const toPath = (prev, source, dest) => {
  const path = [];
  let current;
  do {
    current = current ? prev.get(current) : dest;
    path.push(current);
  } while (current !== source);
  return path.reverse();
};

const logTime = (ex = 'exercise', cb) => {
  console.time(ex);
  const result = cb();
  console.timeEnd(ex);
  if (ex !== 'Parse') {
    console.log(`${ex}: ${result}`);
  }
  return result;
};

module.exports = {
  maxBy,
  minBy,
  findRoutes,
  toPath,
  logTime,
};
