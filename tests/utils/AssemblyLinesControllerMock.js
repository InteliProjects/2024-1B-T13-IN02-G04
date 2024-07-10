const sinon = require("sinon");

const mockAsync = (model, module, result = null) => {
  return sinon.stub(model, module).resolves(result);
};

const RESPONSE = {
  json: function (data) {
    return data;
  },
};

const ASSEMBLY_LINE = {
  id: "12345678-1234-1234-1234-1234567890ab",
  nome: "Linha de Montagem A",
};

module.exports = {
  mockAsync,
  RESPONSE,
  ASSEMBLY_LINE,
};
