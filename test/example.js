const {getOpts} = require('..');

const cliOpts = {

  shortHandFlag: 'f',

  shortHandProperty: 'short-hand|p=s',

  someFile: {
    long: 'some-file',
    short: 's',
    type: 'string',
    description: 'Name of some file',
    parameter: 'FILE',
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

  requiredProperty: {
    long: 'required-property',
    type: 'string',
    description: 'This option is required, and will throw an error if missing',
    required: 'This field will be the error message',
  },

  help: {
    usage: 'script [OPTS...] ARGUMENTS...',
    body: function() {
      console.log('The --help option is automatically created. Additional usage and body properties can be set');
      console.log(`This prints after the options list. The body property can also be a string`);
    }
  },
};

let opts;
try {
  opts = getOpts(cliOpts, process.argv);
}
catch (err) {
  console.error(err.message);
  process.exit(1);
}

console.dir(opts);
