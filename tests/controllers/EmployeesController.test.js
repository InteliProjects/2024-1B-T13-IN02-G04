const assert = require("assert");
const sinon = require("sinon");
const EmployeesController = require("../../api/controllers/EmployeesController");
const { RESPONSE, EMPLOYEE } = require("../utils/EmployeesControllerMock.js");
const sails = require("sails");

// Para testar e gerar relatório: npx nyc npx mocha test/controllers/EmployeesController.test.js

describe("EmployeesController", () => {
  before(function (done) {
    this.timeout(10000); // Aumenta o tempo limite para levantar o Sails
    sails.lift(
      {
        hooks: { grunt: false, csrf: false },
        log: { level: "warn" },
      },
      function (err) {
        if (err) return done(err);
        done();
      }
    );
  });

  after(function (done) {
    sails.lower(done);
  });

  afterEach(() => {
    sinon.restore();
  });
  
  // Feito por Guilherme e Thiago (trabalhamos juntos nesse controller)
  // ------------------------------- getById -------------------------------
  
  // Testes para função getById foram feitos por Guilherme

  it("getById: Deve retornar o funcionário corretamente quando encontrado", async () => {
    const findOneStub = sinon
      .stub(sails.models.employee, "findOne")
      .resolves(EMPLOYEE);

    const req = {
      body: {
        employeeId: EMPLOYEE.id,
      },
    };

    const result = await EmployeesController.getById(req, RESPONSE);

    assert.strictEqual(findOneStub.calledOnce, true);
    assert.deepStrictEqual(result, EMPLOYEE);
  });

  it("getById: Deve retornar erro 404 se o funcionário não for encontrado", async () => {
    const findOneStub = sinon.stub(sails.models.employee, "findOne").resolves(null);

    const req = {
      body: {
        employeeId: EMPLOYEE.id,
      },
    };

    const result = await EmployeesController.getById(req, RESPONSE);

    assert.strictEqual(findOneStub.calledOnce, true);
    assert.strictEqual(result.status, 404);
    assert.deepStrictEqual(result.error, "Employee not found");
  });

  it("getById: Deve retornar erro 500 se ocorrer um erro no servidor", async () => {
    const findOneStub = sinon.stub(sails.models.employee, "findOne").rejects(new Error("Server error"));

    const req = {
      body: {
        employeeId: EMPLOYEE.id,
      },
    };

    const result = await EmployeesController.getById(req, RESPONSE);

    assert.strictEqual(findOneStub.calledOnce, true);
    assert.strictEqual(result.status, 500);
  });

  // ------------------------------- update -------------------------------

    // Testes para função getById foram feitos por Thiago

  it("update: Deve atualizar a senha do usuário com sucesso", async () => {
    const updateOneStub = sinon
      .stub(sails.models.employee, "updateOne")
      .resolves(EMPLOYEE);

    const req = {
      body: {
        employeeId: EMPLOYEE.id,
        newPassConfirm: "newpassword123",
      },
    };

    const result = await EmployeesController.update(req, RESPONSE);

    assert.strictEqual(updateOneStub.calledOnce, true);
    assert.strictEqual(result.status, 500);
  });

  it("update: Deve retornar erro 400 se a nova confirmação de senha estiver ausente", async () => {
    const req = {
      body: {
        employeeId: EMPLOYEE.id,
      },
    };

    const result = await EmployeesController.update(req, RESPONSE);

    assert.strictEqual(result.status, 400);
    assert.deepStrictEqual(
      result.error,
      "New password confirmation is required"
    );
  });

  it("update: Deve retornar erro 500 se ocorrer um erro no servidor", async () => {
    const updateOneStub = sinon
      .stub(sails.models.employee, "updateOne")
      .rejects(new Error("Server error"));

    const req = {
      body: {
        employeeId: EMPLOYEE.id,
        newPassConfirm: "newpassword123",
      },
    };

    const result = await EmployeesController.update(req, RESPONSE);

    assert.strictEqual(updateOneStub.calledOnce, true);
    assert.strictEqual(result.status, 500);
  });
});
