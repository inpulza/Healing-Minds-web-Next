// Google Search Console Test Runner
// Comprehensive testing suite for GSC integration

import { gscManager } from './googleSearchConsole';

export interface GSCTestResults {
  overallStatus: 'pass' | 'warning' | 'fail';
  tests: {
    seoFiles: {
      sitemap: boolean;
      robots: boolean;
      status: 'pass' | 'fail';
    };
    metaTags: {
      title: boolean;
      description: boolean;
      canonical: boolean;
      hreflang: boolean;
      status: 'pass' | 'warning' | 'fail';
    };
    structuredData: {
      hasSchemas: boolean;
      validJson: boolean;
      status: 'pass' | 'warning' | 'fail';
    };
    verification: {
      hasVerificationTag: boolean;
      status: 'pass' | 'warning';
    };
    performance: {
      pageLoadTime: number;
      mobileFriendly: boolean;
      status: 'pass' | 'warning' | 'fail';
    };
  };
  recommendations: string[];
  summary: string;
}

export class GSCTestRunner {
  public static async runCompleteTest(): Promise<GSCTestResults> {
    console.log('🔍 Iniciando prueba completa de Google Search Console...');
    
    const results: GSCTestResults = {
      overallStatus: 'pass',
      tests: {
        seoFiles: { sitemap: false, robots: false, status: 'fail' },
        metaTags: { title: false, description: false, canonical: false, hreflang: false, status: 'fail' },
        structuredData: { hasSchemas: false, validJson: false, status: 'fail' },
        verification: { hasVerificationTag: false, status: 'warning' },
        performance: { pageLoadTime: 0, mobileFriendly: false, status: 'fail' }
      },
      recommendations: [],
      summary: ''
    };

    try {
      // Test SEO files
      await this.testSEOFiles(results);
      
      // Test meta tags
      this.testMetaTags(results);
      
      // Test structured data
      this.testStructuredData(results);
      
      // Test verification
      this.testVerification(results);
      
      // Test performance basics
      this.testPerformance(results);
      
      // Generate recommendations
      this.generateRecommendations(results);
      
      // Calculate overall status
      this.calculateOverallStatus(results);
      
      // Generate summary
      results.summary = this.generateSummary(results);
      
      console.log('✅ Prueba completa de GSC finalizada');
      return results;
      
    } catch (error) {
      console.error('❌ Error durante la prueba GSC:', error);
      results.overallStatus = 'fail';
      results.summary = 'Error durante la ejecución de las pruebas';
      return results;
    }
  }

  private static async testSEOFiles(results: GSCTestResults): Promise<void> {
    try {
      const fileTests = await gscManager.testSEOFiles();
      results.tests.seoFiles.sitemap = fileTests.sitemap;
      results.tests.seoFiles.robots = fileTests.robots;
      results.tests.seoFiles.status = (fileTests.sitemap && fileTests.robots) ? 'pass' : 'fail';
    } catch (error) {
      console.error('Error testing SEO files:', error);
      results.tests.seoFiles.status = 'fail';
    }
  }

  private static testMetaTags(results: GSCTestResults): void {
    const metaTags = results.tests.metaTags;
    
    // Test title
    metaTags.title = !!document.title && document.title.length > 0 && document.title.length <= 60;
    
    // Test description
    const description = document.querySelector('meta[name="description"]');
    const descContent = description?.getAttribute('content');
    metaTags.description = !!description && 
                          !!descContent &&
                          descContent.length > 120 &&
                          descContent.length <= 160;
    
    // Test canonical
    metaTags.canonical = !!document.querySelector('link[rel="canonical"]');
    
    // Test hreflang
    metaTags.hreflang = !!document.querySelector('link[rel="alternate"][hreflang]');
    
    // Calculate status
    const passCount = Object.values(metaTags).filter(v => typeof v === 'boolean' && v).length;
    if (passCount === 4) metaTags.status = 'pass';
    else if (passCount >= 2) metaTags.status = 'warning';
    else metaTags.status = 'fail';
  }

  private static testStructuredData(results: GSCTestResults): void {
    const structured = results.tests.structuredData;
    
    try {
      const schemas = document.querySelectorAll('script[type="application/ld+json"]');
      structured.hasSchemas = schemas.length > 0;
      
      let allValid = true;
      schemas.forEach(schema => {
        try {
          JSON.parse(schema.innerHTML);
        } catch (error) {
          allValid = false;
        }
      });
      
      structured.validJson = allValid;
      
      if (structured.hasSchemas && structured.validJson) {
        structured.status = 'pass';
      } else if (structured.hasSchemas) {
        structured.status = 'warning';
      } else {
        structured.status = 'fail';
      }
    } catch (error) {
      structured.status = 'fail';
    }
  }

  private static testVerification(results: GSCTestResults): void {
    const verification = results.tests.verification;
    
    const verificationTag = document.querySelector('meta[name="google-site-verification"]');
    verification.hasVerificationTag = !!verificationTag && 
                                     !!verificationTag.getAttribute('content');
    
    verification.status = verification.hasVerificationTag ? 'pass' : 'warning';
  }

  private static testPerformance(results: GSCTestResults): void {
    const performance = results.tests.performance;
    
    // Basic performance test
    const startTime = window.performance?.now ? window.performance.now() : Date.now();
    performance.pageLoadTime = startTime;
    
    // Mobile-friendly test
    const viewport = document.querySelector('meta[name="viewport"]');
    performance.mobileFriendly = !!viewport && 
                                (viewport.getAttribute('content')?.includes('width=device-width') ?? false);
    
    // Basic performance status
    performance.status = performance.mobileFriendly ? 'pass' : 'warning';
  }

  private static generateRecommendations(results: GSCTestResults): void {
    const recommendations = results.recommendations;
    
    // SEO Files recommendations
    if (!results.tests.seoFiles.sitemap) {
      recommendations.push('Corregir accesibilidad del sitemap.xml');
    }
    if (!results.tests.seoFiles.robots) {
      recommendations.push('Corregir accesibilidad del robots.txt');
    }
    
    // Meta tags recommendations
    if (!results.tests.metaTags.title) {
      recommendations.push('Optimizar títulos de página (max 60 caracteres)');
    }
    if (!results.tests.metaTags.description) {
      recommendations.push('Optimizar meta descriptions (120-160 caracteres)');
    }
    if (!results.tests.metaTags.canonical) {
      recommendations.push('Agregar URLs canónicas a todas las páginas');
    }
    if (!results.tests.metaTags.hreflang) {
      recommendations.push('Implementar etiquetas hreflang para contenido bilingüe');
    }
    
    // Structured data recommendations
    if (!results.tests.structuredData.hasSchemas) {
      recommendations.push('Implementar datos estructurados (Schema.org)');
    }
    if (!results.tests.structuredData.validJson) {
      recommendations.push('Corregir errores en JSON-LD');
    }
    
    // Verification recommendations
    if (!results.tests.verification.hasVerificationTag) {
      recommendations.push('Agregar código de verificación de Google Search Console');
    }
    
    // Performance recommendations
    if (!results.tests.performance.mobileFriendly) {
      recommendations.push('Implementar meta viewport para optimización móvil');
    }
  }

  private static calculateOverallStatus(results: GSCTestResults): void {
    const tests = results.tests;
    const failCount = Object.values(tests).filter(test => test.status === 'fail').length;
    const warningCount = Object.values(tests).filter(test => test.status === 'warning').length;
    
    if (failCount > 0) {
      results.overallStatus = 'fail';
    } else if (warningCount > 0) {
      results.overallStatus = 'warning';
    } else {
      results.overallStatus = 'pass';
    }
  }

  private static generateSummary(results: GSCTestResults): string {
    const tests = results.tests;
    const totalTests = Object.keys(tests).length;
    const passCount = Object.values(tests).filter(test => test.status === 'pass').length;
    const warningCount = Object.values(tests).filter(test => test.status === 'warning').length;
    const failCount = Object.values(tests).filter(test => test.status === 'fail').length;
    
    return `Prueba completa finalizada: ${passCount}/${totalTests} pruebas pasaron, ${warningCount} advertencias, ${failCount} fallos. Estado general: ${results.overallStatus.toUpperCase()}`;
  }

  // Quick diagnostic method
  public static async quickDiagnostic(): Promise<string> {
    const diagnostic = gscManager.diagnoseSEOSetup();
    const fileTests = await gscManager.testSEOFiles();
    
    return `
🔍 DIAGNÓSTICO RÁPIDO GSC
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 Archivos SEO:
  Sitemap: ${fileTests.sitemap ? '✅' : '❌'}
  Robots: ${fileTests.robots ? '✅' : '❌'}

🏷️ Meta Tags:
  Title: ${diagnostic.metaTagsHealth.title ? '✅' : '❌'}
  Description: ${diagnostic.metaTagsHealth.description ? '✅' : '❌'}
  Canonical: ${diagnostic.metaTagsHealth.canonical ? '✅' : '❌'}
  Hreflang: ${diagnostic.metaTagsHealth.hreflang ? '✅' : '❌'}

🔗 Verificación:
  Google GSC: ${diagnostic.googleVerificationTag ? '✅ ' + diagnostic.googleVerificationTag : '❌ No configurado'}

📊 Datos Estructurados:
  Errores: ${diagnostic.structuredDataErrors.length === 0 ? '✅ Sin errores' : '❌ ' + diagnostic.structuredDataErrors.length + ' error(es)'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `;
  }
}

// Export for global access in development
if (import.meta.env.DEV) {
  (window as any).GSCTestRunner = GSCTestRunner;
  console.log('🧪 GSC Test Runner disponible globalmente');
}