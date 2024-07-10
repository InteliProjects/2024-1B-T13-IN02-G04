/**
 * ManualsController
 *
 * @description :: Controller para gerenciar o perfil dos usuários.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    getEmployeeInfo: async function (req, res) {
        try {
          const employee = await Employee.findOne({ id: req.body.employeeId }); // ID para efeito de exemplo
    
          // Equivale a:
          /* 
            SELECT "name", email, "password"
            FROM employee
            WHERE id = 1;
          */
    
          if (!employee) {
            return res.notFound({ error: "Employee not found" });
          }
          return res.json(employee);
        } catch (err) {
          return res.serverError(err);
        }
      },
    
      updatePass: async function (req, res) {
        try {
          //const id = req.session.userId; // Supondo que o ID do usuário está na sessão
          const updates = req.body;
    
          if (!updates.newPassConfirm) {
            return res.badRequest({
              error: "New password confirmation is required",
            });
          }
    
          const updatedEmployee = await Employee.updateOne({ id: req.body.employeeId }).set({
            password: updates.newPassConfirm,
          });
    
          // Equivale a:
          /*
            UPDATE public.employee
            SET "password" = 'nova senha'
            WHERE id = sessionStorage.employeeId; -- ID de exemplo
          */
    
          if (!updatedEmployee) {
            return res.notFound({ error: "Employee not found" });
          }
    
          return res.json(updatedEmployee);
        } catch (err) {
          return res.serverError(err);
        }
      },
};

