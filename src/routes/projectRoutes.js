// routes/projectRoutes.js
const express = require('express');
const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');
const router = express.Router();

// Create Project
router.post('/', async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get All Projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().populate('members tasks');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Project by ID
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('members tasks');
    if (project) res.json(project);
    else res.status(404).json({ error: 'Project not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Project
router.put('/:id', async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (updatedProject) res.json(updatedProject);
    else res.status(404).json({ error: 'Project not found' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete Project
router.delete('/:id', async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (deletedProject) res.json({ message: 'Project deleted' });
    else res.status(404).json({ error: 'Project not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add Member to Project
router.post('/:id/members', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const member = await User.findById(req.body.memberId);
    if (!member) return res.status(404).json({ error: 'Member not found' });

    if (!project.members.includes(member._id)) {
      project.members.push(member._id);
      await project.save();
    }
    res.json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Remove Member from Project
router.delete('/:id/members/:memberId', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    project.members.pull(req.params.memberId);
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
