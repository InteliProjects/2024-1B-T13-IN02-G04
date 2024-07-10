const sinon = require("sinon");

const mockAsync = (model, method, result = null) => {
  return sinon.stub(model, method).resolves(result);
};

const RESPONSE = {
  json: function (data) {
    return data;
  },
  status: function (statusCode) {
    this.statusCode = statusCode;
    return this;
  },
  view: function (viewName, data) {
    return { viewName, data };
  },
};

const EMPLOYEE = {
  id: "cce825bf-09d5-4c8e-a9be-9f4f4a9dba5d",
  name: "John Doe",
  email: "john.doe@gmail.com",
  isEngineer: true,
  password: "password123",
};

const MANUAL = {
  id: "manual-id-123",
  title: "Manual Title",
  description: "Manual Description",
  hardwareType: "laptop",
};

module.exports = {
  mockAsync,
  RESPONSE,
  EMPLOYEE,
  MANUAL,
};