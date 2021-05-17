# glitch-env
code to let your glitch app change contents of .env

assuming your `.env` file contains

```bash
MY_SECRET=something
```

```js
const { env_vars } = require("glitch-env");


const current_value = env_vars.MY_SECRET;// the same as: const current_value = process.env.MY_SECRET;

env_vars.MY_SECRET = "new secret"; // process.env.MY_SECRET = "new value" doesn't update the file, this does.


```

**notes**
===

 * This utility lets you **update** existing values, but not **create** new values

In the above example, if `MY_SECRET=something` (or `MY_SECRET=`) doesn't already exist in .env, nothing will happen

 * If you (or some other code) updates process.env.MY_SECRET directly (without using the object), it will not update either the file, or this object's copy of the value. 


**advanced use**
===

When you assign a new value to env_vars.MY_SECRET, the object updates the internal process.env.MY_SECRET and the .env file asynchronously in the background.

If for some reason you want to use the internal setter/getters asynchronusly, they are exported as setEnvVar and getEnvVar.

One reason you might use this is to set an enviornment variable prior to restarting the server with `process.exit()`


```js
const { setEnvVar , getEnvVar } = require("glitch-env");

setEnvVar ('MY_SECRET','new secret', function(err,updated,reason){
  if (err) {
      console.log(err.message); 
  } else {
     if (updated) {
        console.log("updated MY_SECRET:",reason);
        process.exit();// we made a change, so we need to restart.
     } else {
       console.log("did not update MY_SECRET:",reason);
       // since the change wasn't made, it's because the value hasn't changed, so no point in restarting the server.
     }
  }
});



getEnvVar ('MY_SECRET', function(err,value){
  if (err) {
      console.log(err.message); 
  } else {
      console.log("got MY_SECRET:",value);
  }
});

```

