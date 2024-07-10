/**
 * AssemblyLinesController
 *
 * @description :: operações relacionadas a criação e listagem de linhas de montagem, com tarefas e funcionários associados.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const { v4: uuidv4 } = require("uuid");

module.exports = {
  create: async function (req, res) {
    try {
      let { name, description, employeesId, manualsId } = req.body;

      if (!name && !description && !manualsId) {
        return res.badRequest({ error: 'campo "nome" não informado' });
      }

      if (
        !employeesId ||
        !Array.isArray(employeesId) ||
        employeesId.length === 0
      ) {
        return res.badRequest({
          error: "IDs dos funcionários não informados ou inválidos",
        });
      }

      // Se manualsId não for um array, converta-o para um array
      if (!Array.isArray(manualsId)) {
        manualsId = [manualsId];
      }

      if (!manualsId || manualsId.length === 0) {
        return res.badRequest({ error: "Manuais não informados ou inválidos" });
      }

      const newLine = await AssemblyLine.create({
        id: "abc",
        name,
        description,
        createdAt: 123,
      }).fetch();

      const newLineId = newLine.id;

      const employeeupdated = await Employee.update({ id: employeesId })
        .set({ idAssemblyLine: newLineId })
        .fetch();

      const tasks = await Promise.all(
        employeesId.map(async (employeeId) => {
          return await Promise.all(
            manualsId.map(async (manualId) => {
              try {
                // Verificar se a tarefa já existe
                const existingTask = await Task.findOne({
                  idEmployee: employeeId,
                  idManual: manualId,
                });

                if (!existingTask) {
                  const task = await Task.create({
                    id: uuidv4(),
                    idEmployee: employeeId,
                    idManual: manualId,
                    status: false,
                    createdAt: Date.now(),
                  }).fetch();
                  return task;
                } else {
                  sails.log.warn(
                    `Task with employeeId ${employeeId} and manualId ${manualId} already exists.`
                  );
                  return null; // Retorna null se a tarefa já existir
                }
              } catch (error) {
                if (error.code === "E_UNIQUE") {
                  sails.log.warn(
                    `Task with employeeId ${employeeId} and manualId ${manualId} already exists.`
                  );
                  return null; // Retorna null se a tarefa já existir
                } else {
                  throw error; // Se o erro não for relacionado à unicidade, lança o erro
                }
              }
            })
          );
        })
      );


      return res.json({
        message:
          "Linha de montagem criada e funcionários atualizados com sucesso.",
        newLine: newLine,
        description: description,
        updatedEmployees: employeesId,
        manuals: manualsId,
        tasks: tasks,
      });
    } catch (error) {
      sails.log.error(error);
      return res.serverError(error);
    }
  },

  list: async (req, res) => {
    try {
      // Recebe os dados do front-end
      const sortBy = req.body.sortBy || "titleASC";
      const search = req.body.cleanSearch || "";
      const page = req.body.page || 1;
      const pageSize = 15;
      const offset = (page - 1) * pageSize;

      // Adiciona o valor de pesquisa (caso haja) à query
      let whereClause = "";
      if (search) {
        whereClause = `WHERE assemblyLine."name" ILIKE '%${search}%' OR assemblyLine.description ILIKE '%${search}%'`;
      }

      // String de ordenação
      let orderByClause = `ORDER BY`;

      // Adiciona à string de ordenação as ordenações (caso tenham sido feitas)
      if (sortBy === "titleDESC") {
        orderByClause += ` assemblyLine.name DESC,`;
      } else if (sortBy === "createdAtDESC") {
        orderByClause += ` assemblyLine."createdAt" DESC,`;
      } else if (sortBy === "createdAtASC") {
        orderByClause += ` assemblyLine."createdAt" ASC,`;
      } else if (sortBy === "employeesDESC") {
        orderByClause += ` employeeQtd DESC,`;
      } else if (sortBy === "employeesASC") {
        orderByClause += ` employeeQtd ASC,`;
      } else if (sortBy === "manualsDESC") {
        orderByClause += ` manualsQtd DESC,`;
      } else if (sortBy === "manualsASC") {
        orderByClause += ` manualsQtd ASC,`;
      }

      // Fallback para ordenação por título
      orderByClause += ` assemblyLine.name ASC`;

      // Concatenação da Query com as variáveis que filtram, paginam, ordenam e pesquisam:
      const query = `
       SELECT
            assemblyLine.id,
            assemblyLine."name",
            assemblyLine.description,
            COUNT(DISTINCT employee.id) AS employeeQtd,
            COUNT(DISTINCT manual.id) AS manualsQtd
        FROM
            assemblyline assemblyLine
        LEFT JOIN
            employee employee ON assemblyLine.id = employee."idAssemblyLine"
        LEFT JOIN
            task task ON employee.id = task."idEmployee"
        LEFT JOIN
            manual manual ON task."idManual" = manual.id
        ${whereClause} 
        GROUP BY
            assemblyLine.id
        ${orderByClause} 
        LIMIT
            ${pageSize} OFFSET ${offset};
        `;

      const allLines = await AssemblyLine.getDatastore().sendNativeQuery(query);

      return res.status(200).json(allLines);
    } catch (error) {
      console.error(error);
      return res.serverError(error);
    }
  },

  getManualsAndEmployees: async function (req, res) {
    try {
      // Busca todos os manuais e funcionários
      const manuals = await Manual.find();
      const employees = await Employee.find();

      // Renderiza a view 'newAssemblyLine.ejs' passando os manuais e funcionários
      return res.view("pages/engineer/newAssemblyLine", {
        manuals: manuals,
        employees: employees,
      });
    } catch (error) {
      return res.serverError(error);
    }
  },
};
