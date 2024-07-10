/**
 * AdminHomepage
 *
 * @description :: Controller para operações administrativas como renderização da página principal, obtenção dos últimos manuais, contagem de tarefas e agregação de dados por linha de montagem.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  // Método para carregar a página principal do administrador
  homepage: async function (req, res) {
    try {
      // Busca todos os manuais no banco de dados
      const manuals = await Manual.find();

      // Renderiza a view 'homepageAdmin' passando os manuais
      return res.view("pages/engineer/homepageAdmin", {
        manuals,
      });
    } catch (error) {
      // Loga o erro no console e retorna uma resposta de erro ao cliente
      console.error("Erro ao carregar a homepage do administrador:", error);
      return res.status(500).json({
        error: "Ocorreu um erro ao carregar a homepage do administrador.",
      });
    }
  },

  // Método para obter os últimos manuais publicados
  getLatestManuals: async function (req, res) {
    try {
      // Busca os manuais mais recentes, limitando a 10 resultados
      const manuals = await Manual.find()
        .sort("createdAt DESC") // Ordena pelos mais recentes
        .limit(10);

      return res.json({
        rows: manuals,
      });
    } catch (error) {
      console.error("Erro ao buscar manuais:", error);
      return res.status(500).json({
        error: "Erro ao buscar manuais",
      });
    }
  },

  // Método para obter a contagem baseada no status das tarefas
  taskStatusCount: async function (req, res) {
    try {
      // Conta o número de tarefas que estão completas (status: true)
      const completedCount = await Task.count({
        status: true,
      });

      // Conta o número de tarefas que estão pendentes (status: false)
      const pendingCount = await Task.count({
        status: false,
      });

      // Retorna uma resposta JSON com o número de tarefas completas e pendentes
      return res.json({
        completed: completedCount,
        pending: pendingCount,
      });
    } catch (error) {
      // Em caso de erro, retorna uma resposta de erro ao cliente
      return res.serverError(error);
    }
  },

  taskStatusByAssemblyLine: async function (req, res) {
    try {
      // Buscar todos os funcionários com suas linhas de montagem
      const employees = await Employee.find().populate("idAssemblyLine");

      // Obter todas as tarefas
      const tasks = await Task.find();

      const taskCounts = {};

      // Inicializar contadores para cada linha de montagem
      employees.forEach((employee) => {
        if (employee.idAssemblyLine && employee.idAssemblyLine.id) {
          const lineId = employee.idAssemblyLine.id;
          if (!taskCounts[lineId]) {
            taskCounts[lineId] = {
              linhaMontagem: employee.idAssemblyLine.name,
              tarefasFeitas: 0,
              tarefasPendentes: 0,
            };
          }
        }
      });

      // Contar tarefas por linha de montagem
      tasks.forEach((task) => {
        const employee = employees.find((e) => e.id === task.idEmployee);
        if (employee && employee.idAssemblyLine && employee.idAssemblyLine.id) {
          const lineId = employee.idAssemblyLine.id;
          if (task.status) {
            taskCounts[lineId].tarefasFeitas++;
          } else {
            taskCounts[lineId].tarefasPendentes++;
          }
        }
      });

      const data = Object.values(taskCounts);

      return res.json(data);
    } catch (error) {
      console.error("Erro ao buscar dados das tarefas:", error);
      return res.serverError(error);
    }
  },
};
