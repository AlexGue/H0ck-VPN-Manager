const fs = require('fs');
const lineReader = require('line-reader');
const ping = require('ping')
const dns = require('dns')
const tcpie = require('tcpie');


module.exports.getMostValidServer = getMostValidServer;


async function pingServer(ip) {
    var ms = Date.now();
    return new Promise(resolve => {
        ping.sys.probe(ip, response => {
            resolve({ "alive": response, "timestamp": Date.now() })
        }, { timeout: 2000 });
    }).then(pingResult => {
        pingResult.timestamp = pingResult.timestamp - ms;
        return pingResult;
    });
}


async function getMostValidServer(folder) {
    var servers = [];

    var promisePingList = [];
    fs.readdirSync(folder).filter(x => { return x.endsWith('.ovpn') }).forEach(file => {

        promisePingList.push(new Promise(resolve => {
            var ip;
            lineReader.eachLine('./vpn-files/' + file, async function (line, last) {
                if (line.startsWith('remote ')) {
                    ip = line.split(' ')[1];
                    var pingResult = await pingServer(ip);
                    console.log(pingResult);
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
    await Promise.all(promisePingList).then();
    return servers;

}