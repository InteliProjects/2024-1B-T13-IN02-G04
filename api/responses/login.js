// api/responses/login.js
module.exports = function login(inputs) {
    inputs = inputs || {};
  
    // Acessa `req` e `res`
    var req = this.req;
    var res = this.res;
  
    // Procura o funcionário
    Employee.attemptLogin({
      email: inputs.email, // Email fornecido nos inputs
      password: inputs.password // Senha fornecida nos inputs
    }, function (err, employee) {
      if (err) return res.negotiate(err); // Negocia erros
      if (!employee) {
        if (req.wantsJSON || !inputs.invalidRedirect) {
          return res.badRequest('Combinação inválida de nome de usuário/senha.');
        }
        return res.redirect(inputs.invalidRedirect); // Redireciona para a página de login em caso de falha
      }
  
      // "Lembre-se" do funcionário na sessão
      req.session.me = employee.id; // Armazena o ID do funcionário na sessão
  
      if (req.wantsJSON || !inputs.successRedirect) {
        return res.ok(); // Resposta de sucesso se for um pedido JSON
      }
      return res.redirect(inputs.successRedirect); // Redireciona para a página inicial em caso de sucesso
    });
  };
  