import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { lazy, Suspense } from "react";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

const Lab = lazy(() => import("./pages/Lab"));
const CustomsQuote = lazy(() => import("./pages/CustomsQuote"));

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Suspense fallback={<main className="grid min-h-screen place-items-center bg-[#f5f1e8] p-6 text-center text-sm font-semibold text-[#6f685c]">Cargando módulo local…</main>}>
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/laboratorio"} component={Lab} />
      <Route path={"/laboratorio/cotizador"} component={CustomsQuote} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
    </Suspense>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
