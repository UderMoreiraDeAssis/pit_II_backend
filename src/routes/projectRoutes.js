// routes/projectRoutes.js
const express = require('express');
const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');
const router = express.Router();

// Create Project
router.post('/', async (req, res) => {
  try {
    console.log('Received request to create project with data:', req.body);
    const project = new Project(req.body);
    console.log('Creating new project:', project);
    await project.save();
    console.log('Project created successfully:', project);
    res.status(201).json(project);
  } catch (err) {
    console.error('Error creating project:', err.message);
    res.status(400).json({ error: err.message });
  }
});

// Get All Projects
router.get('/', async (req, res) => {
  try {
    console.log('Received request to get all projects');
    const projects = await Project.find().populate('members');
    console.log('Fetched projects:', projects);
    res.json(projects);
  } catch (err) {
    console.error('Error fetching all projects:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get Project by ID
router.get('/:id', async (req, res) => {
  try {
    console.log('Received request to get project by ID:', req.params.id);
    const project = await Project.findById(req.params.id).populate('members').populate('tasks');
    if (project) {
      console.log('Project found:', project);
      res.json(project);
    } else {
      console.log('Project not found for ID:', req.params.id);
      res.status(404).json({ error: 'Project not found' });
    }
  } catch (err) {
    console.error('Error fetching project by ID:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Update Project
router.put('/:id', async (req, res) => {
  try {
    console.log('Received request to update project with ID:', req.params.id);
    console.log('Update data:', req.body);
    const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (updatedProject) {
      console.log('Project updated successfully:', updatedProject);
      res.json(updatedProject);
    } else {
      console.log('Project not found for ID:', req.params.id);
      res.status(404).json({ error: 'Project not found' });
    }
  } catch (err) {
    console.error('Error updating project:', err.message);
    res.status(400).json({ error: err.message });
  }
});

// Delete Project
router.delete('/:id', async (req, res) => {
  try {
    console.log('Received request to delete project with ID:', req.params.id);
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (deletedProject) {
      console.log('Project deleted successfully:', deletedProject);
      res.json({ message: 'Project deleted' });
    } else {
      console.log('Project not found for ID:', req.params.id);
      res.status(404).json({ error: 'Project not found' });
    }
  } catch (err) {
    console.error('Error deleting project:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Add Member to Project
router.post('/:id/members', async (req, res) => {
  try {
    console.log('Received request to add member to project with ID:', req.params.id);
    console.log('Member data:', req.body);
    const project = await Project.findById(req.params.id);
    if (!project) {
      console.log('Project not found for ID:', req.params.id);
      return res.status(404).json({ error: 'Project not found' });
    }

    const member = await User.findById(req.body.memberId);
    if (!member) {
      console.log('Member not found for ID:', req.body.memberId);
      return res.status(404).json({ error: 'Member not found' });
    }

    console.log('Adding member to project:', { projectId: req.params.id, memberId: member._id });
    if (!project.members.includes(member._id)) {
      project.members.push(member._id);
      await project.save();
      console.log('Member added successfully:', member._id);
    } else {
      console.log('Member already exists in project:', member._id);
    }
    res.json(project);
  } catch (err) {
    console.error('Error adding member to project:', err.message);
    res.status(400).json({ error: err.message });
  }
});

// Remove Member from Project
router.delete('/:id/members/:memberId', async (req, res) => {
  try {
    console.log('Received request to remove member from project with ID:', req.params.id);
    console.log('Member ID to remove:', req.params.memberId);
    const project = await Project.findById(req.params.id);
    if (!project) {
      console.log('Project not found for ID:', req.params.id);
      return res.status(404).json({ error: 'Project not found' });
    }

    console.log('Removing member from project:', req.params.memberId);
    project.members.pull(req.params.memberId);
    await project.save();
    console.log('Member removed successfully:', req.params.memberId);
    res.json(project);
  } catch (err) {
    console.error('Error removing member from project:', err.message);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
