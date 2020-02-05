/* eslint-disable no-unused-vars */
const Service = require('./Service');
const vpnfilesFolder = './vpn-files/';
const fs = require('fs');
const vpnUtils = require('../utils/vpnUtils')

class VpnService {

  /**
   * Get VPN File
   * Get the VPN file with less ping and not being used
   *
   * containerName String Name of the container that will use the VPN file
   * returns Object
   **/
  static getBestVPNFile({ containerName }) {
    return new Promise(
      async (resolve) => {
        try {

         var response = await vpnUtils.getMostValidServer(vpnfilesFolder);

          resolve(Service.successResponse(response));
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
   * Get a list of the containers running
   * Return a list of current containers
   *
   * returns Object
   **/
  static vpnGetContainersGET() {
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

}

module.exports = VpnService;
