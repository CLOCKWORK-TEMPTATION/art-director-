// CineArchitect AI - API Routes
// مسارات الواجهة البرمجية

import { Router, Request, Response } from 'express';
import { pluginManager } from '../core/PluginManager';
import { PluginInput } from '../types';

export const router = Router();

// Health check
router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    initialized: pluginManager.isInitialized()
  });
});

// Get all plugins
router.get('/plugins', (req: Request, res: Response) => {
  const plugins = pluginManager.getPluginInfo();
  res.json({
    success: true,
    count: plugins.length,
    plugins
  });
});

// Get plugin by ID
router.get('/plugins/:id', (req: Request, res: Response) => {
  const plugin = pluginManager.getPlugin(req.params.id);
  if (!plugin) {
    return res.status(404).json({
      success: false,
      error: `Plugin "${req.params.id}" not found`
    });
  }

  res.json({
    success: true,
    plugin: {
      id: plugin.id,
      name: plugin.name,
      nameAr: plugin.nameAr,
      version: plugin.version,
      description: plugin.description,
      descriptionAr: plugin.descriptionAr,
      category: plugin.category
    }
  });
});

// Get plugins by category
router.get('/plugins/category/:category', (req: Request, res: Response) => {
  const plugins = pluginManager.getPluginsByCategory(req.params.category as any);
  res.json({
    success: true,
    category: req.params.category,
    count: plugins.length,
    plugins: plugins.map(p => ({
      id: p.id,
      name: p.name,
      nameAr: p.nameAr,
      version: p.version
    }))
  });
});

// Execute plugin
router.post('/plugins/:id/execute', async (req: Request, res: Response) => {
  const pluginId = req.params.id;
  const input: PluginInput = req.body;

  if (!input || !input.type) {
    return res.status(400).json({
      success: false,
      error: 'Invalid input: "type" field is required'
    });
  }

  const result = await pluginManager.executePlugin(pluginId, input);
  res.json(result);
});

// Visual Consistency Analysis endpoint
router.post('/analyze/visual-consistency', async (req: Request, res: Response) => {
  const result = await pluginManager.executePlugin('visual-analyzer', {
    type: 'analyze',
    data: req.body
  });
  res.json(result);
});

// Terminology Translation endpoint
router.post('/translate/cinema-terms', async (req: Request, res: Response) => {
  const result = await pluginManager.executePlugin('terminology-translator', {
    type: 'translate',
    data: req.body
  });
  res.json(result);
});

// Budget Optimization endpoint
router.post('/optimize/budget', async (req: Request, res: Response) => {
  const result = await pluginManager.executePlugin('budget-optimizer', {
    type: 'optimize',
    data: req.body
  });
  res.json(result);
});

// Risk Analysis endpoint
router.post('/analyze/risks', async (req: Request, res: Response) => {
  const result = await pluginManager.executePlugin('risk-analyzer', {
    type: 'analyze',
    data: req.body
  });
  res.json(result);
});

// Lighting Simulation endpoint
router.post('/simulate/lighting', async (req: Request, res: Response) => {
  const result = await pluginManager.executePlugin('lighting-simulator', {
    type: 'simulate',
    data: req.body
  });
  res.json(result);
});
