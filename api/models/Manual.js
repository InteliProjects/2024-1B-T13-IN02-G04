const { v4: uuidv4 } = require("uuid"); // Importa a depenência que gera chaves únicas para cada registro

module.exports = {
  attributes: {
    id: {
      type: "string",
      unique: true,
      required: true,
    },

    // Atributo que guarda a descrição do manual.
    description: {
      type: "string", // Tipo: string.
      maxLength: 250, // Máximo de caracteres: 250.
      required: true, // Obrigatório.
    },

    // Atributo que guarda o título do manual.
    title: {
      type: "string", // Tipo: string.
      maxLength: 80, // Máximo de caracteres: 80.
      required: true, // Obrigatório.
    },

    // Atributo que guarda o tipo de hardware do manual.
    hardwareType: {
      type: "string", // Tipo: string.
      isIn: [
        "laptop",
        "workstation",
        "storage",
        "server",
        "desktop",
        "accessory",
        "monitor",
        "other",
      ], // Valores permitidos.
      maxLength: 12,
      required: true,
    },

    // Unix Timestamp para a data de criação
    createdAt: {
      type: "number",
      required: true,
      // Não definimos um valor padrão aqui porque vamos usar um hook
    },

    // ---------- Relações com outras tabelas ----------

    // Associação n para n com Manual para favoritos
    favoritedBy: {
      collection: "employee",
      via: "idManual",
      through: "favorite", // Nome do modelo de junção
    },

    // Associação com Employee via Task
    tasks: {
      collection: "employee",
      via: "idManual",
      through: "task",
    },

    // Associação com Employee via AccessHistory
    employees: {
      collection: "employee",
      via: "idManual",
      through: "accesshistory",
    },

    // Relacionamento 1 pra n com Material
    materials: {
      collection: "material",
      via: "idManual",
    },
  },

  // Hook para definir o Unix timestamp atual antes de criar um registro
  beforeCreate: function (valuesToSet, proceed) {
    valuesToSet.createdAt = Math.floor(Date.now() / 1000); // Unix timestamp atual
    valuesToSet.id = uuidv4();
    return proceed();
  },
};
