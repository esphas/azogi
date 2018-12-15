
/** Azogi */
class Azogi {

  /** Take a sample from an object */
  static sample(object) {
    function sampleImpl(object) {
      if (object == null) {
        return '';
      } else if (typeof object === 'string') {
        return object;
      } else if (typeof object === 'object') {
        let result = Object.values(object);
        result = result[Math.floor(Math.random() * result.length)];
        return sampleImpl(result);
      } else {
        return String(object);
      }
    }
    if (typeof object === 'string') {
      object = Array.from(object);
    }
    return sampleImpl(object);
  }

  /** shorthand for new.next() */
  static yields(options = {}) {
    return new Azogi(options).next();
  }

  /** Create new Azogi generator */
  constructor({
    pattern = '',
    depots = {
      v: 'aeiou',
      c: 'bcdfghjklmnpqrstvwxyz',
    },
  } = {}) {
    /** @private */
    this.pattern = '';
    this.setupPattern(pattern);
    /** @private */
    this.depots = JSON.parse(JSON.stringify(depots));
  }

  /** Setup default pattern */
  setupPattern(pattern) {
    if (typeof pattern !== 'string') {
      pattern = Object.values(pattern);
    }
    this.pattern = JSON.parse(JSON.stringify(pattern));
  }

  /** Setup new depot */
  setupDepot(name, depot) {
    this.depots[name] = JSON.parse(JSON.stringify(depot));
  }

  /** Clear all depot */
  clearDepots() {
    this.depots = {};
  }

  /** Get next azogi string */
  next(pattern, separator) {
    if (pattern != null) {
      this.setupPattern(pattern);
    }
    pattern = this.pattern;
    if (typeof pattern === 'string') {
      if (separator) {
        pattern = pattern.split(separator);
      } else {
        pattern = Array.from(pattern);
      }
    }
    let result = pattern.map((name) => {
      if (this.depots[name]) {
        return Azogi.sample(this.depots[name]);
      } else {
        return name;
      }
    }).join('');
    return result;
  }

}

module.exports = Azogi;
