/**
 * HomepageController
 *
 * @description :: obtenção de manuais relacionados a tarefas pendentes, manuais favoritados e últimos manuais acessados.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getTasks: async function (req, res) {
    try {
      // Lógica para obter os manuais pendentes
      const query = `
        SELECT
            manual.title,
            manual.id,
            manual.description,
            manual."hardwareType",
            task.status,
            MAX(task."createdAt") AS createdAt,
            STRING_AGG(DISTINCT material.type, ', ') AS materialTypes,
            (SELECT COUNT(*) > 0
             FROM favorite
             WHERE favorite."idEmployee" = '${req.body.employeeId}'
               AND favorite."idManual" = manual.id) AS isFavorited
        FROM
            manual
        INNER JOIN
            task ON manual.id = task."idManual"
        LEFT JOIN
            material ON manual.id = material."idManual"
        WHERE
            task."idEmployee" = '${req.body.employeeId}'
        GROUP BY
            manual.id,
            manual.title,
            manual.description,
            manual."hardwareType",
            task.status
        ORDER BY
            createdAt DESC,
            task.status ASC
        LIMIT 20;
      `;

      
      const tasks = await Employee.getDatastore().sendNativeQuery(query);

      return res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return res.status(500).json({ error: "Error fetching tasks" });
    }
  },

  getFavorites: async function (req, res) {
    try {
      // Lógica para obter os manuais favoritados
      const query = `
        SELECT
            manual.title,
            manual.id,
            manual.description,
            manual."hardwareType",
            MAX(favorite."createdAt") AS createdAt,
            STRING_AGG(DISTINCT material.type, ', ') AS materialTypes,
            CASE
                WHEN MAX(CASE WHEN task.status IS NOT NULL THEN task.status::int ELSE NULL END) = 1 THEN true
                WHEN MAX(CASE WHEN task.status IS NOT NULL THEN task.status::int ELSE NULL END) = 0 THEN false
                ELSE NULL
            END AS status
        FROM
            manual
        INNER JOIN
            favorite ON manual.id = favorite."idManual"
        LEFT JOIN
            task ON manual.id = task."idManual" AND favorite."idEmployee" = task."idEmployee"
        LEFT JOIN
            material ON manual.id = material."idManual"
        WHERE
            favorite."idEmployee" = '${req.body.employeeId}'
        GROUP BY
            manual.id,
            manual.title,
            manual.description,
            manual."hardwareType"
        ORDER BY
            createdAt DESC
        LIMIT 20;
      `;

      const favorites = await Employee.getDatastore().sendNativeQuery(query);
      
      return res.json(favorites);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      return res.status(500).json({ error: "Error fetching favorites" });
    }
  },

  getLastAccessed: async function (req, res) {
    try {
      // Lógica para obter os últimos manuais acessados
      const query = `
        SELECT
            manual.title,
            manual.id,
            manual.description,
            manual."hardwareType",
            MAX(accessHistory."accessDate") AS accessDate,
            STRING_AGG(DISTINCT material.type, ', ') AS materialTypes,
            CASE
                WHEN favorite."idManual" IS NOT NULL THEN true
                ELSE false
            END AS isFavorited,
            CASE
                WHEN task.status IS NOT NULL THEN task.status
                ELSE NULL
            END AS status
        FROM
            manual
        INNER JOIN
            accessHistory ON manual.id = accessHistory."idManual"
        LEFT JOIN
            material ON manual.id = material."idManual"
        LEFT JOIN
            favorite ON manual.id = favorite."idManual" AND accessHistory."idEmployee" = favorite."idEmployee"
        LEFT JOIN
            task ON manual.id = task."idManual" AND accessHistory."idEmployee" = task."idEmployee"
        WHERE
            accessHistory."idEmployee" = '${req.body.employeeId}'
        GROUP BY
            manual.id,
            manual.title,
            manual.description,
            manual."hardwareType",
            favorite."idManual",
            task.status
        ORDER BY
            accessDate DESC
        LIMIT 20;
      `;

      const lastAccessed = await Employee.getDatastore().sendNativeQuery(query);

      return res.json(lastAccessed);
    } catch (error) {
      console.error("Error fetching last accessed manuals:", error);
      return res
        .status(500)
        .json({ error: "Error fetching last accessed manuals" });
    }
  },
};
