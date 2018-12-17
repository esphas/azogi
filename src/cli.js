
const Azogi = require('./index');

const program = require('yargs')

  .alias('v', 'version')

  .number('n')
  .describe('n', 'Set the number of strings to generate')
  .default('n', 1)
  .coerce('n', (n) => Math.max(1, n))

  .alias('c', 'clear')
  .boolean('c')
  .describe('c', 'Clear all depots before adding new depots')
  .default('c', false)

  .alias('d', 'depot')
  .array('d')
  .default('d', [])
  .describe('d', 'Add a new depot, format: "<name>=<comma,seperated,values>"')
  .coerce('d', (depots) => {
    return depots.map((kv) => {
      const [, k, v] = kv.match(/^(.+?)=(.+)$/);
      return [k, v.split(',')];
    });
  })

  .alias('p', 'pattern')
  .default('p', 'Acvcv')
  .describe('p', 'Set the generating pattern')

  .alias('s', 'separator')
  .default('s', '')
  .describe('s', 'Set the seperator for the pattern')

  .alias('h', 'help')

;

function main() {
  argv = program.argv;
  const azogi = new Azogi({ pattern: argv.pattern });
  if (argv.clear) {
    azogi.clearDepots();
  }
  argv.depot.forEach(([k, v]) => {
    azogi.setupDepot(k, v);
  });
  let count = 0;
  for (count = 0; count < argv.n; count += 1) {
    console.log(azogi.next(null, argv.separator));
  }
}

module.exports = main;
