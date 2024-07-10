const { v4: uuidv4 } = require("uuid"); // Importa a depenência que gera chaves únicas para cada registro

module.exports = {
  attributes: {
    id: {
      type: "string",
      unique: true,
      required: true,
    },

    name: {
      type: "string", // Define o tipo do atributo como string.
      maxLength: 50, // Máximo de 50 caracteres.
      required: true, // Obrigatório.
      unique: true,
    },

    description: {
      type: "string",
      maxLength: 250,
      required: false,
    },

    // Unix Timestamp para a data de criação
    createdAt: {
      type: "number",
      required: true,
      // Não definimos um valor padrão aqui porque vamos usar um hook
    },

    // ---------- Relação com outra tabela ----------

    // Relacionamento 1 pra n com Employee
    employee: {
      collection: "employee",
      via: "idAssemblyLine",
    },
  },

  // Hook para definir o Unix timestamp atual antes de criar um registro
  beforeCreate: function (valuesToSet, proceed) {
    valuesToSet.createdAt = Math.floor(Date.now() / 1000); // Unix timestamp atual
    valuesToSet.id = uuidv4();
    return proceed();
  },
};
