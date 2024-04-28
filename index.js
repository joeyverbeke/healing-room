const { Neurosity } = require("@neurosity/sdk");
require("dotenv").config();

const deviceId = process.env.DEVICE_ID || "";
const email = process.env.EMAIL || "";
const password = process.env.PASSWORD || "";

const osc = require('node-osc');

//if on same computer change to 127.0.0.1
const client = new osc.Client('10.103.41.160', 7000);

const verifyEnvs = (email, password, deviceId) => {
    const invalidEnv = (env) => {
      return env === "" || env === 0;
    };
    if (invalidEnv(email) || invalidEnv(password) || invalidEnv(deviceId)) {
      console.error(
        "Please verify deviceId, email and password are in .env file, quitting..."
      );
      process.exit(0);
    }
  };
  verifyEnvs(email, password, deviceId);

  const neurosity = new Neurosity({
    deviceId
  });
  
  const main = async () => {
    await neurosity
      .login({
        email,
        password
      })
      .catch((error) => {
        console.log(error);
        throw new Error(error);
      });
    console.log("Logged in");

    neurosity.calm().subscribe((calm) => {
        console.log(calm.probability);
        client.send('/calm', calm.probability);
        
        if (calm.probability > 0.2) {
           //hapticEffects();
        }
        
      });
  };
  

  /*
  const hapticEffects = async () => {
    const effects = neurosity.getHapticEffects();

    const result = await neurosity.haptics({
      P8: [effects.strongClick100]
    });
    
    console.log(result.status); // prints: complete
  }
  */

  main();

  console.log(`${email} attempting to authenticate to ${deviceId}`);


  //my ip
  //10.103.180.59

  //koi's ip
  //10.103.41.160