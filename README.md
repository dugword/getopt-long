# NAME

**Getopt-Long** Extended processing of command line options

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
```

```sh
$ script firstArg -fs fileName -p prop --count 42 secondArg --extra-properties two -O --extra-properties one thirdArgg
{ bin: '/Users/djenk9/.nvm/versions/node/v6.10.3/bin/node',
  file: '/Users/djenk9/Projects/JavaScript/Node/getopt-long/test/example.js',
  opts:
   { shortHandFlag: true,
     someFile: 'fileName',
     shortHandProperty: 'prop',
     count: 42,
     extraProperties: [ 'two', 'one' ],
     someOptionalSetting: true,
     someAdditionalSetting: true },
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
--help                        Print this help menu and exit

The --help option is automatically created. Additional usage and body properties can be set
This prints after the options list. The body property can also be a string
```
