
# Azogi [![Azogi naming](https://img.shields.io/badge/naming-Azogi-blue.svg)](https://github.com/esphas/azogi) [![npm version](https://img.shields.io/npm/v/@esphas/azogi.svg)](https://www.npmjs.com/package/@esphas/azogi) [![CircleCI](https://circleci.com/gh/esphas/azogi.svg?style=svg)](https://circleci.com/gh/esphas/azogi) [![Coverage Status](https://coveralls.io/repos/github/esphas/azogi/badge.svg?branch=master)](https://coveralls.io/github/esphas/azogi?branch=master)

Azogi is a charset-based azogi-style random string generator.

## Install

```
npm install --save @esphas/azogi
# or
yarn add @esphas/azogi
```

## Usage

```javascript
const Azogi = require('azogi');

const options = {
  pattern: 'Hi Acvcv',
  // depots: { ... },
  // omit to use default depots ('v' for vowels and 'c' for consonants)
};

Azogi.yields(options); // Hi Azogi/Adenu/Amike/Afuxe/Amude...
// or
const azogi = new Azogi(options);
azogi.next(); // basically same as above
azogi.next('vzogi'); // azogi/ezogi/izogi/ozogi/uzogi

// setup new depot
azogi.setupDepot('d', '1234567890');
azogi.next('dd-dd-dd'); // 96-71-08, 55-00-86, 58-32-60, ...
azogi.setupDepot('special', ['azogi', 42, true, {}]);
azogi.next(['d', 'd', '-', 'special']); // 97-42, 37-, 95-true, 02-azogi, ...
// clear depots (including defaults)
azogi.clearDepots();
azogi.next('Acvcv'); // Acvcv
```
