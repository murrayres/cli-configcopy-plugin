"use strict"



async function ccopy(appkit, args) {
  try{
        var newlist = {}
        var redactedlist = {}
        const configvars = await appkit.api.get('/apps/' + args.app + '/config-vars')
        var newlist = {}
        for (var key in configvars) {
//TODO need to update to avoid others
            if (!key.includes("_VAULT_") && key != "DATABASE_URL" && key != "RABBITMQ_URL" && !key.startsWith("S3_") && key !="MONGODB_URL" && key !="REDIS_URL" && key != "ES_URL" && key != "KIBANA_URL" && key != "MEMCACHED_URL" && !configvars[key].includes("redacted")) {
                newlist[key] = configvars[key]
            }else{
             redactedlist[key]=configvars[key]
            }
        }
       const resp = await appkit.api.patch(JSON.stringify(newlist), '/apps/' + args.t + '/config-vars'); 
       appkit.terminal.vtable(resp);
       console.log("")
       console.log("these variables not copied")
       appkit.terminal.vtable(redactedlist);
  } catch (err) {
    appkit.terminal.error(err);
  }
}

async function ccopy_one(appkit, args) {
  try{
        var newlist = {}
        var redactedlist = {}
        const configvars = await appkit.api.get('/apps/' + args.app + '/config-vars')
        var newlist = {}
        for (var key in configvars) {
//TODO need to update to avoid others
            if (!key.includes("_VAULT_") && key != "DATABASE_URL" && key != "RABBITMQ_URL" && !key.startsWith("S3_") && key !="MONGODB_URL" && key !="REDIS_URL" && key != "ES_URL" && key != "KIBANA_URL" && key != "MEMCACHED_URL" && !configvars[key].includes("redacted")) {
              if (key==args.VAR){
                newlist[key] = configvars[key]
              }
            }else{
              if (key==args.VAR){
             redactedlist[key]=configvars[key]
             }
            }
        }
       const resp = await appkit.api.patch(JSON.stringify(newlist), '/apps/' + args.t + '/config-vars');
       appkit.terminal.vtable(resp, true);
    if (redactedlist.length > 0){
       console.log("")
       console.log("these variables not copied")
       appkit.terminal.vtable(redactedlist);
     }
  } catch (err) {
    appkit.terminal.error(err);
  }
}


function update() {
}

function init(appkit) {
  appkit.args
    .command('configcopy', 'copy an apps manual config vars to another app', ccopy_opts, ccopy.bind(null, appkit))
    .command('configcopy:one VAR', 'copy a single config var from one app to another', ccopy_opts, ccopy_one.bind(null, appkit))
}

module.exports = {
  init:init,
  update:update,
  group:'configcopy',
  help:'copy an apps manual config vars to another app',
  primary:true
};


    const ccopy_opts = {
        app: {
            alias: 'a',
            string: true,
            description: 'app to act on',
            demand: true
        },
        toapp: {
            alias: 't',
            string: true,
            description: 'copy to',
            demand: true
        },
    }

