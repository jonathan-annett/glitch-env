const lib = (module.exports = {});

const env_file = "/app/.env",
  eol = "\n",
  env_values = {},
  env_vars = {},
  env_keys = [],
  fs = require("fs"),
  path = require("path");

lib.env_vars = env_vars;
lib.setEnvVar = setEnvVar;
lib.getEnvVar = getEnvVar;

fs.readFileSync(env_file, "utf8")
  .trim()
  .split(eol)
  .forEach(function(line) {
    if (line.startsWith("#")) return;
    const trimmed = line.trim(),
      eq = trimmed.indexOf("=");
    if (eq < 0) return;
    const key = trimmed.substr(0, eq);
    env_keys.push(key);
    env_values[key] = trimmed.substr(eq + 1);
    Object.defineProperty(env_vars, key, {
      get: function() {
        return env_values[key];
      },
      set: function(value) {
        setEnvVar(key, value, function() {});
      },
      enumerable: true
    });
  });

function setEnvVar(key, value, cb) {
  const detect = key.trim() + "=",
    new_line = detect + value.trim();
  fs.readFile(env_file, "utf8", function(err, data) {
    if (err) return cb(err);
    const existing = data.split(eol);
    if (existing.indexOf(new_line) >= 0) {
      const msg = new_line + " already exists in .env. not updating file";
      //console.log(msg);
      process.env[key] = value;
      env_values[key] = value;
      cb(undefined, false, msg);
    } else {
      let found = false;
      const new_data = existing
        .map(function(line, index) {
          if (line.trim().startsWith(detect)) {
            found = true;
            const msg = line + " >>> " + new_line;
            //               console.log(msg);
            return new_line;
          }
          return line;
        })
        .join(eol);
      if (found) {
        const msg = "updating .env";
        //console.log(msg);
        fs.writeFile(env_file, new_data, function(err) {
          if (err) return cb(err);
          process.env[key] = value;
          env_values[key] = value;
          cb(undefined, true, msg);
        });
      } else {
        const msg = key + " not found in env, can't update";
        //console.log(msg);
        return cb(new Error(msg));
      }
    }
  });
}

function getEnvVar(key, cb) {
  const detect = key.trim() + "=";
  fs.readFile(env_file, "utf8", function(err, data) {
    if (err) return cb(err);
    if (
      data.split(eol).existing.some(function(line, index) {
        const trimmed = line.trim();
        if (trimmed.startsWith(detect)) {
          const value = trimmed.substr(detect.length + 1);
          process.env[key] = value;
          env_values[key] = value;
          cb(undefined, value);
          return true;
        }
      })
    )
      return;

    const msg = key + " not found in env, can't update";
    console.log(msg);
    return cb(new Error(msg));
  });
}
