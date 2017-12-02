'use strict';

function getHelp(opts) {
  if (opts.help && opts.help.usage) {
    console.log('Usage:', opts.help.usage);
  }

  if (opts.help && opts.help.example) {
    console.log('Example:', opts.help.example);
  }

  console.log();

  const helpWidth = 30;
  Object.keys(opts).forEach((opt) => {
    if (opts[opt].implemented === false) {
      return;
    }

    if (opt === 'help') {
      return;
    }

    const short = opts[opt].short ? `-${opts[opt].short}` : undefined;
    const long = opts[opt].long ? `--${opts[opt].long}` : undefined;

    const flags = [short, long].filter(flag => flag).join(', ');
    const spaceLength = (flags.length > helpWidth) ? 1 : helpWidth - flags.length;
    console.log(`${flags}${' '.repeat(spaceLength)}${opts[opt].description || opts[opt].type || 'boolean'}`);

  });

  const spaceLength = helpWidth - '--help'.length;
  console.log(`--help${' '.repeat(spaceLength)}Print this help menu and exit`);

  if (opts.help && opts.help.body) {
    console.log();

    if (typeof opts.help.body === 'string') {
      console.log(opts.help.body);
    }
    else if (typeof opts.help.body === 'function') {
      opts.help.body();
    }
  }
}

function assignFlagValue(flags, opts, optKey, value) {

  if (opts[optKey].multi) {
    flags[optKey] = flags[optKey] || [];
    flags[optKey].push(value);
    return flags;
  }
  else if (flags[optKey]) {
    throw new Error(`Redefining option: ${optKey}`);
  }

  flags[optKey] = value;
  return flags;
}

function getFlagValue(flagType, flags, opts, parsedArg, args) {

  Object.keys(opts).forEach((optKey) => {
    if (parsedArg === opts[optKey][flagType]) {
      if (opts[optKey].implemented === false) {
        throw new Error('Option not implemented');
      }

      if (opts[optKey].implies) {
        Object.keys(opts[optKey].implies).forEach((impliedKey) => {
          flags[impliedKey] = opts[optKey].implies[impliedKey];
        });
      }

      if (opts[optKey].type === 'boolean' || opts[optKey].type === undefined) {
        flags = assignFlagValue(flags, opts, optKey, true);
        return flags;
      }
      else if (opts[optKey].type === 'string') {
        const value = args.shift();
        if (!value) {
          throw new Error(`Missing value for: ${parsedArg}`);
        }

        flags = assignFlagValue(flags, opts, optKey, value);
        return flags;
      }
      else if (opts[optKey].type === 'number') {
        const value = args.shift();
        if (!value) {
          throw new Error(`Missing value for: ${parsedArg}`);
        }
        if (isNaN(+value)) {
          throw new Error(`Value is not a number: ${parsedArg}`);
        }

        flags = assignFlagValue(flags, opts, optKey, +value);
        return flags;
      }


    }

    return undefined;
  });

  return flags;
}

function getOpts(opts, args) {
  // Decode shorthand properties
  const decodedOpts = Object.keys(opts).reduce((decodedOpts, optKey) => {
    if (typeof opts[optKey] === 'string') {
      const decodedOpt = {};

      let [flags, type] = opts[optKey].split('=');
      if (!type || type === 'b') {
        decodedOpt.type = 'boolean';
      }
      else if (type === 'n') {
        decodedOpt.type = 'number';
      }
      else if (type === 's') {
        decodedOpt.type = 'string';
      }
      else {
        throw new Error(`Invalid opt type: ${type}`);
      }

      let [long, short] = flags.split('|');

      // If only one flag is passed, determine if it was long or short
      if (!short) {
        if (long.length === 1) {
          [long, short] = [short, long];
        }
      }

      decodedOpt.long = long;
      decodedOpt.short = short;

      decodedOpts[optKey] = decodedOpt;
    }

    else if (typeof opts[optKey] === 'object') {
      decodedOpts[optKey] = opts[optKey];
    }

    else {
      throw new Error('Invalid opt type');
    }

    if (!decodedOpts[optKey].description) {
      decodedOpts[optKey].description = decodedOpts[optKey].type;
    }

    return decodedOpts;
  }, {});

  // Remove the first two args from argv
  const { flags, leftovers } = _getOpts(decodedOpts, args.slice(2));

  return {
    bin: args[0],
    file: args[1],
    opts: flags,
    args: leftovers,
  }

}

function _getOpts(opts, args, flags = {}, leftovers = []) {
  if (!args.length) {
    return {
      flags,
      leftovers,
    };
  }

  const arg = args.shift();

  const longMatch = arg.match(/^--(\w(?:\w|-)*\w)$/);
  const shortMatch = arg.match(/^-((\w)+)$/);

  if (longMatch) {

    const parsedArg = longMatch[1];

    if (parsedArg === 'help') {
      getHelp(opts);
      process.exit();
    }

    flags = getFlagValue('long', flags, opts, parsedArg, args);

  }
  else if (shortMatch) {

    const parsedArgs = shortMatch[1].split('');

    parsedArgs.forEach((parsedArg) => {
      flags = getFlagValue('short', flags, opts, parsedArg, args);
    });

  }
  else {
    leftovers.push(arg);
  }

  return _getOpts(opts, args, flags, leftovers);
}

module.exports = {
  getOpts,
};
