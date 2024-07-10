// api/helpers/validation.js

module.exports = {
  friendlyName: 'Validação',

  description: 'Validar e processar dados para criação de material e manual.',

  inputs: {
    title: {
      type: 'string',
      required: true,
      description: 'O título do manual'
    },
    description: {
      type: 'string',
      required: true,
      description: 'A descrição do manual'
    },
    hardwareType: {
      type: 'string',
      required: true,
      description: 'O tipo de hardware relacionado ao manual'
    },
    link: {
      type: 'string',
      required: true,
      description: 'O link para o material'
    }
  },

  exits: {
    success: {
      description: 'Todos os dados são válidos e processados.'
    },
    invalidInput: {
      description: 'Dados de entrada inválidos.'
    }
  },

  fn: async function (inputs, exits) {
    try {
      const { title, description, hardwareType, link } = inputs;

      // Array para armazenar mensagens de erro
      const errors = [];

      // Verifica se cada campo obrigatório foi fornecido
      if (!title) {
        errors.push('O título é obrigatório.');
      }
      if (!description) {
        errors.push('A descrição é obrigatória.');
      }
      if (!hardwareType) {
        errors.push('O tipo de hardware é obrigatório.');
      }
      if (!link) {
        errors.push('O link é obrigatório.');
      }

      // Verifica se houve erro específico antes de adicionar a mensagem de erro padrão
      const isOnlyNumbersRegex = /^\d+$/;
      if (isOnlyNumbersRegex.test(title) || isOnlyNumbersRegex.test(description) || isOnlyNumbersRegex.test(hardwareType) || isOnlyNumbersRegex.test(link)) {
        errors.push('Os campos não podem conter apenas números.');
      }

      // 2.3. Validação de extensão de arquivo
      const validExtensions = ['.pdf', '.mp4', '.doc', '.txt', '.docx'];
      const linkIsValid = validExtensions.some(ext => link.trim().endsWith(ext));
      if (!linkIsValid) {
        errors.push('O link deve terminar com uma das seguintes extensões: .pdf, .mp4, .doc, .txt, .docx.');
      }

      // Verifica se há erros e lança uma exceção
      if (errors.length > 0) {
        throw { error: errors.join(' ') };
      }

      // Retorna os dados validados e processados
      return exits.success({
        title: title.trim(),
        description: description.trim(),
        hardwareType: hardwareType.trim(),
        link: link.trim()
      });
    } catch (error) {
      // Em caso de erro, lança uma exceção com uma mensagem informativa
      return exits.invalidInput({ error: error.error || 'Erro ao validar e processar os dados do formulário.' });
    }
  }
};
