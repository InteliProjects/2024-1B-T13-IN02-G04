/**
 * ManualsController
 *
 * @description :: Controller para gerenciar materiais que são incluidos dentro de manuais.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  createMaterialAndManual: async function (req, res) {
    try {
      // Extrai os dados do corpo da requisição
      const { title, description, hardwareType, link } = req.body;

      // Valida os dados de entrada
      if (!title || !description || !hardwareType || !link) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
      }

      // Determina o tipo do arquivo com base na extensão do link fornecido
      let type = '';
      if (link.endsWith('.pdf')) {
        type = 'pdf';
      } else if (link.endsWith('.mp4')) {
        type = 'vid';
      } else if (link.endsWith('.png') || link.endsWith('.jpg')) {
        type = 'img';
      } else if (link.endsWith('.stp')) {
        type = '3d';
      } else {
        type = 'other';
      }

      // Chama o controlador ManualsController para criar um novo manual
      const ManualsController = require('./ManualsController');
      const newManual = await ManualsController.createManual(req, res, true);

      // Cria o novo material e associa-o ao manual criado
      const newMaterial = await Material.create({
        link,
        type,
        idManual: newManual.id,
        id: "abc" // Id fictício, provavelmente será substituído por um gerado automaticamente
      }).fetch();
      return res.redirect('/engenheiro/'); // Redireciona para a página do engenheiro após criar o material e o manual
    } catch (error) {
      // Em caso de erro, loga o erro e retorna uma resposta de erro
      console.error(error);
      return res.status(500).json({ error: 'Erro ao adicionar Material e Manual novos!' });
    }
  },
  
  getMaterials: async function (req, res) {
    try {
      const manualId = req.query.id; // Obtém o ID do manual a partir dos parâmetros de consulta

      if (!manualId) {
        return res.status(400).json({ error: 'manualId é obrigatório.' });
      }

      const materials = await Material.find({ idManual: manualId }); // Busca materiais associados ao manual

      if (!materials || materials.length === 0) {
        return res.status(404).json({ error: 'Nenhum material encontrado para este manual.' });
      }

      return res.json(materials); // Retorna os materiais encontrados
    } catch (error) {
      console.error('Erro ao buscar os materiais:', error);
      return res.status(500).json({ error: 'Erro ao buscar os materiais.' }); // Em caso de erro, retorna uma resposta de erro
    }
  }
};
