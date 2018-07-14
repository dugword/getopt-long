# NAME

`getopt-long` - Extended processing of command line options with automatic help

# SYNOPSIS
```js
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
```

```sh
$ script firstArg -fs fileName -p prop --count 42 secondArg --extra-properties two -O --extra-properties one --required-property token thirdArgg
{ bin: '/Users/djenk9/.nvm/versions/node/v6.10.3/bin/node',
  file: '/Users/djenk9/Projects/JavaScript/Node/getopt-long/test/example.js',
  opts:
   { shortHandFlag: true,
     someFile: 'fileName',
     shortHandProperty: 'prop',
     count: 42,
     extraProperties: [ 'two', 'one' ],
     someOptionalSetting: true,
     someAdditionalSetting: true,
     requiredProperty: 'token' },
  args: [ 'firstArg', 'secondArg', 'thirdArgg' ] }

```

```sh
$ script --help
Usage: script [OPTS...] ARGUMENTS...

-f                            boolean
-p, --short-hand-property     string
-s, --some-file               Name of some file
--count                       number
-o                            Enable some optional setting
-O                            Enable some additional setting, and also some optional setting
--extra-properties            Pass additional options, can be passed multiple times
-t, --security-token          REQUIRED: This option is required, and will throw an error if missing
--help                        Print this help menu and exit

The --help option is automatically created. Additional usage and body properties can be set
This prints after the options list. The body property can also be a string
```
