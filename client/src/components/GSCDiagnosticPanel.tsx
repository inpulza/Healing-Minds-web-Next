import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  FileText, 
  Globe, 
  AlertCircle, 
  CheckCircle2, 
  Copy, 
  Download,
  RefreshCw,
  Settings,
  Zap
} from 'lucide-react';
import { gscManager, GSCTestingUtils, type GSCDiagnosticData } from '@/lib/googleSearchConsole';
import { GSCTestRunner, type GSCTestResults } from '@/lib/gscTestRunner';
import { useToast } from '@/hooks/use-toast';

export function GSCDiagnosticPanel() {
  const [diagnosticData, setDiagnosticData] = useState<GSCDiagnosticData | null>(null);
  const [testResults, setTestResults] = useState<GSCTestResults | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosticReport, setDiagnosticReport] = useState('');
  const { toast } = useToast();

  // Run initial diagnosis
  useEffect(() => {
    runDiagnosis();
  }, []);

  const runDiagnosis = async () => {
    setIsLoading(true);
    try {
      const data = gscManager.diagnoseSEOSetup();
      setDiagnosticData(data);
      
      const report = await gscManager.generateDiagnosticReport();
      setDiagnosticReport(report);
      
      // Run comprehensive test
      const testResults = await GSCTestRunner.runCompleteTest();
      setTestResults(testResults);
    } catch (error) {
      console.error('Diagnosis failed:', error);
      toast({
        title: "Error de Diagnóstico",
        description: "No se pudo completar el diagnóstico de Google Search Console",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddVerification = () => {
    if (!verificationCode.trim()) {
      toast({
        title: "Código Requerido",
        description: "Por favor ingresa el código de verificación de Google Search Console",
        variant: "destructive"
      });
      return;
    }

    try {
      gscManager.addVerificationTag(verificationCode.trim());
      runDiagnosis(); // Re-run diagnosis
      toast({
        title: "Verificación Agregada",
        description: "El meta tag de verificación de Google Search Console ha sido agregado exitosamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo agregar el código de verificación",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado",
      description: "Contenido copiado al portapapeles",
    });
  };

  const downloadReport = () => {
    const blob = new Blob([diagnosticReport], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gsc-diagnostic-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const testSEOFiles = async () => {
    setIsLoading(true);
    try {
      const results = await gscManager.testSEOFiles();
      toast({
        title: "Prueba de Archivos SEO",
        description: `Sitemap: ${results.sitemap ? 'OK' : 'Error'}, Robots.txt: ${results.robots ? 'OK' : 'Error'}`,
        variant: results.sitemap && results.robots ? "default" : "destructive"
      });
      runDiagnosis();
    } catch (error) {
      toast({
        title: "Error de Prueba",
        description: "No se pudieron probar los archivos SEO",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const runCompleteTest = async () => {
    setIsLoading(true);
    try {
      const results = await GSCTestRunner.runCompleteTest();
      setTestResults(results);
      toast({
        title: "Prueba Completa Finalizada",
        description: results.summary,
        variant: results.overallStatus === 'pass' ? "default" : "destructive"
      });
    } catch (error) {
      toast({
        title: "Error en Prueba Completa",
        description: "No se pudo ejecutar la prueba completa",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const simulateURLInspection = () => {
    const results = gscManager.simulateURLInspection(window.location.href);
    toast({
      title: "Inspección de URL",
      description: `Indexable: ${results.indexable ? 'Sí' : 'No'}, Mobile-Friendly: ${results.mobileFriendly ? 'Sí' : 'No'}`,
    });
  };

  if (!diagnosticData) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" />
        <span>Ejecutando diagnóstico...</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Google Search Console - Panel de Diagnóstico</h1>
          <p className="text-muted-foreground mt-2">
            Herramientas completas para diagnóstico y pruebas de Google Search Console
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={runDiagnosis} disabled={isLoading} size="sm">
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="verification">Verificación</TabsTrigger>
          <TabsTrigger value="testing">Pruebas</TabsTrigger>
          <TabsTrigger value="results">Resultados</TabsTrigger>
          <TabsTrigger value="report">Reporte</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Meta Tags Health */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Globe className="w-5 h-5 mr-2" />
                  Meta Tags
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Title</span>
                  {diagnosticData.metaTagsHealth.title ? 
                    <CheckCircle2 className="w-4 h-4 text-green-600" /> : 
                    <AlertCircle className="w-4 h-4 text-red-600" />
                  }
                </div>
                <div className="flex items-center justify-between">
                  <span>Description</span>
                  {diagnosticData.metaTagsHealth.description ? 
                    <CheckCircle2 className="w-4 h-4 text-green-600" /> : 
                    <AlertCircle className="w-4 h-4 text-red-600" />
                  }
                </div>
                <div className="flex items-center justify-between">
                  <span>Canonical</span>
                  {diagnosticData.metaTagsHealth.canonical ? 
                    <CheckCircle2 className="w-4 h-4 text-green-600" /> : 
                    <AlertCircle className="w-4 h-4 text-red-600" />
                  }
                </div>
                <div className="flex items-center justify-between">
                  <span>Hreflang</span>
                  {diagnosticData.metaTagsHealth.hreflang ? 
                    <CheckCircle2 className="w-4 h-4 text-green-600" /> : 
                    <AlertCircle className="w-4 h-4 text-red-600" />
                  }
                </div>
              </CardContent>
            </Card>

            {/* Verification Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Search className="w-5 h-5 mr-2" />
                  Verificación GSC
                </CardTitle>
              </CardHeader>
              <CardContent>
                {diagnosticData.googleVerificationTag ? (
                  <div className="space-y-2">
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Verificado
                    </Badge>
                    <p className="text-sm text-muted-foreground break-all">
                      {diagnosticData.googleVerificationTag}
                    </p>
                  </div>
                ) : (
                  <Badge variant="destructive">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    No Verificado
                  </Badge>
                )}
              </CardContent>
            </Card>

            {/* Structured Data */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <FileText className="w-5 h-5 mr-2" />
                  Datos Estructurados
                </CardTitle>
              </CardHeader>
              <CardContent>
                {diagnosticData.structuredDataErrors.length === 0 ? (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Sin Errores
                  </Badge>
                ) : (
                  <div className="space-y-1">
                    <Badge variant="destructive">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {diagnosticData.structuredDataErrors.length} Error(es)
                    </Badge>
                    <ul className="text-sm text-muted-foreground">
                      {diagnosticData.structuredDataErrors.map((error, index) => (
                        <li key={index} className="truncate">• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
              <CardDescription>
                Herramientas de prueba para Google Search Console
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button onClick={testSEOFiles} variant="outline" size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  Probar Sitemap & Robots
                </Button>
                <Button onClick={simulateURLInspection} variant="outline" size="sm">
                  <Search className="w-4 h-4 mr-2" />
                  Inspeccionar URL
                </Button>
                <Button onClick={() => GSCTestingUtils.logSEOState()} variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Log Estado SEO
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurar Verificación de Google Search Console</CardTitle>
              <CardDescription>
                Agrega el código de verificación de Google Search Console a tu sitio web
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="verification-code">Código de Verificación</Label>
                <Input
                  id="verification-code"
                  placeholder="Ingresa tu código de verificación GSC"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  El código que obtienes de Google Search Console (sin los prefijos/sufijos HTML)
                </p>
              </div>
              
              <Button onClick={handleAddVerification} className="w-full">
                <Zap className="w-4 h-4 mr-2" />
                Agregar Código de Verificación
              </Button>

              {diagnosticData.googleVerificationTag && (
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Verificación Activa</AlertTitle>
                  <AlertDescription>
                    Código actual: {diagnosticData.googleVerificationTag}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Métodos de Verificación Alternativos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Archivo HTML de Verificación</h4>
                <p className="text-sm text-muted-foreground">
                  Si prefieres usar un archivo HTML, crea un archivo con este contenido:
                </p>
                <div className="bg-muted p-3 rounded-md">
                  <code className="text-sm">google-site-verification: google[TU-CODIGO].html</code>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="ml-2"
                    onClick={() => copyToClipboard('google-site-verification: google[TU-CODIGO].html')}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Verificación DNS</h4>
                <p className="text-sm text-muted-foreground">
                  Agrega un registro TXT a tu dominio con el valor proporcionado por Google
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Pruebas de Archivos SEO</CardTitle>
                <CardDescription>
                  Verifica la accesibilidad de sitemap.xml y robots.txt
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={testSEOFiles} disabled={isLoading} className="w-full">
                  <FileText className="w-4 h-4 mr-2" />
                  Probar Accesibilidad de Archivos
                </Button>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Sitemap.xml</span>
                    <a 
                      href="/sitemap.xml" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Ver Sitemap
                    </a>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Robots.txt</span>
                    <a 
                      href="/robots.txt" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Ver Robots
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Simulación de Herramientas GSC</CardTitle>
                <CardDescription>
                  Simula las herramientas de Google Search Console
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={simulateURLInspection} variant="outline" className="w-full">
                  <Search className="w-4 h-4 mr-2" />
                  Inspeccionar URL Actual
                </Button>
                
                <Button 
                  onClick={runCompleteTest}
                  disabled={isLoading}
                  variant="outline" 
                  className="w-full"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Ejecutar Prueba Completa
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          {testResults ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Overall Status */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    Estado General de la Prueba
                    <Badge 
                      variant={testResults.overallStatus === 'pass' ? 'default' : 'destructive'}
                      className="ml-2"
                    >
                      {testResults.overallStatus.toUpperCase()}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{testResults.summary}</CardDescription>
                </CardHeader>
              </Card>

              {/* SEO Files Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Archivos SEO
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Sitemap.xml</span>
                    {testResults.tests.seoFiles.sitemap ? 
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Accesible
                      </Badge> : 
                      <Badge variant="destructive">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Error
                      </Badge>
                    }
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Robots.txt</span>
                    {testResults.tests.seoFiles.robots ? 
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Accesible
                      </Badge> : 
                      <Badge variant="destructive">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Error
                      </Badge>
                    }
                  </div>
                </CardContent>
              </Card>

              {/* Meta Tags Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="w-5 h-5 mr-2" />
                    Meta Tags
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(testResults.tests.metaTags).map(([key, value]) => {
                    if (key === 'status') return null;
                    return (
                      <div key={key} className="flex items-center justify-between">
                        <span className="capitalize">{key}</span>
                        {value ? 
                          <CheckCircle2 className="w-4 h-4 text-green-600" /> : 
                          <AlertCircle className="w-4 h-4 text-red-600" />
                        }
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Structured Data Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    Datos Estructurados
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Esquemas Presentes</span>
                    {testResults.tests.structuredData.hasSchemas ? 
                      <CheckCircle2 className="w-4 h-4 text-green-600" /> : 
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    }
                  </div>
                  <div className="flex items-center justify-between">
                    <span>JSON-LD Válido</span>
                    {testResults.tests.structuredData.validJson ? 
                      <CheckCircle2 className="w-4 h-4 text-green-600" /> : 
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    }
                  </div>
                </CardContent>
              </Card>

              {/* Performance Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="w-5 h-5 mr-2" />
                    Rendimiento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Mobile-Friendly</span>
                    {testResults.tests.performance.mobileFriendly ? 
                      <CheckCircle2 className="w-4 h-4 text-green-600" /> : 
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    }
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Tiempo de Carga</span>
                    <span className="text-sm text-muted-foreground">
                      {testResults.tests.performance.pageLoadTime.toFixed(2)}ms
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              {testResults.recommendations.length > 0 && (
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Recomendaciones</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {testResults.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <AlertCircle className="w-4 h-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No hay resultados de prueba disponibles.</p>
                <Button onClick={runCompleteTest} className="mt-4">
                  <Zap className="w-4 h-4 mr-2" />
                  Ejecutar Prueba Completa
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="report" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Reporte de Diagnóstico Completo
                <div className="flex gap-2">
                  <Button 
                    onClick={() => copyToClipboard(diagnosticReport)} 
                    size="sm" 
                    variant="outline"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar
                  </Button>
                  <Button onClick={downloadReport} size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Descargar
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={diagnosticReport}
                readOnly
                className="min-h-[400px] font-mono text-sm"
                placeholder="Generando reporte de diagnóstico..."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}