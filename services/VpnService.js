/* eslint-disable no-unused-vars */
const Service = require('./Service');
const vpnfilesFolder = './vpn-files/';
const fs = require('fs');
const vpnUtils = require('../utils/vpnUtils')

var containerTimeoutMs = 20000;
var currentContainersUp = [];


var path = require('path');
var appDir = path.dirname(require.main.filename);


class VpnService {

  /**
   * Get VPN File
   * Get the VPN file with less ping and not being used
   *
   * containerName String Name of the container that will use the VPN file
   * returns Object
   * 
   **/
  static getBestVPNFile({ containerName }) {
    return new Promise(
      async (resolve) => {
        try {

         var servers = await vpnUtils.getAllServersAvailable(vpnfilesFolder);
         var assignedServer = servers.find(sv=> {
            //Get the first server not being used
            return (currentContainersUp.find(current=> {return current.ip == sv.ip;}) == null)
          })
          if (assignedServer){
            assignedServer.lastPing = Date.now();
            assignedServer.containerName = containerName;
            currentContainersUp.push(assignedServer);
            resolve(Service.successResponseFile(appDir +  vpnfilesFolder.substr(1) + assignedServer.file));
          }
          else{
            resolve(Service.rejectResponse("No valid server found"));
          }
          
        } catch (e) {
          resolve(Service.rejectResponse(
            e.message || 'Invalid input',
            e.status || 405,
          ));
        }
      },
    );
  }

  /**
   * Get the fastest container
   * Return the container with less load in it.
   *
   * returns Object
   **/
  static getFastestContainer() {
    return new Promise(
      async (resolve) => {
        try {
          resolve(Service.successResponse(''));
        } catch (e) {
          resolve(Service.rejectResponse(
            e.message || 'Invalid input',
            e.status || 405,
          ));
        }
      },
    );
  }

  /**
   * Update the status of a container
   * Update a list that will prevent a container to be considered as down.
   *
   * containerName String Container name to update
   * no response value expected for this operation
   **/
  static pingReceived({ containerName }) {
    return new Promise(
      async (resolve) => {
        try {
          var updatedContainer = currentContainersUp.find(container => {
            return container.containerName == containerName;
          })
          updatedContainer.lastPing = Date.now();
          resolve(Service.successResponse(updatedContainer));
        } catch (e) {
          resolve(Service.rejectResponse(
            e.message || 'Invalid input',
            e.status || 405,
          ));
        }
      },
    );
  }

  /**
   * Get a list of the containers running
   * Return a list of current containers
   *
   * returns Object
   **/
  static vpnGetContainersGET() {
    return new Promise(
      async (resolve) => {
        try {
          resolve(Service.successResponse(currentContainersUp));
        } catch (e) {
          resolve(Service.rejectResponse(
            e.message || 'Invalid input',
            e.status || 405,
          ));
        }
      },
    );
  }

  static clearContainers(){
    currentContainersUp = currentContainersUp.filter(container => {
      return Date.now() < (container.lastPing + containerTimeoutMs)
    })

  }

}

module.exports = VpnService;
