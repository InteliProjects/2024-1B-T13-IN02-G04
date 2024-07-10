const { v4: uuidv4 } = require("uuid"); // Importa a depenência que gera chaves únicas para cada registro

module.exports = {
  attributes: {
    id: {
      type: "string",
      unique: true,
      required: true,
    },

    // Atributo que difere engenheiros de montadores.
    isEngineer: {
      type: "boolean", // Define o tipo do atributo como boolean (false - montador <-> true - engenheiro)
      required: true, // Obrigatório.
    },

    // Atributo que armazena o nome do funcionário.
    name: {
      type: "string", // Define o tipo do atributo como string.
      maxLength: 200, // Máximo de caracteres: 200.
      required: true, // Obrigatório.
    },

    // Atributo que armazena o email do funcionário.
    email: {
      type: "string", // Define o tipo do atributo como string.
      maxLength: 120, // Máximo de caracteres: 120.
      minLength: 10, // Mínimo 10 considerando que tem que haver no mínimo 1 caractere antes de @dell.com
      required: true, // Obrigatório.
      unique: true,
      isEmail: true,
    },

    // Atributo que armazena a senha do funcionário.
    password: {
      type: "string", // Define o tipo do atributo como string.
      maxLength: 50, // Máximo de caracteres: 50.
      required: true, // Obrigatório.
      minLength: 8,
    },

    // ---------- Relações com outras tabelas ----------

    // Associação n para n com Manual para favoritos
    favorites: {
      collection: "manual",
      via: "idEmployee",
      through: "favorite", // Nome do modelo de junção
    },

    // Associação com Manual via Task
    tasks: {
      collection: "manual",
      via: "idEmployee",
      through: "task",
    },

    // Associação com Manual via AccessHistory
    manuals: {
      collection: "manual",
      via: "idEmployee",
      through: "accesshistory",
    },

    // Relacionamento n pra 1 com AssemblyLine
    idAssemblyLine: {
      model: "assemblyline",
      required: true,
    },
  },

  beforeCreate: function (valuesToSet, proceed) {
    valuesToSet.id = uuidv4();
    return proceed();
  },
};
