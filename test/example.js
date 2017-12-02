const {getOpts} = require('..');

const cliOpts = {

  shortHandFlag: 'f',

  shortHandProperty: 'short-hand-property|p=s',

  someFile: {
    long: 'some-file',
    short: 's',
    type: 'string',
    description: 'Name of some file',
  },

  count: {
    long: 'count',
    type: 'number',
  },

  someOptionalSetting: {
    short: 'o',
    description: 'Enable some optional setting',
  },

  someAdditionalSetting: {
    short: 'O',
    description: 'Enable some additional setting, and also some optional setting',
    implies: {
      someOptionalSetting: true,
    }
  },

  extraProperties: {
    long: 'extra-properties',
    type: 'string',
    multi: true,
    description: 'Pass additional options, can be passed multiple times',
  },


  help: {
    usage: 'script [OPTS...] ARGUMENTS...',
    body: function() {
      console.log('The --help option is automatically created. Additional usage and body properties can be set');
      console.log(`This prints after the options list. The body property can also be a string`);
    }
  },
};

const opts = getOpts(cliOpts, process.argv);

console.dir(opts);
