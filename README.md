# NAME

**Getopt-Long** Extended processing of command line options

# SYNOPSIS
```js
const {getOpts} = require('.');

const cliOpts = {
  someFile: {
    long: 'some-file',
    short: 's',
    type: 'string',
    description: 'Name of some file',
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
      console.log('The --help option is automatically created. Additional usage and body properties can be aset');
      console.log(`This prints after the options list. The body property can also be a string`);
    }
  },
};

const opts = getOpts(cliOpts, process.argv);
```

```sh
$ script --help

Usage: script [OPTS...] ARGUMENTS...

-s, --some-file         Name of some file
-o                      Enable some optional setting
-O                      Enable some additional setting, and also some optional setting
--extra-properties      Pass additional options, can be passed multiple times
--help                   Print this help menu and exit

The --help option is automatically created. Additional usage and body properties can be aset
This prints after the options list. The body property can also be a string

```
