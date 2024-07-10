// test/assemblyLine.test.js
// test/integration/controller/AssemblyLinesController.test.js
const assert = require("assert");
const sinon = require("sinon");
const controller = require("../../api/controllers/AssemblyLinesController");
const AssemblyLine = require("../../api/models/Assembly_line");

describe("AssemblyLinesController", () => {

  let createStub;

  afterEach(() => {
    if (createStub) createStub.restore();
  });

  it("Deve criar uma linha de montagem com sucesso", async () => {
    createStub = sinon.stub(controller, "create").resolves({ name: "Linha de Montagem 1" });

    const req = {
      body: { name: "Linha de Montagem 1" },
    };

    const res = {
      json: sinon.stub(),
      badRequest: sinon.stub(),
      serverError: sinon.stub()
    };

    await controller.create(req, res);

    assert.ok(createStub.calledOnce);
    assert.ok(res.json.calledOnce, 'res.json should be called once');
    assert.deepStrictEqual(res.json.firstCall.args[0], { success: true, name: "Linha de Montagem 1" });
  });

  it("Deve falhar ao criar uma linha de montagem sem nome", async () => {
    const req = {
      body: { name: "" },
    };

    const res = {
      json: sinon.stub(),
      badRequest: sinon.stub().returnsThis(),
      serverError: sinon.stub().returnsThis()
    };

    await controller.create(req, res);

    assert.ok(res.badRequest.calledOnce, 'res.badRequest should be called once');
    assert.deepStrictEqual(res.badRequest.firstCall.args[0], { error: 'campo "nome" não informado' });
  });
});


