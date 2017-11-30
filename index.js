'use strict';

function getHelp(opts) {
  const helpWidth = 24;
  Object.keys(opts).forEach((opt) => {
    if (opts[opt].implemented === false) {
      return;
    }

    const short = opts[opt].short ? `-${opts[opt].short}` : undefined;
    const long = opts[opt].long ? `--${opts[opt].long}` : undefined;

    const flags = [short, long].filter(flag => flag).join(', ');
    const spaceLength = (flags.length > helpWidth) ? 1 : helpWidth - flags.length;
    console.log(`${flags}${' '.repeat(spaceLength)}${opts[opt].description}`);
  });
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


    }

    return undefined;
  });

  return flags;
}

function getOpts(opts, args) {
  // Remove the first two args from argv
  console.log(args);
  const { flags, leftovers } = _getOpts(opts, args.slice(2));
  console.log(flags);
  console.log(leftovers);

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

  const longMatch = arg.match(/--(\w(?:\w|-)*\w)/);
  const shortMatch = arg.match(/-((\w)+)/);

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
      if (parsedArg === 'h') {
        getHelp(opts);
        process.exit();
      }

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
