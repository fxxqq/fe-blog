const ensureArray = (thing) => {
  if (Array.isArray(thing))
    return thing;
  if (thing == undefined)
    return [];
  return [thing];
}

const createFilter = (include, exclude, options) => {
  const resolutionBase = options && options.resolve;
  const getMatcher = (id) => {
    return id instanceof RegExp ?
      id : {
        test: micromatch_1.matcher(getMatcherString(id, resolutionBase)
          .split(path.sep)
          .join('/'), { dot: true })
      };
  };
  const includeMatchers = ensureArray(include).map(getMatcher);
  const excludeMatchers = ensureArray(exclude).map(getMatcher);
  return function(id) {
    if (typeof id !== 'string')
      return false;
    if (/\0/.test(id))
      return false;
    id = id.split(path.sep).join('/');
    for (let i = 0; i < excludeMatchers.length; ++i) {
      const matcher = excludeMatchers[i];
      if (matcher.test(id))
        return false;
    }
    for (let i = 0; i < includeMatchers.length; ++i) {
      const matcher = includeMatchers[i];
      if (matcher.test(id))
        return true;
    }
    return !includeMatchers.length;
  };
};

exports.createFilter = createFilter;