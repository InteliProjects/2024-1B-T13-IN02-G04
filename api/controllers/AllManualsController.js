/**
 * AllManualsController
 *
 * @description :: Controlador para operações de visualização e filtragem de manuais.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  index: async function (req, res) {
    return res.view("pages/allManuals", { filter: "none" });
  },

  favorites: async function (req, res) {
    return res.view("pages/allManuals", { filter: "favorites" });
  },

  tasks: async function (req, res) {
    return res.view("pages/allManuals", { filter: "tasks" });
  },

  search: async function (req, res) {
    return res.view("pages/allManuals", { filter: "search" });
  },

  findAllManuals: async function (req, res) {
    try {
      // Recebe os dados do front-end
      const employeeId = req.body.employeeId;
      const filters = req.body.filters || [];
      const sortBy = req.body.sortBy || "title";
      const search = req.body.cleanSearch || "";
      const page = req.body.page || 1;
      const pageSize = 15;
      const offset = (page - 1) * pageSize;

      let whereClause = ``; // String em que será iterada as restrições caso filtros e pesquisas sejam aplicadas

      // Constrói cláusula WHERE dinamicamente com base nos filtros
      if (filters.includes("tasks")) {
        whereClause += ` AND task.status IS NOT NULL`;
      }
      if (filters.includes("favorites")) {
        whereClause += ` AND favorite.id IS NOT NULL`;
      }

      // Filtrando por tipos de hardware
      const hardwareTypes = [
        "laptop",
        "workstation",
        "storage",
        "server",
        "desktop",
        "accessory",
        "monitor",
      ];

      // A partir dos tipos de hardwares existentes listados acima, constroi um novo array somente com aqueles selecionados no frontend.
      const selectedHardwareTypes = hardwareTypes.filter((type) =>
        filters.includes(type)
      );

      if (selectedHardwareTypes.length) {
        // Se foi aplicado o filtro por tipo de hardware, adiciona mais restrições ao WHERE
        whereClause += ` AND manual."hardwareType" IN (${selectedHardwareTypes
          .map((type) => `'${type}'`)
          .join(", ")}) `;
      }

      // Adiciona o valor de pesquisa (caso haja) à query
      if (search) {
        whereClause += ` AND (manual.title ILIKE '%${search}%' OR manual.description ILIKE '%${search}%')`;
      }

      // String de ordenação
      let orderByClause = `ORDER BY`;

      // Adiciona à string de ordenação as ordenações (caso tenham sido feitas)
      if (sortBy === "lastAccessed") {
        orderByClause += ` AccessHistory."accessDate" DESC,`;
      } else if (sortBy === "status") {
        orderByClause += ` task.status ASC,`;
      } else if (sortBy === "createdAt") {
        orderByClause += ` manual."createdAt" DESC,`;
      }

      // Fallback para ordenação por título
      orderByClause += ` manual.title ASC`;

      // Concatenação da Query com as variáveis que filtram, paginam, ordenam e pesquisam:
      const query = `
        SELECT DISTINCT
            manual.ID AS manual_id,
            manual.title,
            manual.description,
            manual."hardwareType",
            task.status AS task_status,
            favorite.id AS favorite_id,
            AccessHistory."accessDate" AS last_access_time,
            STRING_AGG(DISTINCT material.type, ', ' ORDER BY material.type) AS materialTypes,
            manual."createdAt"
        FROM
            manual
        LEFT JOIN
            task ON manual.ID = task."idManual"  AND task."idEmployee" = '${employeeId}'
        LEFT JOIN
            favorite ON manual.ID = favorite."idManual"  AND favorite."idEmployee" = '${employeeId}'
        LEFT JOIN
            AccessHistory ON manual.ID = AccessHistory."idManual" AND AccessHistory."idEmployee" = '${employeeId}'
        LEFT JOIN
            material ON manual.ID = material."idManual"
        WHERE 2=2 ${whereClause} 
        GROUP BY
            manual.ID,
            manual.title,
            manual.description,
            manual."hardwareType",
            task.status,
            favorite.id,
            AccessHistory."accessDate"
        ${orderByClause} 
        LIMIT 
            ${pageSize} OFFSET ${offset};
      `;
      
      const allManuals = await Manual.getDatastore().sendNativeQuery(query);

      return res.status(200).json(allManuals);
    } catch (error) {
      console.error("Error fetching pendencies:", error);
      return res.status(500).json({ error: "Error fetching pendencies" });
    }
  },
};
