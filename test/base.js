
const Azogi = require('../src/index');

describe(Azogi, () => {

  it('constructs with an optional argument as options', () => {
    const options = {
      pattern: 'avcvc',
      depots: {
        v: 'oi',
        c: 'zg',
      },
    };;
    const azogi = new Azogi(options);
    expect(azogi.pattern).toEqual(options.pattern);
    expect(azogi.depots).toEqual(options.depots);
  });

  it('has a shorhand to yield', () => {
    expect(typeof Azogi.yields).toBe('function');
  })

  it('yields original string with empty depots', () => {
    const options = {
      pattern: 'Azogi'
    };
    const azogi = new Azogi(options);
    azogi.clearDepots();
    expect(azogi.next()).toBe(options.pattern);
    expect(azogi.next()).toBe(options.pattern);
    azogi.setupPattern([]);
    expect(azogi.next()).toBe('');
    expect(azogi.next()).toBe('');
  });

  it('yields according to depots correctly', () => {
    const options = {
      pattern: ['vowel', 'number'],
      depots: {
        vowel: 'AEIOU',
        number: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      },
    };
    const azogi = new Azogi(options);
    for (let count = 0; count < 10; count += 1) {
      expect(Azogi.yields(options)).toMatch(/^[AEIOU]\d$/);
      expect(azogi.next()).toMatch(/^[AEIOU]\d$/);
    }
  });

  it('changes pattern on next()', () => {
    const patternA = 'ax';
    const patternB = 'xa';
    const depots = {
      a: '123',
      x: '789',
    };
    const azogi = new Azogi({ pattern: patternA, depots });
    expect(azogi.next()).toMatch(/^[123][789]$/);
    expect(azogi.next(patternB)).toMatch(/^[789][123]$/);
    expect(azogi.next()).toMatch(/^[789][123]$/);
  });

  it('handles separator', () => {
    const options = {
      depots: {
        vowel: 'AEIOU',
        number: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      },
    };
    const azogi = new Azogi(options);
    expect(azogi.next('vowel,number')).toMatch('vowel,number');
    expect(azogi.next('vowel,number', ',')).toMatch(/^[AEIOU]\d$/);
  });

  it('adds new depot on setupDepot()', () => {
    const options = {
      pattern: 'ax',
      depots: {
        a: '123',
      },
    };
    const azogi = new Azogi(options);
    expect(azogi.next()).toMatch(/^[123]x$/);
    azogi.setupDepot('x', [7, 8, 9]);
    expect(azogi.next()).toMatch(/^[123][789]$/);
  });

  it('safely handles all kinds of elements in depots', () => {
    const options = {
      pattern: ['some', 'depots', 'with', 'nulls'],
      depots: {
        some: 'normal',
        depots: [7, 9, function(){}, [], {}],
        nulls: ['foo', null, 'bar'],
      },
    };
    const regexp = /^[normal]([79]|function\(\){}|[object Object])?with(foo|bar)?$/;
    const azogi = new Azogi(options);
    for (let count = 0; count < 10; count += 1) {
      expect(azogi.next()).toMatch(regexp);
    }
  });

  it('has basic default options', () => {
    const azogi = new Azogi();
    expect(azogi.next()).toBe('');
    expect(azogi.next('c')).toMatch(/^[^aeiou]$/);
    expect(azogi.next('v')).toMatch(/^[aeiou]$/);
    expect(azogi.next('acvcv')).toMatch(/^a[^aeiou][aeiou][^aeiou][aeiou]$/);
    expect(azogi.next('azogi')).toBe('azogi');
  });

});
