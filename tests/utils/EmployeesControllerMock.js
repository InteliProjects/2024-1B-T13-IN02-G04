const sinon = require("sinon");

const mockAsync = (model, module, result = null) => {
  return sinon.stub(model, module).resolves(result);
};

const RESPONSE = {
  json: function (data) {
    return data;
  },
  badRequest: function (data) {
    return { status: 400, ...data };
  },
  notFound: function (data) {
    return { status: 404, error: "Employee not found" };
  },
  serverError: function (data) {
    return { status: 500, ...data };
  },
};


const EMPLOYEE = {
  id: "cce825bf-09d5-4c8e-a9be-9f4f4a9dba5d",
  name: "João Silva",
  email: "joao.silva@example.com",
  password: "password123",
  isEngineer: false,
};

module.exports = {
  mockAsync,
  RESPONSE,
  EMPLOYEE,
};
