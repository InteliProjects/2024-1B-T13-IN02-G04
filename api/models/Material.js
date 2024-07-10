const { v4: uuidv4 } = require("uuid"); // Importa a depenência que gera chaves únicas para cada registro

module.exports = {
  attributes: {
    id: {
      type: "string",
      unique: true,
      required: true,
    },

    // Atributo que armazena o link do material.
    link: {
      type: "string", // Tipo: string.
      required: true, // Obrigatório.
      minLength: 4, // definido como 4 pois precisa ser um arquivo(n caracteres).extensao(3 caracteres)
    },

    // Atributo que armazena o tipo do material (pdf, mp4, etc.).
    type: {
      type: "string", // Tipo: string.
      required: true, // Obrigatório.
      isIn: ["pdf", "img", "vid", "3d", "mp4", "mp3", "stp", "other"], // Valores permitidos.
      maxLength: 5,
    },

    // ---------- Relação com outra tabela ----------

    // Relacionamento n pra 1 com Manual
    idManual: {
      model: "manual",
      required: true,
    },
  },

  beforeCreate: function (valuesToSet, proceed) {
    valuesToSet.id = uuidv4();
    return proceed();
  },
};
