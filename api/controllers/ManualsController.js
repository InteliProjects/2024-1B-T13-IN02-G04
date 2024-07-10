/**
 * ManualsController
 *
 * @description :: Controller para gerenciar manuais, incluindo criação, atualização, visualização, conclusão e favoritação.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getManual: async function (req, res) {
    try {
      // Buscar o manual no banco de dados pelo ID
      const manualId = req.query.id;
      const manual = await Manual.findOne({ id: manualId });
      // Verifica se o manual foi encontrado
      if (!manual) {
        return res.status(404).json({ error: "Manual não encontrado" });
      }

      // Enviar os dados do manual como resposta JSON
      return res.json(manual);
    } catch (error) {
      console.error("Erro no servidor:", error); // Log do erro detalhado
      res.status(500).json({ error: "Ocorreu um erro no servidor" });
    }
  },

  updateManual: async function (req, res) {
    try {
      const { title, description, hardwareType, materials } = req.body;
      const manualId = req.query.id;

      // Verifica se o manualId foi fornecido
      if (!manualId) {
        return res.status(400).json({ error: "O ID do manual é necessário" });
      }

      // Atualizar o manual no banco de dados
      const updatedManual = await Manual.updateOne({ id: manualId }).set({
        title: title,
        description: description,
        hardwareType: hardwareType,
      });

      // Verifica se o manual foi atualizado
      if (!updatedManual) {
        return res.status(404).json({ error: "Manual não encontrado" });
      }

      // Remover materiais antigos associados ao manual
      await Material.destroy({ idManual: manualId });

      // Inserir novos materiais, associando-os ao manual
      if (materials && materials.length > 0) {
        const newMaterials = materials.map((material) => ({
          idManual: manualId,
          link: material.link,
          type: material.type,
          id: "abc",
        }));
        await Material.createEach(newMaterials);
      }

      // Enviar uma resposta de sucesso
      return res.json({
        message: "Manual atualizado com sucesso",
        manual: updatedManual,
      });
    } catch (error) {
      console.error("Erro no servidor:", error); // Log do erro detalhado
      res.status(500).json({ error: "Ocorreu um erro no servidor" });
    }
  },

  createManual: async function (req, res, internalCall = false) {
    try {
      // Extrai os dados do corpo da requisição
      const { title, description, hardwareType, link } = req.body; // Adicione o campo 'link' aqui também

      // Valida os dados de entrada
      if (!title || !description || !hardwareType || !link) {
        return res
          .status(400)
          .json({ error: "Todos os campos são obrigatórios." });
      }

      // Cria um novo manual com os dados fornecidos
      const newManual = await Manual.create({
        title,
        description,
        hardwareType,
        link, // Adicione o campo 'link' aqui também
        id: "abc",
        createdAt: 123,
      }).fetch();

      // Se a função foi chamada internamente por outro controlador, retorne o manual criado
      if (internalCall) {
        return newManual;
      }

      // Caso contrário, retorne a resposta padrão com status 201 e o manual criado
      return res
        .status(201)
        .json({ message: "Manual adicionado com sucesso!", manual: newManual });
    } catch (error) {
      // Em caso de erro, loga o erro e retorna uma resposta de erro com status 500
      console.error(error);
      return res.status(500).json({ error: "Erro ao adicionar manual." });
    }
  },

  view: async function (req, res) {
    try {
      const idEmployee = req.query.user;
      const idManual = req.params.id;

      // Buscar todos os históricos de acesso para este usuário e este manual
      const existingHistories = await AccessHistory.find({
        idEmployee: idEmployee,
        idManual: idManual,
      });

      // Se existirem registros, apagá-los
      if (existingHistories.length > 0) {
        const idsToDelete = existingHistories.map((history) => history.id);
        await AccessHistory.destroy({ id: idsToDelete });
      }

      // Registra o histório de acesso
      await AccessHistory.create({
        id: "abc", // Será substituído pela função do model
        idEmployee: idEmployee,
        idManual: idManual,
        accessDate: 123, // Será substituído pela função do model
      });

      // Buscar se o manual está favoritado
      const existingFavorite = await Favorite.findOne({
        idEmployee: idEmployee,
        idManual: idManual,
      });

      const manual = await Manual.findOne({ id: idManual }).populate(
        "materials"
      );

      existingFavorite
        ? (manual.isFavorited = true)
        : (manual.isFavorited = false); // passar um atributo para informar se o manual está favoritado

      if (!manual) {
        return res.notFound("Manual not found");
      }

      return res.view("pages/manual", { manual: manual });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao visualizar manual" });
    }
  },

  conclude: async function (req, res) {
    try {
      const idEmployee = req.body.idEmployee;
      const idManual = req.body.idManual;

      // Buscar a tarefa existente para este usuário e este manual
      const existingTask = await Task.findOne({
        idEmployee: idEmployee,
        idManual: idManual,
      });

      // Se existir, atualizar o status para true
      if (existingTask) {
        await Task.updateOne({ id: existingTask.id }).set({ status: true });
      } else {
        // Armazena o manual como tarefa e o registra como feito
        await Task.create({
          id: "abc", // Será substituído pela função do model
          createdAt: 123, // Será substituído pela função do model
          idEmployee: idEmployee,
          idManual: idManual,
          status: true, // Marcando a tarefa como concluída
        });
      }

      return res.json({ message: "Tarefa concluída com sucesso!" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao concluir o manual!" });
    }
  },

  favorite: async function (req, res) {
    try {
      const idEmployee = req.body.idEmployee;
      const idManual = req.body.idManual;

      // Buscar se o manual está favoritado
      const existingFavorite = await Favorite.findOne({
        idEmployee: idEmployee,
        idManual: idManual,
      });

      // Se estiver, desfavoritar
      if (existingFavorite) {
        await Favorite.destroy({ id: existingFavorite.id });
      } else {
        // Armazena o manual na tabela de favoritos
        await Favorite.create({
          id: "abc", // Será substituído pela função do model
          createdAt: 123, // Será substituído pela função do model
          idEmployee: idEmployee,
          idManual: idManual,
        });
      }

      return res.json({ message: "Manual favoritado sucesso!" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao concluir o manual!" });
    }
  },
};
