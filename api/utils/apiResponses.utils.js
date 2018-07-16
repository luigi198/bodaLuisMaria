var errorsJson = require('../../config/errorCodes.json');

var response = {
  successResponse: function (res, jsonData) {
    res.status(200).json(jsonData);
  },
  errorResponse: function (res, jsonData) {
    res.status(500).json(jsonData);
  },
  customErrorResponse: function (res, errNum) {
    var obj = {'errMsg': errorsJson.ErrorCodes[errNum]};
    res.status(errNum).json(obj);
  }
};

module.exports = {
  successResponse: response.successResponse,
  errorResponse: response.errorResponse,
  customErrorResponse: response.customErrorResponse,
  catchResponse: function (res, err) {
      if (typeof err.code !== 'undefined') {
        response.customErrorResponse(res, err.code);
      } else {
        response.errorResponse(res, err);
      }
    }
};
