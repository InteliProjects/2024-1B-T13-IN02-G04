const assert = require("assert");
const controller = require("../../api/controllers/ManualsController");
const { mockAsync, RESPONSE, EMPLOYEE, MANUAL } = require("../utils/ManualsControllerMock");
const sinon = require("sinon");

describe("ManualsController", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("Deve retornar todos os manuais com filtros e paginação", async () => {
    const manualStub = sinon.stub(Manual.getDatastore(), "sendNativeQuery").resolves({
      rows: [MANUAL],
    });

    const req = {
      body: {
        employeeId: EMPLOYEE.id,
        filters: ["laptop"],
        sortBy: "title",
        search: "Manual",
        page: 1,
      },
    };

    const result = await controller.findAllManuals(req, RESPONSE);

    assert.strictEqual(manualStub.calledOnce, true);
    assert.strictEqual(result.rows.length, 1);
    assert.deepStrictEqual(result.rows[0], MANUAL);
  });

  it("Deve retornar os últimos manuais criados", async () => {
    const manualStub = mockAsync(controller, "find", [MANUAL]);

    const req = {};

    const result = await controller.latest(req, RESPONSE);

    assert.strictEqual(manualStub.calledOnce, true);
    assert.strictEqual(result.length, 1);
    assert.deepStrictEqual(result[0], MANUAL);
  });

  it("Deve criar um novo manual", async () => {
    const manualStub = mockAsync(Manual, "create", MANUAL);

    const req = {
      body: {
        title: "Manual Title",
        description: "Manual Description",
        hardwareType: "laptop",
      },
    };

    const res = { ...RESPONSE, statusCode: 200 };

    const result = await controller.createManual(req, res);

    assert.strictEqual(manualStub.calledOnce, true);
    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(result.message, "Manual adicionado com sucesso!");
    assert.deepStrictEqual(result.manual, MANUAL);
  });

  it("Deve visualizar um manual específico", async () => {
    const manualStub = mockAsync(Manual, "findOne", MANUAL);

    const req = {
      params: {
        id: "manual-id-123",
      },
    };

    const result = await controller.view(req, RESPONSE);

    assert.strictEqual(manualStub.calledOnce, true);
    assert.strictEqual(result.viewName, "pages/manual");
    assert.deepStrictEqual(result.data.manual, MANUAL);
  });

  it("Deve retornar erro ao buscar um manual inexistente", async () => {
    sinon.restore(); // Certifique-se de restaurar os stubs anteriores
    const manualStub = mockAsync(Manual, "findOne", null);

    const req = {
      params: {
        id: "manual-id-123",
      },
    };

    const res = { ...RESPONSE, status: sinon.stub().returnsThis() };

    const result = await controller.view(req, res);

    assert.strictEqual(manualStub.calledOnce, true);
    assert.strictEqual(res.status.calledOnceWith(404), true);
    assert.strictEqual(result.error, "Manual not found");
  });
});
