const sinon = require('sinon'); // Biblioteca para criar mocks, stubs e spies
const assert = require('assert'); // Biblioteca para fazer asserções nos testes
const supertest = require('supertest'); // Biblioteca para testar APIs HTTP

describe('AdminHomepagesController', () => {
  // Testes para o método homepage do AdminHomepagesController
  describe('#homepage()', () => {
    it('renderiza a página do admin com os manuais', async () => {
      // Mock do modelo Manual
      const Manual = {
        find: sinon.stub().resolves([
          { title: 'Manual 1', description: 'Desc 1', hardwareType: 'Type 1' },
          { title: 'Manual 2', description: 'Desc 2', hardwareType: 'Type 2' }
        ])
      };

      // Mock dos objetos req e res
      const req = {};
      const res = {
        view: sinon.spy(), // Espião para monitorar chamadas ao método view
        status: sinon.stub().returnsThis(), // Stub para o método status
        json: sinon.spy() // Espião para monitorar chamadas ao método json
      };

      // Substitui o Manual global pelo mock
      global.Manual = Manual;

      // Chama o método homepage do controller
      const AdminHomepagesController = require('../../api/controllers/AdminHomepagesController');
      await AdminHomepagesController.homepage(req, res);

      // Verifica se o método view foi chamado corretamente
      assert(res.view.calledOnce); // Verifica se o método view foi chamado uma vez
      assert(res.view.firstCall.args[0], 'pages/homepageAdmin'); // Verifica o primeiro argumento da chamada
      assert.deepEqual(res.view.firstCall.args[1], { // Verifica o segundo argumento da chamada
        manuals: [
          { title: 'Manual 1', description: 'Desc 1', hardwareType: 'Type 1' },
          { title: 'Manual 2', description: 'Desc 2', hardwareType: 'Type 2' }
        ]
      });

      // Restaura o modelo Manual original
      delete global.Manual;
    });

    it('lida com erros corretamente', async () => {
      // Mock do modelo Manual para lançar um erro
      const Manual = {
        find: sinon.stub().rejects(new Error('Database error'))
      };

      // Mock dos objetos req e res
      const req = {};
      const res = {
        view: sinon.spy(), // Espião para monitorar chamadas ao método view
        status: sinon.stub().returnsThis(), // Stub para o método status
        json: sinon.spy() // Espião para monitorar chamadas ao método json
      };

      // Substitui o Manual global pelo mock
      global.Manual = Manual;

      // Suprime o console.error durante este teste
      const originalConsoleError = console.error;
      console.error = () => {};

      // Chama o método homepage do controller
      const AdminHomepagesController = require('../../api/controllers/AdminHomepagesController');
      await AdminHomepagesController.homepage(req, res);

      // Restaura console.error
      console.error = originalConsoleError;

      // Verifica se os métodos status e json foram chamados corretamente
      assert(res.status.calledOnce); // Verifica se o método status foi chamado uma vez
      assert(res.status.firstCall.args[0], 500); // Verifica o argumento da chamada
      assert(res.json.calledOnce); // Verifica se o método json foi chamado uma vez
      assert.deepEqual(res.json.firstCall.args[0], { // Verifica o argumento da chamada
        error: 'Ocorreu um erro ao carregar a homepage do administrador.'
      });

      // Restaura o modelo Manual original
      delete global.Manual;
    });
  });

  // Testes para o método getLatestManuals do AdminHomepagesController
  describe('#getLatestManuals()', () => {
    it('deve retornar os últimos manuais', async () => {
      // Mock do modelo Manual
      const Manual = {
        getDatastore: () => ({
          sendNativeQuery: sinon.stub().resolves({
            rows: [
              { title: 'Manual A', description: 'Desc A', hardwareType: 'Type A', materialTypes: 'Type 1, Type 2' },
              { title: 'Manual B', description: 'Desc B', hardwareType: 'Type B', materialTypes: 'Type 3' }
            ]
          })
        })
      };

      // Mock dos objetos req e res
      const req = {};
      const res = {
        json: sinon.spy(), // Espião para monitorar chamadas ao método json
        status: sinon.stub().returnsThis() // Stub para o método status
      };

      // Substitui o Manual global pelo mock
      global.Manual = Manual;

      // Chama o método getLatestManuals do controller
      const AdminHomepagesController = require('../../api/controllers/AdminHomepagesController');
      await AdminHomepagesController.getLatestManuals(req, res);

      // Verifica se o método json foi chamado corretamente
      assert(res.json.calledOnce); // Verifica se o método json foi chamado uma vez
      assert.deepEqual(res.json.firstCall.args[0], { // Verifica o argumento da chamada
        rows: [
          { title: 'Manual A', description: 'Desc A', hardwareType: 'Type A', materialTypes: 'Type 1, Type 2' },
          { title: 'Manual B', description: 'Desc B', hardwareType: 'Type B', materialTypes: 'Type 3' }
        ]
      });

      // Restaura o modelo Manual original
      delete global.Manual;
    });

    it('lida com erros corretamente', async () => {
      // Mock do modelo Manual para lançar um erro
      const Manual = {
        getDatastore: () => ({
          sendNativeQuery: sinon.stub().rejects(new Error('Database error'))
        })
      };

      // Mock dos objetos req e res
      const req = {};
      const res = {
        json: sinon.spy(), // Espião para monitorar chamadas ao método json
        status: sinon.stub().returnsThis() // Stub para o método status
      };

      // Substitui o Manual global pelo mock
      global.Manual = Manual;

      // Suprime o console.error durante este teste
      const originalConsoleError = console.error;
      console.error = () => {};

      // Chama o método getLatestManuals do controller
      const AdminHomepagesController = require('../../api/controllers/AdminHomepagesController');
      await AdminHomepagesController.getLatestManuals(req, res);

      // Restaura console.error
      console.error = originalConsoleError;

      // Verifica se os métodos status e json foram chamados corretamente
      assert(res.status.calledOnce); // Verifica se o método status foi chamado uma vez
      assert(res.status.firstCall.args[0], 500); // Verifica o argumento da chamada
      assert(res.json.calledOnce); // Verifica se o método json foi chamado uma vez
      assert.deepEqual(res.json.firstCall.args[0], { // Verifica o argumento da chamada
        error: 'Error fetching latest manuals'
      });

      // Restaura o modelo Manual original
      delete global.Manual;
    });
  });
});
