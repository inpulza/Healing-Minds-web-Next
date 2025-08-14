import { useEffect } from 'react';
import { Switch, Route } from 'wouter';
import { queryClient } from './lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { useAnalytics } from '@/hooks/use-analytics';
import { initGA } from '@/lib/analytics';
import { addMedicalBusinessSchema, addPhysicianSchema } from '@/utils/seo';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Services from '@/pages/Services';
import ForPatients from '@/pages/ForPatients';
import Contact from '@/pages/Contact';
import ServiciosEspanol from '@/pages/ServiciosEspanol';
import NotFound from '@/pages/not-found';

function Router() {
  // Track page views when routes change
  useAnalytics();
  
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/services" component={Services} />
      <Route path="/for-patients" component={ForPatients} />
      <Route path="/contact" component={Contact} />
      <Route path="/servicios-espanol" component={ServiciosEspanol} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Initialize Google Analytics when app loads
  useEffect(() => {
    // Verify required environment variable is present
    if (!import.meta.env.VITE_GA_MEASUREMENT_ID) {
      console.warn('Missing required Google Analytics key: VITE_GA_MEASUREMENT_ID');
    } else {
      initGA();
    }

    // Add structured data schemas
    addMedicalBusinessSchema();
    addPhysicianSchema();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <Router />
          <Toaster />
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
