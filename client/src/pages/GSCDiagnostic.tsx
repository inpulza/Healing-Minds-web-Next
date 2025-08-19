import { useEffect } from 'react';
import { GSCDiagnosticPanel } from '@/components/GSCDiagnosticPanel';
import { updateSEO } from '@/utils/seo';

export default function GSCDiagnostic() {
  useEffect(() => {
    updateSEO({
      title: 'Google Search Console - Diagnóstico | Healing Minds Psychiatry',
      description: 'Panel de diagnóstico y herramientas para Google Search Console. Verificación de sitio web, análisis SEO y pruebas de indexación.',
      keywords: 'google search console, seo, diagnóstico web, verificación sitio, herramientas webmaster',
      canonical: '/gsc-diagnostic',
      lang: 'es'
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <GSCDiagnosticPanel />
    </div>
  );
}