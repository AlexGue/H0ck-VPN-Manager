const fs = require('fs');
const lineReader = require('line-reader');
const ping = require('ping')
const dns = require('dns')
const tcpie = require('tcpie');


module.exports.getAllServersAvailable = getAllServersAvailable;


async function pingServer(ip) {
    var ms = Date.now();
    return new Promise(resolve => {
        ping.sys.probe(ip, response => {
            resolve({"ip":ip, "alive": response, "timestamp": Date.now() })
        }, { timeout: 2 });
    }).then(pingResult => {
        pingResult.timestamp = pingResult.timestamp - ms;
        return pingResult;
    });
}

async function getAllServersAvailable(folder){
    var servers = [];

    var promisePingList = [];
    fs.readdirSync(folder).filter(x => { return x.endsWith('.ovpn') }).forEach(file => {

        promisePingList.push(new Promise(resolve => {
            var ip;
            lineReader.eachLine('./vpn-files/' + file, async function (line, last) {
                if (line.startsWith('remote ')) {
                    ip = line.split(' ')[1];
                    var pingResult = await pingServer(ip);
                    pingResult["file"] = file;
                    servers.push(pingResult);
                    resolve();
                    return false;
                }
                if (last && ip == null) {
                    console.error('Invalid OVPN file. Must specify remote.')
                }
            })
        }))
    });
    await Promise.all(promisePingList).then(x=>{servers.sort( function comp(a1,a2 ){
        return a1.timestamp > a2.timestamp ? 1 : -1;
     })});
    return servers;
}

