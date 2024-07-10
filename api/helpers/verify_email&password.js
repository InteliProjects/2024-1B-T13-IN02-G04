// api/helpers/verify-email-password.js
module.exports = {
  friendlyName: "Validar email e senha",
  description: "Retorna a validação do email e da senha",

  inputs: {
    employee: {
      type: 'ref',
      required: true
    },
    password: {
      type: 'string',
      required: true
    }
  },

  exits: {
    success: {
      description: 'Login bem-sucedido.',
    },
    invalidCredentials: {
      description: 'Credenciais inválidas.',
    }
  },

  fn: async function (inputs, exits) {
    const { employee, password } = inputs;

    if (!employee) {
      console.log('Nenhum empregado encontrado com este email');
      return exits.invalidCredentials({ error: 'Credenciais inválidas' });
    }

    if (employee.password !== password) {
      console.log('Senha inválida');
      return exits.invalidCredentials({ error: 'Credenciais inválidas' });
    }

    // Se a autenticação for bem-sucedida, retorne uma resposta de sucesso
    return exits.success({ message: 'Login bem-sucedido', employee: employee });
  }
};
