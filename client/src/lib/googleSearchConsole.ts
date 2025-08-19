// Google Search Console Integration and Testing Tools
// This module provides comprehensive Google Search Console functionality

declare global {
  interface Window {
    gscVerification?: string;
    gscTesting?: boolean;
  }
}

export interface GSCDiagnosticData {
  sitemapStatus: 'available' | 'error' | 'pending';
  robotsStatus: 'available' | 'error' | 'pending';
  structuredDataErrors: string[];
  metaTagsHealth: {
    title: boolean;
    description: boolean;
    canonical: boolean;
    hreflang: boolean;
    robots: boolean;
  };
  googleVerificationTag?: string;
  lastCrawlData?: {
    timestamp: string;
    status: string;
    errors: string[];
  };
}

// Google Search Console Verification Methods
export class GoogleSearchConsoleManager {
  private static instance: GoogleSearchConsoleManager;
  
  public static getInstance(): GoogleSearchConsoleManager {
    if (!GoogleSearchConsoleManager.instance) {
      GoogleSearchConsoleManager.instance = new GoogleSearchConsoleManager();
    }
    return GoogleSearchConsoleManager.instance;
  }

  // Add Google Search Console verification meta tag
  public addVerificationTag(verificationCode: string): void {
    console.log('Adding Google Search Console verification tag:', verificationCode);
    
    // Remove existing verification tag if present
    const existingTag = document.querySelector('meta[name="google-site-verification"]');
    if (existingTag) {
      existingTag.remove();
    }

    // Add new verification tag
    const metaTag = document.createElement('meta');
    metaTag.setAttribute('name', 'google-site-verification');
    metaTag.setAttribute('content', verificationCode);
    document.head.appendChild(metaTag);

    // Store in global window for testing
    window.gscVerification = verificationCode;
    
    console.log('Google Search Console verification tag added successfully');
  }

  // Generate HTML verification file content
  public generateHTMLVerificationFile(verificationCode: string): string {
    return `google-site-verification: google${verificationCode}.html`;
  }

  // Check if current page has proper SEO setup for GSC
  public diagnoseSEOSetup(): GSCDiagnosticData {
    const diagnostic: GSCDiagnosticData = {
      sitemapStatus: 'pending',
      robotsStatus: 'pending',
      structuredDataErrors: [],
      metaTagsHealth: {
        title: false,
        description: false,
        canonical: false,
        hreflang: false,
        robots: false
      }
    };

    // Check meta tags
    diagnostic.metaTagsHealth.title = !!document.title && document.title.length > 0;
    diagnostic.metaTagsHealth.description = !!document.querySelector('meta[name="description"]');
    diagnostic.metaTagsHealth.canonical = !!document.querySelector('link[rel="canonical"]');
    diagnostic.metaTagsHealth.hreflang = !!document.querySelector('link[rel="alternate"][hreflang]');
    diagnostic.metaTagsHealth.robots = !!document.querySelector('meta[name="robots"]') || 
                                       !!document.querySelector('meta[name="googlebot"]');

    // Check for verification tag
    const verificationTag = document.querySelector('meta[name="google-site-verification"]');
    if (verificationTag) {
      diagnostic.googleVerificationTag = verificationTag.getAttribute('content') || undefined;
    }

    // Check structured data
    try {
      const structuredDataScripts = document.querySelectorAll('script[type="application/ld+json"]');
      structuredDataScripts.forEach((script, index) => {
        try {
          JSON.parse(script.innerHTML);
        } catch (error) {
          diagnostic.structuredDataErrors.push(`Script ${index + 1}: Invalid JSON-LD syntax`);
        }
      });
    } catch (error) {
      diagnostic.structuredDataErrors.push('Error analyzing structured data');
    }

    return diagnostic;
  }

  // Test sitemap and robots.txt accessibility
  public async testSEOFiles(): Promise<{ sitemap: boolean; robots: boolean }> {
    const baseUrl = window.location.origin;
    const results = { sitemap: false, robots: false };

    try {
      // Test sitemap.xml
      const sitemapResponse = await fetch(`${baseUrl}/sitemap.xml`);
      results.sitemap = sitemapResponse.ok && 
                       (sitemapResponse.headers.get('content-type')?.includes('xml') ?? false);
    } catch (error) {
      console.error('Sitemap test failed:', error);
    }

    try {
      // Test robots.txt
      const robotsResponse = await fetch(`${baseUrl}/robots.txt`);
      results.robots = robotsResponse.ok && 
                      (robotsResponse.headers.get('content-type')?.includes('text') ?? false);
    } catch (error) {
      console.error('Robots.txt test failed:', error);
    }

    return results;
  }

  // Generate GSC diagnostic report
  public async generateDiagnosticReport(): Promise<string> {
    const seoSetup = this.diagnoseSEOSetup();
    const fileTests = await this.testSEOFiles();
    
    const report = `
=== GOOGLE SEARCH CONSOLE DIAGNOSTIC REPORT ===
Generated: ${new Date().toLocaleString()}

1. SEO FILES STATUS:
   ✅ Sitemap.xml: ${fileTests.sitemap ? 'ACCESSIBLE' : 'ERROR - Not accessible'}
   ✅ Robots.txt: ${fileTests.robots ? 'ACCESSIBLE' : 'ERROR - Not accessible'}

2. META TAGS HEALTH:
   ✅ Title Tag: ${seoSetup.metaTagsHealth.title ? 'PRESENT' : 'MISSING'}
   ✅ Meta Description: ${seoSetup.metaTagsHealth.description ? 'PRESENT' : 'MISSING'}
   ✅ Canonical URL: ${seoSetup.metaTagsHealth.canonical ? 'PRESENT' : 'MISSING'}
   ✅ Hreflang Tags: ${seoSetup.metaTagsHealth.hreflang ? 'PRESENT' : 'MISSING'}
   ✅ Robots Meta: ${seoSetup.metaTagsHealth.robots ? 'PRESENT' : 'MISSING'}

3. GOOGLE VERIFICATION:
   ${seoSetup.googleVerificationTag ? 
     '✅ Verification Tag: PRESENT (' + seoSetup.googleVerificationTag + ')' : 
     '❌ Verification Tag: NOT FOUND'}

4. STRUCTURED DATA:
   ${seoSetup.structuredDataErrors.length === 0 ? 
     '✅ JSON-LD: NO ERRORS DETECTED' : 
     '❌ JSON-LD Errors: ' + seoSetup.structuredDataErrors.join(', ')}

5. RECOMMENDATIONS:
   ${this.generateRecommendations(seoSetup, fileTests)}
`;

    return report;
  }

  private generateRecommendations(seoSetup: GSCDiagnosticData, fileTests: { sitemap: boolean; robots: boolean }): string {
    const recommendations: string[] = [];

    if (!fileTests.sitemap) {
      recommendations.push('- Fix sitemap.xml accessibility');
    }
    if (!fileTests.robots) {
      recommendations.push('- Fix robots.txt accessibility');
    }
    if (!seoSetup.metaTagsHealth.title) {
      recommendations.push('- Add proper title tags to all pages');
    }
    if (!seoSetup.metaTagsHealth.description) {
      recommendations.push('- Add meta descriptions to all pages');
    }
    if (!seoSetup.googleVerificationTag) {
      recommendations.push('- Add Google Search Console verification tag');
    }
    if (seoSetup.structuredDataErrors.length > 0) {
      recommendations.push('- Fix structured data JSON-LD errors');
    }

    return recommendations.length > 0 ? recommendations.join('\n   ') : '✅ No critical issues found';
  }

  // URL inspection simulation (for testing purposes)
  public simulateURLInspection(url: string): {
    indexable: boolean;
    crawlable: boolean;
    mobileFriendly: boolean;
    issues: string[];
  } {
    const issues: string[] = [];
    
    // Basic checks
    const indexable = !url.includes('/admin/') && !url.includes('/private/');
    const crawlable = !document.querySelector('meta[name="robots"][content*="noindex"]');
    const mobileFriendly = !!document.querySelector('meta[name="viewport"]');

    if (!indexable) issues.push('URL may be blocked from indexing');
    if (!crawlable) issues.push('Page has noindex directive');
    if (!mobileFriendly) issues.push('Page may not be mobile-friendly');

    return {
      indexable,
      crawlable,
      mobileFriendly,
      issues
    };
  }

  // Enhanced robots directive management
  public setRobotsDirective(directive: 'index' | 'noindex', follow: 'follow' | 'nofollow' = 'follow'): void {
    const content = `${directive}, ${follow}`;
    
    // Remove existing robots meta tag
    const existingTag = document.querySelector('meta[name="robots"]');
    if (existingTag) {
      existingTag.remove();
    }

    // Add new robots directive
    const metaTag = document.createElement('meta');
    metaTag.setAttribute('name', 'robots');
    metaTag.setAttribute('content', content);
    document.head.appendChild(metaTag);

    console.log(`Robots directive set to: ${content}`);
  }
}

// Export singleton instance
export const gscManager = GoogleSearchConsoleManager.getInstance();

// Development testing utilities
export const GSCTestingUtils = {
  // Enable testing mode
  enableTestingMode(): void {
    window.gscTesting = true;
    console.log('🔍 Google Search Console testing mode enabled');
  },

  // Log current SEO state
  async logSEOState(): Promise<void> {
    const report = await gscManager.generateDiagnosticReport();
    console.log(report);
  },

  // Simulate verification
  simulateVerification(code: string): void {
    gscManager.addVerificationTag(code);
    console.log('✅ GSC verification simulation complete');
  },

  // Test URL inspection
  testURLInspection(url?: string): void {
    const testUrl = url || window.location.href;
    const results = gscManager.simulateURLInspection(testUrl);
    console.log('URL Inspection Results:', results);
  }
};

// Auto-initialize in development
if (import.meta.env.DEV) {
  GSCTestingUtils.enableTestingMode();
  console.log('🚀 Google Search Console tools loaded');
}