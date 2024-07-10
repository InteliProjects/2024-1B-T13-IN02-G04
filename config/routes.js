module.exports.routes = {
  // ---------------------------- View: ----------------------------
  "/entrar": { view: "pages/login" }, // Login
  "/manual/:id": "ManualsController.view", // Visualização de Manual
  "/manuais": "AllManualsController.index", // Lista de manuais (sem filtros)
  "/perfil": { view: "pages/profile" }, // Visualização de Perfil

  // --------- Montador ---------
  "/": { view: "pages/assembler/homepage" }, // Homepage
  "/manuais/favoritos": "AllManualsController.favorites", // Lista de manuais (favoritos)
  "/manuais/tarefas": "AllManualsController.tasks", // Lista de manuais (pendentes)
  "/manuais/pesquisa": "AllManualsController.search", // Lista de manuais (foco no campo de pesquisa)

  // --------- Engenheiro (admin) ---------
  "/engenheiro/": "AdminHomepageController.homepage", // Homepage do engenheiro
  "/engenheiro/novo-manual": { view: "pages/engineer/newManual" }, // Novo manual
  "/engenheiro/editar-manual": { view: "pages/engineer/editManual" }, // Edição de manual
  "/engenheiro/nova-linha": { view: "pages/engineer/newAssemblyLine" }, // Criação de linha de montagem
  "/engenheiro/linhas": { view: "pages/engineer/lines" }, // Visualização de todas as linhas


  // ---------------------------- APIs: ----------------------------
  // Login
  "POST /api/login": "LoginController.login", // Verifica email e senha digitado

  // Perfil:
  "POST /api/profile": "ProfilesController.getEmployeeInfo", // Buscar os dados do perfil
  "PATCH /api/profile": "ProfilesController.updatePass", // Atualizar senha do perfil

  // Manuais:
  "POST /api/findAllManuals": "AllManualsController.findAllManuals",
  
  // --------- Montador ---------
  // Homepage
  "POST /api/home/tasks": "HomepageController.getTasks",
  "POST /api/home/favorites": "HomepageController.getFavorites",
  "POST /api/home/lastAccessed": "HomepageController.getLastAccessed",
  
  // Manuais:
  "POST /api/manual/favorite": "ManualsController.favorite",
  "POST /api/manual/conclude": "ManualsController.conclude",

  // --------- Engenheiro (admin) ---------
  // homepage admin:
  "GET /api/admin/task-status": "AdminHomepageController.taskStatusCount",
  "GET /api/admin/getLatestManuals": "AdminHomepageController.getLatestManuals",
  'GET /api/admin/status-by-assembly-line': 'AdminHomepageController.taskStatusByAssemblyLine',

  // Criação de manuais
  "POST /api/admin/newManual": "MaterialsController.createMaterialAndManual",

  // Edição de manuais:
  "GET /api/admin/editManual": "ManualsController.getManual",
  "PUT /api/admin/editManual": "ManualsController.updateManual",

  // Criação de linhas de montagem
  "POST /api/admin/assemblyLine/create": "AssemblyLinesController.create",
  'GET /engenheiro/nova-linha': 'AssemblyLinesController.getManualsAndEmployees',

  // Obter materiais
  "GET /api/admin/getMaterials": "MaterialsController.getMaterials",

 
  // Visualização de todas as linhas
  "POST /api/admin/assemblyLine/list": "AssemblyLinesController.list",
};
