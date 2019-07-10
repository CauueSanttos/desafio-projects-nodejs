const express = require("express");

server = express();
server.use(express.json());

let numberRequest = 0;
const projects = [];

/**
 * Log de requisições
 */
server.use((req, res, next) => {
  numberRequest++;

  console.log(`Número de Requisições: [${numberRequest}]`);

  return next();
});

/**
 * Verifica se o projeto existe
 * @param {Requisição} req
 * @param {Resposta} res
 * @param {Próximo Middlaware} next
 */
function checkProjectExists(req, res, next) {
  const { id } = req.params;

  const project = projects.find(project => project.id === id);

  if (!project) {
    res.status(400).json({ error: "Project not found" });
  }

  return next();
}

/**
 * Insere um novo Projeto
 */
server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  let project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json("Project insert with success!");
});

/**
 * Lista todos Projetos
 */
server.get("/projects", (req, res) => {
  return res.json(projects);
});

/**
 * Altera o Título de um Projeto
 */
server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(project => project.id == id);

  project.title = title;

  return res.json(project);
});

/**
 * Adicionar tarefas no Projeto
 */
server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title: task } = req.body;

  const project = projects.find(project => project.id === id);

  project.tasks.push(task);

  return res.json(project);
});

/**
 * Deleta o Projeto
 */
server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndexDeleted = projects.findIndex(project => project.id === id);

  projects.splice(projectIndexDeleted, 1);

  return res.send();
});

server.listen(3000);
