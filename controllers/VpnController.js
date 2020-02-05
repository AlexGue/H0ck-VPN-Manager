const Controller = require('./Controller');

class VpnController {
  constructor(Service) {
    this.service = Service;
  }

  async getBestVPNFile(request, response) {
    await Controller.handleRequest(request, response, this.service.getBestVPNFile);
  }

  async getFastestContainer(request, response) {
    await Controller.handleRequest(request, response, this.service.getFastestContainer);
  }

  async pingReceived(request, response) {
    await Controller.handleRequest(request, response, this.service.pingReceived);
  }

  async vpnGetContainersGET(request, response) {
    await Controller.handleRequest(request, response, this.service.vpnGetContainersGET);
  }

}

module.exports = VpnController;
