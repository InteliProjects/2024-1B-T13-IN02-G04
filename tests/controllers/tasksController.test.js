// Importa as bibliotecas necessárias
const sinon = require('sinon'); // Utilizado para criar stubs, spies e mocks
const assert = require('assert'); // Utilizado para asserções nos testes
const supertest = require('supertest'); // Utilizado para testar endpoints HTTP

// Define a suíte de testes para o TasksController
describe('TasksController', () => {
  // Define uma sub-suíta de testes para o método getTaskStatus
  describe('#getTaskStatus()', () => {
    // Define um teste para verificar se o método retorna o número correto de tarefas completas e pendentes
    it('deve retornar o número correto de tasks feitas e pendentes', async () => {
      // Mock do modelo Task
      const Task = {
        count: sinon.stub() // Cria um stub para o método count
      };

      // Define os retornos simulados para os métodos count
      Task.count.withArgs({ status: true }).resolves(5); // Simula que existem 5 tarefas completas
      Task.count.withArgs({ status: false }).resolves(3); // Simula que existem 3 tarefas pendentes

      // Mock dos objetos req e res
      const req = {}; // Mock do objeto de requisição (request)
      const res = {
        json: sinon.spy(), // Cria um spy para o método json do objeto de resposta (response)
        serverError: sinon.spy() // Cria um spy para o método serverError do objeto de resposta
      };

      // Substitui o modelo Task global pelo nosso mock
      global.Task = Task;

      // Importa o controlador de tarefas
      const TasksController = require('../../api/controllers/TasksController');
      // Chama o método getTaskStatus do controlador
      await TasksController.getTaskStatus(req, res);

      // Verifica se res.json foi chamado com os argumentos corretos
      assert(res.json.calledOnce); // Verifica se json foi chamado uma vez
      assert.deepEqual(res.json.firstCall.args[0], {
        completed: 5, // Verifica se o número de tarefas completas é 5
        pending: 3 // Verifica se o número de tarefas pendentes é 3
      });

      // Remove o mock global do Task
      delete global.Task;
    });

    // Define um teste para verificar se o método lida corretamente com erros
    it('deve lidar com os erros', async () => {
      // Mock do modelo Task para lançar um erro
      const Task = {
        count: sinon.stub().rejects(new Error('Database error')) // Simula um erro no método count
      };

      // Mock dos objetos req e res
      const req = {}; // Mock do objeto de requisição (request)
      const res = {
        json: sinon.spy(), // Cria um spy para o método json do objeto de resposta (response)
        serverError: sinon.spy() // Cria um spy para o método serverError do objeto de resposta
      };

      // Substitui o modelo Task global pelo nosso mock
      global.Task = Task;

      // Importa o controlador de tarefas
      const TasksController = require('../../api/controllers/TasksController');
      // Chama o método getTaskStatus do controlador
      await TasksController.getTaskStatus(req, res);

      // Verifica se res.serverError foi chamado
      assert(res.serverError.calledOnce); // Verifica se serverError foi chamado uma vez
      assert(res.serverError.firstCall.args[0] instanceof Error); // Verifica se o argumento é uma instância de Error
      assert.strictEqual(res.serverError.firstCall.args[0].message, 'Database error'); // Verifica se a mensagem do erro é 'Database error'

      // Remove o mock global do Task
      delete global.Task;
    });
  });
});
