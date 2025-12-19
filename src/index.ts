// CineArchitect AI - Main Application Entry Point
// نقطة الدخول الرئيسية للتطبيق

import express from 'express';
import cors from 'cors';
import { pluginManager } from './core/PluginManager';
import { router } from './api/routes';

// Import plugins
import { visualAnalyzer } from './plugins/visual-analyzer';
import { terminologyTranslator } from './plugins/terminology-translator';
import { budgetOptimizer } from './plugins/budget-optimizer';
import { lightingSimulator } from './plugins/lighting-simulator';
import { riskAnalyzer } from './plugins/risk-analyzer';

const PORT = process.env.PORT || 3000;

async function bootstrap(): Promise<void> {
  console.log('');
  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log('║                     CineArchitect AI                          ║');
  console.log('║              Art Director Tools Suite v1.0.0                  ║');
  console.log('║         مجموعة أدوات الارت ديركتور - النسخة 1.0.0             ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝');
  console.log('');

  // Register all plugins
  console.log('[CineArchitect] Registering plugins...');

  await pluginManager.registerPlugin(visualAnalyzer);
  await pluginManager.registerPlugin(terminologyTranslator);
  await pluginManager.registerPlugin(budgetOptimizer);
  await pluginManager.registerPlugin(lightingSimulator);
  await pluginManager.registerPlugin(riskAnalyzer);

  // Initialize all plugins
  await pluginManager.initializeAll();

  // Create Express app
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Welcome route
  app.get('/', (req, res) => {
    res.json({
      name: 'CineArchitect AI',
      nameAr: 'سينماركيتكت إيه آي',
      version: '1.0.0',
      description: 'Comprehensive ecosystem for Art Directors in film production',
      descriptionAr: 'نظام بيئي متكامل لمديري الفن في الإنتاج السينمائي',
      endpoints: {
        health: '/api/health',
        plugins: '/api/plugins',
        visualAnalysis: 'POST /api/analyze/visual-consistency',
        translate: 'POST /api/translate/cinema-terms',
        budget: 'POST /api/optimize/budget',
        lighting: 'POST /api/simulate/lighting',
        risks: 'POST /api/analyze/risks'
      }
    });
  });

  // API routes
  app.use('/api', router);

  // Error handling
  app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('[CineArchitect] Error:', err.message);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  });

  // Start server
  app.listen(PORT, () => {
    console.log('');
    console.log(`[CineArchitect] Server running on http://localhost:${PORT}`);
    console.log('');
    console.log('Available Plugins / الإضافات المتاحة:');
    console.log('─────────────────────────────────────');

    const plugins = pluginManager.getPluginInfo();
    plugins.forEach((plugin, index) => {
      console.log(`  ${index + 1}. ${plugin.name}`);
      console.log(`     ${plugin.nameAr}`);
      console.log(`     Category: ${plugin.category} | Version: ${plugin.version}`);
      console.log('');
    });

    console.log('API Endpoints:');
    console.log('─────────────────────────────────────');
    console.log('  GET  /api/health              - Health check');
    console.log('  GET  /api/plugins             - List all plugins');
    console.log('  POST /api/plugins/:id/execute - Execute plugin');
    console.log('  POST /api/analyze/visual-consistency');
    console.log('  POST /api/translate/cinema-terms');
    console.log('  POST /api/optimize/budget');
    console.log('  POST /api/simulate/lighting');
    console.log('  POST /api/analyze/risks');
    console.log('');
  });

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n[CineArchitect] Shutting down...');
    await pluginManager.shutdownAll();
    console.log('[CineArchitect] Goodbye! مع السلامة');
    process.exit(0);
  });
}

// Run the application
bootstrap().catch(error => {
  console.error('[CineArchitect] Failed to start:', error);
  process.exit(1);
});
