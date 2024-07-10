/**
 * LoginController
 *
 * @description :: 
 * Este controlador lida com a autenticação de funcionários. Ele verifica o e-mail e a senha fornecidos,
 * valida as credenciais e define a sessão do usuário com base no tipo de funcionário (engenheiro ou montador).
 * O resultado da autenticação é retornado ao cliente.
 * 
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  login: async function (req, res) {
    try {
      const { email, password } = req.body;

      // Faça a lógica de autenticação aqui
      const employee = await Employee.findOne({ email: email });

      req.session.isEngineer = employee.isEngineer; // Armazena do lado do servidor se o 
      // usuário é engenheiro ou não, isto é necessário porque temos um header diferente 
      // para engenheiro e montador. Esta dinamicidade é feita em ejs, e como o ejs é 
      // renderizado do lado do servidor, precisamos, do lado do servidor, saber se o 
      // usuário comum ou administrador.

      // Chama o helper com os parâmetros necessários
      const result = await sails.helpers.verifyEmailPassword.with({
        employee: employee,
        password: password,
      });

      // Se o helper retornar sucesso, envie a resposta de sucesso
      return res.json(result);
    } catch (error) {
      console.error("Erro no servidor:", error); // Log do erro detalhado
      res.status(500).json({ error: "Ocorreu um erro no servidor" });
    }
  },
};
