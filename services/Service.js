class Service {
  static rejectResponse(error, code = 500, type="json") {
    return { error, code, type };
  }

  static successResponse(payload, code = 200, type="json") {
    return { payload, code, type };
  }

  static successResponseFile(payload, code = 200, type="file"){
    return { payload, code,type };
  }
}

module.exports = Service;
