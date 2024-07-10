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

    status: {
      type: "boolean", // true se for concluída, false se não for
      required: true, // Obrigatório.
    },

    // Unix Timestamp para a data de criação
    createdAt: {
      type: "number",
      required: true,
      // Não definimos um valor padrão aqui porque vamos usar um hook
    },
  },

  // Hook para definir o Unix timestamp atual antes de criar um registro
  beforeCreate: function (valuesToSet, proceed) {
    valuesToSet.createdAt = Math.floor(Date.now() / 1000); // Unix timestamp atual
    valuesToSet.id = `${valuesToSet.idEmployee}-${valuesToSet.idManual}`;
    return proceed();
  },
};
