import { AlertTriangle, RotateCcw } from "lucide-react";
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="grid min-h-screen place-items-center bg-[#f5f1e8] p-6 text-[#171611]">
          <section className="w-full max-w-xl rounded-[2rem] border border-[#d9d2c4] bg-[#fffdf8] p-8 text-center shadow-[0_24px_80px_rgba(56,40,21,0.10)] sm:p-12">
            <AlertTriangle size={34} className="mx-auto text-[#b76421]" />
            <h2 className="mt-5 font-[var(--font-display)] text-3xl tracking-[-.04em]">No pudimos mostrar esta sección.</h2>
            <p className="mt-3 text-sm leading-6 text-[#696459]">Intenta recargar la página. No se muestran detalles internos para proteger la información de la aplicación.</p>
            <button onClick={() => window.location.reload()} className="mx-auto mt-7 inline-flex items-center gap-2 rounded-full bg-[#171611] px-5 py-3 text-sm font-semibold text-[#fffdf8] transition hover:bg-[#2b2922]"><RotateCcw size={16} /> Recargar página</button>
          </section>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
