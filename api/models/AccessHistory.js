const { v4: uuidv4 } = require("uuid"); // Importa a depenência que gera chaves únicas para cada registro

module.exports = {
  attributes: {
    id: {
      type: "string",
      unique: true,
      required: true,
    },

    idEmployee: {
      model: "employee",
      required: true,
    },

    idManual: {
      model: "manual",
      required: true,
    },

    accessDate: {
      type: "number",
      required: true,
      // Não definimos um valor padrão aqui porque vamos usar um hook
    },
  },

  // Hook para definir o Unix timestamp atual antes de criar um registro
  beforeCreate: function (valuesToSet, proceed) {
    valuesToSet.accessDate = Math.floor(Date.now() / 1000); // Unix timestamp atual
    valuesToSet.id = uuidv4();
    return proceed();
  },
};
