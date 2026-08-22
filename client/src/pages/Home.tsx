import {
  CFDI_HISTORY_KEY,
  extractCfdiXml,
  mergeHistory,
  readHistory,
  type CfdiHistoryEntry,
  type CfdiPreview,
  type CfdiQuery,
} from "@/lib/cfdi";
import { trpc } from "@/lib/trpc";
import {
  ArrowDown,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Clock3,
  Copy,
  Eye,
  FileKey2,
  FileText,
  FileUp,
  History,
  Info,
  LoaderCircle,
  LockKeyhole,
  Network,
  Printer,
  RotateCcw,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { type ChangeEvent, type FormEvent, type ReactNode, useEffect, useMemo, useRef, useState } from "react";

type FormValues = CfdiQuery;
type FieldName = keyof FormValues;

const emptyForm: FormValues = { issuerRfc: "", receiverRfc: "", total: "", uuid: "", sealLast8: "" };
const rfcPattern = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/i;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{12}$/i;
const fieldLabels: Record<FieldName, string> = {
  issuerRfc: "RFC del emisor",
  receiverRfc: "RFC del receptor",
  total: "Total de la factura",
  uuid: "UUID / Folio fiscal",
  sealLast8: "Últimos 8 del sello",
};

const commonCfdiErrors = [
  { signal: "El archivo no se puede leer", title: "XML malformado o archivo equivocado", detail: "La estructura no puede interpretarse como XML, o el archivo no corresponde a un comprobante legible.", action: "Vuelve a descargar el XML original y selecciónalo sin cambiar su contenido." },
  { signal: "No aparece el UUID", title: "No se localiza TimbreFiscalDigital", detail: "El archivo no contiene un UUID disponible para la consulta de estatus.", action: "Revisa que sea un CFDI timbrado y que conserve su complemento fiscal digital." },
  { signal: "RFC o total rechazado", title: "Datos de consulta con formato inválido", detail: "La consulta requiere RFCs, total, UUID y sello en una forma específica.", action: "Confirma los atributos Emisor/Rfc, Receptor/Rfc y Comprobante/Total del XML." },
  { signal: "El sello no puede completarse", title: "Falta el atributo Sello", detail: "No se pueden obtener los ocho últimos caracteres requeridos por la expresión impresa.", action: "Usa el XML original del comprobante; evita archivos resumidos o modificados." },
  { signal: "El SAT no responde", title: "Fallo de red, HTTP o SOAP", detail: "El archivo puede haberse leído correctamente, pero el servicio público no completó la consulta.", action: "Intenta más tarde. No cambies los datos extraídos sólo para forzar una respuesta." },
];

function validate(values: FormValues) {
  const errors: Partial<Record<FieldName, string>> = {};
  if (!rfcPattern.test(values.issuerRfc.trim())) errors.issuerRfc = "Revisa los 12 o 13 caracteres del RFC.";
  if (!rfcPattern.test(values.receiverRfc.trim())) errors.receiverRfc = "Revisa los 12 o 13 caracteres del RFC.";
  if (!/^\d{1,18}(?:\.\d{1,6})?$/.test(values.total.trim()) || Number(values.total) <= 0) errors.total = "Usa un importe mayor a cero, sin separadores de miles.";
  if (!uuidPattern.test(values.uuid.trim())) errors.uuid = "Usa el UUID completo con guiones.";
  if (values.sealLast8.trim().length !== 8 || /\s/.test(values.sealLast8)) errors.sealLast8 = "Ingresa exactamente ocho caracteres sin espacios.";
  return errors;
}

function Notice({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "error" | "success" }) {
  return <div className={`notice ${tone === "error" ? "notice-error" : tone === "success" ? "notice-success" : ""}`}>{children}</div>;
}

export default function Home() {
  const [form, setForm] = useState<FormValues>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [copied, setCopied] = useState(false);
  const [xmlMessage, setXmlMessage] = useState<string | null>(null);
  const [xmlError, setXmlError] = useState<string | null>(null);
  const [preview, setPreview] = useState<CfdiPreview | null>(null);
  const [history, setHistory] = useState<CfdiHistoryEntry[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);
  const submittedQuery = useRef<FormValues | null>(null);
  const submittedPreview = useRef<CfdiPreview | null>(null);
  const status = trpc.satStatus.query.useMutation();

  useEffect(() => {
    try {
      setHistory(readHistory(window.localStorage.getItem(CFDI_HISTORY_KEY)));
    } catch {
      setHistory([]);
    }
  }, []);

  useEffect(() => {
    if (!status.data?.ok || !submittedQuery.current) return;
    const entry: CfdiHistoryEntry = {
      id: `${submittedQuery.current.uuid}:${Date.now()}`,
      savedAt: Date.now(),
      query: submittedQuery.current,
      preview: submittedPreview.current ?? { version: null, series: null, folio: null, issueDate: null, currency: null, documentType: null, subtotal: null, discount: null },
      acuse: { ...status.data.acuse },
    };
    setHistory(current => {
      const next = mergeHistory(current, entry);
      try { window.localStorage.setItem(CFDI_HISTORY_KEY, JSON.stringify(next)); } catch { /* Storage can be unavailable in private contexts. */ }
      return next;
    });
  }, [status.data]);

  const expressionPreview = useMemo(() => {
    const pairs = [["re", form.issuerRfc || "RFC_EMISOR"], ["rr", form.receiverRfc || "RFC_RECEPTOR"], ["tt", form.total || "TOTAL"], ["id", form.uuid || "UUID"], ["fe", form.sealLast8 || "ULTIMOS_8_SELLO"]];
    return `?${pairs.map(([key, value]) => `${key}=${value}`).join("&")}`;
  }, [form]);

  const update = (field: FieldName, value: string) => {
    const normalized = field === "issuerRfc" || field === "receiverRfc" || field === "uuid" || field === "sealLast8" ? value.toUpperCase() : value;
    setForm(current => ({ ...current, [field]: normalized }));
    setErrors(current => ({ ...current, [field]: undefined }));
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;
    const query = { ...form, total: form.total.trim() };
    submittedQuery.current = query;
    submittedPreview.current = preview;
    status.mutate(query);
  };

  const loadXml = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setXmlError(null);
    setXmlMessage(null);
    try {
      const extracted = extractCfdiXml(await file.text());
      setForm(extracted.query);
      setPreview(extracted.preview);
      setErrors({});
      status.reset();
      setXmlMessage("Datos extraídos localmente. El XML no se envió ni se guardó.");
    } catch (error) {
      setXmlError(error instanceof Error ? error.message : "No fue posible leer el XML.");
    }
  };

  const restoreHistory = (entry: CfdiHistoryEntry) => {
    setForm(entry.query);
    setPreview(entry.preview);
    setErrors({});
    status.reset();
    setXmlMessage("Datos recuperados desde este navegador. No se volvió a consultar al SAT.");
    document.getElementById("consulta")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const clearHistory = () => {
    setHistory([]);
    try { window.localStorage.removeItem(CFDI_HISTORY_KEY); } catch { /* Storage can be unavailable in private contexts. */ }
  };

  const reset = () => {
    status.reset();
    setForm(emptyForm);
    setPreview(null);
    setErrors({});
    setXmlError(null);
    setXmlMessage(null);
  };

  const copyExpression = async () => {
    await navigator.clipboard.writeText(expressionPreview);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const serverErrors = status.data && !status.data.ok && status.data.code === "validation_error" ? status.data.fieldErrors : {};
  const failedMessage = status.data && !status.data.ok
    ? { validation_error: "Revisa los campos señalados antes de volver a consultar.", network_error: "No se pudo conectar al servicio del SAT. Inténtalo de nuevo en unos minutos.", http_error: "El servicio del SAT respondió con un error de transporte.", soap_fault: "El SAT devolvió un error SOAP para esta consulta.", invalid_soap_response: "La respuesta del SAT no tuvo el formato esperado.", empty_acuse: "El SAT no devolvió un Acuse con datos consultables." }[status.data.code]
    : null;

  return (
    <div className="min-h-screen overflow-hidden bg-[#f5f1e8] text-[#171611]">
      <div className="mesh mesh-one" aria-hidden="true" /><div className="mesh mesh-two" aria-hidden="true" />
      <header className="screen-only relative z-10 mx-auto flex w-full max-w-[1340px] items-center justify-between px-5 py-6 sm:px-8 lg:px-12">
        <a href="#consulta" className="group inline-flex items-center gap-3 font-[var(--font-display)] text-xl tracking-tight sm:text-2xl"><span className="grid h-9 w-9 place-items-center rounded-full bg-[#171611] text-[#f5f1e8] transition-transform duration-200 group-hover:-rotate-6"><FileKey2 size={18} strokeWidth={1.8} /></span>consulta<span className="text-[#b76421]">.cfdi</span></a>
        <nav className="hidden items-center gap-5 text-sm font-medium text-[#595649] sm:flex" aria-label="Secciones de la página"><a href="/laboratorio" className="transition-colors hover:text-[#b76421]">Laboratorio</a><a href="#errores-cfdi" className="transition-colors hover:text-[#b76421]">Errores frecuentes</a><a href="#como-funciona" className="inline-flex items-center gap-2 transition-colors hover:text-[#171611]">Cómo funciona <ArrowDown size={15} /></a></nav>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-[1340px] px-5 pb-20 sm:px-8 lg:px-12">
        <section className="screen-only grid gap-10 pb-14 pt-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(560px,1.08fr)] lg:items-end lg:gap-16 lg:pb-20 lg:pt-16">
          <div className="max-w-xl"><div className="eyebrow"><span className="pulse-dot" /> Consulta individual · SAT</div><h1 className="mt-5 font-[var(--font-display)] text-[clamp(3.15rem,7vw,6.8rem)] leading-[0.88] tracking-[-0.06em] text-[#171611]">Una factura.<br /><em className="font-normal text-[#b76421]">Una respuesta</em><br />oficial.</h1><p className="mt-7 max-w-md text-base leading-7 text-[#595649] sm:text-lg">Carga un XML local o captura los datos. La factura nunca llega al servidor; sólo la expresión requerida viaja al SAT.</p><div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-[#49463d]"><span className="inline-flex items-center gap-2"><ShieldCheck size={17} className="text-[#26775a]" /> Sin credenciales</span><span className="inline-flex items-center gap-2"><LockKeyhole size={17} className="text-[#26775a]" /> XML local</span><span className="inline-flex items-center gap-2"><Network size={17} className="text-[#26775a]" /> Servicio público SAT</span></div></div>

          <section id="consulta" className="relative rounded-[2rem] border border-[#d9d2c4] bg-[#fffdf8]/90 p-5 shadow-[0_24px_80px_rgba(56,40,21,0.12)] backdrop-blur sm:p-8" aria-labelledby="form-title">
            <div className="mb-7 flex items-start justify-between gap-4 border-b border-[#e5ded1] pb-6"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b76421]">Consulta operativa</p><h2 id="form-title" className="mt-2 font-[var(--font-display)] text-3xl tracking-[-0.035em]">Datos del comprobante</h2></div><span className="inline-flex items-center gap-1.5 rounded-full bg-[#edf5ef] px-3 py-1.5 text-xs font-semibold text-[#26775a]"><span className="h-1.5 w-1.5 rounded-full bg-[#26775a]" /> HTTPS</span></div>
            <div className="mb-6 rounded-2xl border border-dashed border-[#cbbda8] bg-[#faf6ef] p-4"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-[#efe2d1] text-[#b76421]"><FileUp size={18} /></span><div><p className="text-sm font-bold text-[#302e27]">Completar desde XML</p><p className="text-xs text-[#777164]">Se lee sólo en este dispositivo.</p></div></div><button type="button" onClick={() => fileInput.current?.click()} className="inline-flex items-center justify-center gap-2 rounded-full border border-[#b76421] px-4 py-2 text-sm font-semibold text-[#9b571f] transition hover:bg-[#f3e4d3]"><FileUp size={16} /> Seleccionar XML</button></div><input ref={fileInput} type="file" accept=".xml,application/xml,text/xml" onChange={loadXml} className="sr-only" />{xmlMessage && <Notice tone="success"><CheckCircle2 size={18} /><p>{xmlMessage}</p></Notice>}{xmlError && <Notice tone="error"><CircleAlert size={18} /><p>{xmlError}</p></Notice>}</div>
            <form onSubmit={submit} noValidate className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">{(["issuerRfc", "receiverRfc"] as FieldName[]).map(field => <Field key={field} label={fieldLabels[field]} hint={field === "issuerRfc" ? "Quien expidió la factura" : "A quien se expidió"} value={form[field]} error={errors[field] ?? serverErrors[field]?.[0]} onChange={value => update(field, value)} placeholder="XAXX010101000" autoComplete="off" />)}</div>
              <div className="grid gap-5 sm:grid-cols-[0.75fr_1.25fr]"><Field label={fieldLabels.total} hint="Ej. 1,250.00 → 1250.00" value={form.total} error={errors.total ?? serverErrors.total?.[0]} onChange={value => update("total", value)} placeholder="0.00" inputMode="decimal" autoComplete="off" /><Field label={fieldLabels.uuid} hint="Folio fiscal de 36 caracteres" value={form.uuid} error={errors.uuid ?? serverErrors.uuid?.[0]} onChange={value => update("uuid", value)} placeholder="00000000-0000-0000-0000-000000000000" autoComplete="off" /></div>
              <Field label={fieldLabels.sealLast8} hint="Los ocho últimos caracteres del sello digital" value={form.sealLast8} error={errors.sealLast8 ?? serverErrors.sealLast8?.[0]} onChange={value => update("sealLast8", value)} placeholder="ABC12345" maxLength={8} autoComplete="off" />
              <div className="flex flex-col gap-3 border-t border-[#e5ded1] pt-6 sm:flex-row sm:items-center sm:justify-between"><p className="max-w-xs text-xs leading-5 text-[#777164]">El XML permanece local. Sólo se procesa la expresión de consulta cuando tú la envías.</p><button type="submit" disabled={status.isPending} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#171611] px-6 text-sm font-semibold text-[#fffdf8] transition hover:bg-[#2b2922] disabled:cursor-wait disabled:opacity-70">{status.isPending ? <><LoaderCircle className="animate-spin" size={17} /> Consultando…</> : <>Consultar ante el SAT <ArrowUpRight size={17} /></>}</button></div>
            </form>
            {status.isPending && <ProgressFlow />}
            {failedMessage && <Notice tone="error"><CircleAlert size={19} /><div><strong>La consulta no pudo completarse.</strong><p>{failedMessage}</p></div><button className="ml-auto rounded-full p-2 transition hover:bg-[#fde6de]" onClick={reset} aria-label="Limpiar formulario"><RotateCcw size={16} /></button></Notice>}
            {status.data?.ok && <AcuseResult acuse={status.data.acuse} httpStatus={status.data.httpStatus} />}
          </section>
        </section>

        {(preview || history.length > 0) && <section className="screen-only grid gap-7 pb-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,.75fr)]">
          {preview ? <InvoicePreview form={form} preview={preview} /> : <div />}
          <HistoryPanel entries={history} onRestore={restoreHistory} onClear={clearHistory} />
        </section>}

        {preview && <InvoicePrintSheet form={form} preview={preview} acuse={status.data?.ok ? status.data.acuse : null} />}

        <section className="screen-only grid gap-5 border-y border-[#d8d0c2] py-7 sm:grid-cols-3"><Feature number="01" icon={<FileText size={20} />} title="Captura" text="Completa datos o usa un XML que se lee localmente." /><Feature number="02" icon={<Network size={20} />} title="Consulta" text="Sólo la expresión impresa viaja al endpoint público." /><Feature number="03" icon={<ShieldCheck size={20} />} title="Acuse" text="Recibes el resultado oficial y puedes conservarlo sólo aquí." /></section>
        <section id="como-funciona" className="screen-only grid gap-10 py-20 lg:grid-cols-[0.85fr_1.15fr] lg:py-28"><div><div className="eyebrow">Cómo funciona</div><h2 className="mt-5 max-w-md font-[var(--font-display)] text-5xl leading-[0.95] tracking-[-0.05em] sm:text-6xl">Una conexión breve con el <em className="font-normal text-[#b76421]">endpoint</em> público.</h2></div><div className="space-y-4"><InfoPanel number="1" title="El XML sólo se lee aquí" text="El navegador extrae los cinco datos del comprobante; el archivo no se sube ni entra al historial." /><InfoPanel number="2" title="El servidor crea la expresionImpresa" text="Agrupa re, rr, tt, id y fe, y envía POST HTTPS mediante la operación Consulta." /><InfoPanel number="3" title="El SAT devuelve un Acuse" text="La respuesta conserva CodigoEstatus, Estado, EsCancelable, EstatusCancelacion y ValidacionEFOS." /></div></section>
        <section id="errores-cfdi" className="screen-only grid gap-10 border-t border-[#d8d0c2] py-20 lg:grid-cols-[.8fr_1.2fr] lg:py-28"><div><div className="eyebrow"><CircleAlert size={14} /> Guía de lectura</div><h2 className="mt-5 max-w-md font-[var(--font-display)] text-5xl leading-[0.95] tracking-[-0.05em] sm:text-6xl">Errores típicos.<br /><em className="font-normal text-[#b76421]">Acciones claras.</em></h2><p className="mt-6 max-w-md text-sm leading-6 text-[#696459]">Esta guía ayuda a entender los mensajes de carga y consulta. No valida cumplimiento fiscal ni sustituye una revisión profesional.</p></div><div className="space-y-3">{commonCfdiErrors.map(error => <details key={error.title} className="group rounded-2xl border border-[#dcd4c6] bg-[#faf7f0] px-5 transition open:border-[#b76421]/55 open:bg-[#fffdf8]"><summary className="flex cursor-pointer list-none items-center gap-4 py-5"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#efe2d1] text-xs font-bold text-[#b76421]">!</span><span className="min-w-0 flex-1"><span className="block text-xs font-bold uppercase tracking-[.12em] text-[#9a7252]">{error.signal}</span><span className="mt-1 block font-semibold text-[#29261f]">{error.title}</span></span><ChevronRight size={17} className="shrink-0 text-[#9d9181] transition-transform group-open:rotate-90" /></summary><div className="border-t border-[#e7ded1] pb-5 pt-4 text-sm leading-6 text-[#696459]"><p>{error.detail}</p><p className="mt-3 rounded-xl bg-[#f3eee5] px-3.5 py-3 text-[#494238]"><strong className="mr-1 text-[#9b571f]">Qué hacer:</strong>{error.action}</p></div></details>)}</div></section>
        <section className="screen-only rounded-[2rem] bg-[#171611] px-6 py-8 text-[#f6f2e9] sm:px-9 sm:py-10"><div className="grid gap-8 lg:grid-cols-[1fr_1.35fr] lg:items-start"><div><div className="eyebrow eyebrow-dark">Contrato público</div><h2 className="mt-4 font-[var(--font-display)] text-4xl tracking-[-0.04em]">Claro en lo que hace.<br />Estricto en lo que no.</h2></div><div className="grid gap-4 sm:grid-cols-2"><ContractItem label="Endpoint" value="HTTPS · ConsultaCFDIService.svc" /><ContractItem label="Operación" value="Consulta · SOAPAction oficial" /><ContractItem label="Entrada" value="expresionImpresa, no XML" /><ContractItem label="Límites" value="Una consulta · sin login · historial local opcional" /></div></div><div className="mt-8 flex flex-col justify-between gap-4 border-t border-white/15 pt-6 sm:flex-row sm:items-center"><p className="text-sm leading-6 text-[#d7d0c5]">El historial se guarda únicamente en este navegador y se puede eliminar. Los fixtures y XSD no intervienen en la consulta.</p><a className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[#f5b46f] transition hover:text-white" href="https://consultaqr.facturaelectronica.sat.gob.mx/ConsultaCFDIService.svc" target="_blank" rel="noreferrer">Abrir WSDL oficial <ArrowUpRight size={16} /></a></div></section>
      </main>
      <footer className="screen-only relative z-10 border-t border-[#d8d0c2] px-5 py-7 text-xs text-[#777164] sm:px-8 lg:px-12"><div className="mx-auto flex max-w-[1340px] flex-col justify-between gap-2 sm:flex-row"><span>Consulta CFDI · herramienta pública de consulta individual</span><span>Los resultados son el Acuse del SAT; no constituyen una conclusión fiscal.</span></div></footer>
    </div>
  );
}

function Field({ label, hint, value, error, onChange, placeholder, inputMode, maxLength, autoComplete }: { label: string; hint: string; value: string; error?: string; onChange: (value: string) => void; placeholder: string; inputMode?: "decimal"; maxLength?: number; autoComplete: string }) {
  const id = label.replaceAll(" ", "-").toLowerCase();
  return <label htmlFor={id} className="block"><span className="mb-2 flex justify-between gap-3 text-sm font-semibold text-[#302e27]"><span>{label}</span><span className="text-right text-xs font-normal text-[#8a8478]">{hint}</span></span><input id={id} value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} inputMode={inputMode} maxLength={maxLength} autoComplete={autoComplete} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} className={`h-12 w-full rounded-xl border bg-[#fffdf8] px-3.5 font-mono text-sm tracking-[0.02em] outline-none transition placeholder:text-[#b5afa2] focus:border-[#b76421] focus:ring-4 focus:ring-[#b76421]/10 ${error ? "border-[#c75042]" : "border-[#d8d0c2]"}`} />{error && <span id={`${id}-error`} className="mt-1.5 block text-xs text-[#b44035]">{error}</span>}</label>;
}

function ProgressFlow() {
  return <div className="progress-flow mt-7" aria-live="polite"><div className="flex items-center justify-between"><div><p className="text-sm font-bold text-[#2a2923]">Solicitud en curso</p><p className="mt-1 text-xs text-[#777164]">Esperando la respuesta pública del SAT.</p></div><LoaderCircle className="animate-spin text-[#b76421]" size={22} /></div><div className="mt-5 grid grid-cols-3 gap-2">{["Validando", "Conectando", "Recibiendo Acuse"].map((label, index) => <div key={label} className="progress-step" style={{ animationDelay: `${index * 180}ms` }}><span>{String(index + 1).padStart(2, "0")}</span>{label}</div>)}</div></div>;
}

function AcuseResult({ acuse, httpStatus }: { acuse: Record<string, string | null>; httpStatus: number }) {
  return <div className="result-enter mt-7 border-t border-[#e5ded1] pt-7" aria-live="polite"><div className="acuse-hero"><div><p className="eyebrow">Respuesta recibida</p><h3 className="mt-2 font-[var(--font-display)] text-3xl tracking-[-0.035em]">Acuse oficial del SAT</h3><p className="mt-2 text-sm text-[#686256]">Los valores se muestran tal como llegaron del servicio.</p></div><div className="rounded-2xl bg-[#f3eee5] px-4 py-3 text-right"><p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#837b6d]">Transporte</p><p className="mt-1 text-sm font-bold text-[#38342c]">HTTP {httpStatus}</p></div></div><div className="mt-5 grid gap-3 sm:grid-cols-2"><AcuseCell label="Código de estatus" value={acuse.CodigoEstatus} primary /><AcuseCell label="Estado" value={acuse.Estado} primary /><AcuseCell label="Es cancelable" value={acuse.EsCancelable} /><AcuseCell label="Estatus de cancelación" value={acuse.EstatusCancelacion} /><div className="sm:col-span-2"><AcuseCell label="Validación EFOS" value={acuse.ValidacionEFOS} /></div></div><p className="mt-4 text-xs leading-5 text-[#777164]">Esta presentación ordena la respuesta para lectura; no clasifica ni modifica el significado de los valores oficiales.</p></div>;
}

function AcuseCell({ label, value, primary = false }: { label: string; value: string | null; primary?: boolean }) {
  return <div className={`acuse-cell ${primary ? "acuse-cell-primary" : ""}`}><p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#8b8478]">{label}</p><p className="mt-2 text-sm font-semibold leading-5 text-[#27251f]">{value ?? "No informado por el SAT"}</p></div>;
}

function InvoicePreview({ form, preview }: { form: FormValues; preview: CfdiPreview }) {
  const identity = [preview.series, preview.folio].filter(Boolean).join("-") || "Sin serie ni folio";
  return <article className="invoice-preview rounded-[2rem] border border-[#d9d2c4] bg-[#fffdf8] p-6 shadow-[0_18px_50px_rgba(56,40,21,0.07)] sm:p-8"><div className="flex flex-col justify-between gap-5 border-b border-[#e7ded1] pb-6 sm:flex-row"><div><div className="eyebrow"><Eye size={14} /> Vista previa local</div><h2 className="mt-3 font-[var(--font-display)] text-3xl tracking-[-0.035em]">Factura extraída</h2><p className="mt-1 text-sm text-[#70695c]">HTML semántico generado desde el XML, listo para imprimir.</p></div><button onClick={() => window.print()} className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#b76421] px-4 text-sm font-semibold text-[#9b571f] transition hover:bg-[#f3e4d3]"><Printer size={16} /> Guardar como PDF</button></div><dl className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3"><PreviewItem label="RFC emisor" value={form.issuerRfc} /><PreviewItem label="RFC receptor" value={form.receiverRfc} /><PreviewItem label="UUID" value={form.uuid} mono /><PreviewItem label="Serie / Folio" value={identity} /><PreviewItem label="Fecha de emisión" value={preview.issueDate ?? "No disponible"} /><PreviewItem label="Tipo / moneda" value={[preview.documentType, preview.currency].filter(Boolean).join(" · ") || "No disponible"} /><PreviewItem label="Subtotal" value={preview.subtotal ?? "No disponible"} /><PreviewItem label="Descuento" value={preview.discount ?? "No aplica"} /><PreviewItem label="Total" value={form.total} emphasis /></dl></article>;
}

function InvoicePrintSheet({ form, preview, acuse }: { form: FormValues; preview: CfdiPreview; acuse: Record<string, string | null> | null }) {
  return <section className="print-sheet"><div className="print-brand">consulta.cfdi <span>· comprobante</span></div><h1>Vista previa de CFDI</h1><p>Generada localmente desde el XML; no constituye una representación impresa certificada.</p><dl><PreviewItem label="RFC emisor" value={form.issuerRfc} /><PreviewItem label="RFC receptor" value={form.receiverRfc} /><PreviewItem label="UUID" value={form.uuid} /><PreviewItem label="Total" value={form.total} /><PreviewItem label="Fecha" value={preview.issueDate ?? "No disponible"} /><PreviewItem label="Serie / Folio" value={[preview.series, preview.folio].filter(Boolean).join("-") || "No disponible"} /></dl>{acuse && <div className="print-acuse"><h2>Acuse SAT</h2>{Object.entries(acuse).map(([label, value]) => <p key={label}><strong>{label}</strong><span>{value ?? "No informado"}</span></p>)}</div>}</section>;
}

function PreviewItem({ label, value, mono = false, emphasis = false }: { label: string; value: string; mono?: boolean; emphasis?: boolean }) { return <div><dt>{label}</dt><dd className={`${mono ? "font-mono text-xs" : ""} ${emphasis ? "text-xl font-bold text-[#b76421]" : ""}`}>{value}</dd></div>; }

function HistoryPanel({ entries, onRestore, onClear }: { entries: CfdiHistoryEntry[]; onRestore: (entry: CfdiHistoryEntry) => void; onClear: () => void }) {
  return <aside className="rounded-[2rem] border border-[#d9d2c4] bg-[#faf7f0] p-6"><div className="flex items-start justify-between gap-3"><div><div className="eyebrow"><History size={14} /> Este navegador</div><h2 className="mt-3 font-[var(--font-display)] text-3xl tracking-[-0.035em]">Consultas recientes</h2></div>{entries.length > 0 && <button onClick={onClear} className="rounded-full p-2 text-[#777164] transition hover:bg-[#eee5d8] hover:text-[#b44035]" aria-label="Borrar historial local"><Trash2 size={17} /></button>}</div><p className="mt-3 text-sm leading-6 text-[#70695c]">Hasta ocho Acuses exitosos se guardan sólo en este navegador. El XML nunca se conserva.</p>{entries.length === 0 ? <div className="mt-6 rounded-2xl border border-dashed border-[#d8cebf] p-5 text-sm leading-6 text-[#81796d]"><Clock3 className="mb-3 text-[#b76421]" size={19} />Aún no hay consultas guardadas localmente.</div> : <div className="mt-5 space-y-2">{entries.map(entry => <button key={entry.id} onClick={() => onRestore(entry)} className="group flex w-full items-center gap-3 rounded-xl border border-[#e0d7ca] bg-[#fffdf8] p-3 text-left transition hover:border-[#b76421]/60 hover:bg-white"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#edf5ef] text-[#26775a]"><CheckCircle2 size={15} /></span><span className="min-w-0 flex-1"><span className="block truncate font-mono text-xs font-semibold text-[#353129]">{entry.query.uuid}</span><span className="mt-0.5 block text-xs text-[#81796d]">{new Date(entry.savedAt).toLocaleString()}</span></span><ChevronRight size={16} className="text-[#a69c8d] transition-transform group-hover:translate-x-0.5" /></button>)}</div>}</aside>;
}

function Feature({ number, icon, title, text }: { number: string; icon: ReactNode; title: string; text: string }) { return <div className="flex gap-4"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#e8dfd0] text-[#b76421]">{icon}</div><div><p className="text-xs font-bold tracking-[0.15em] text-[#a6a092]">{number}</p><h3 className="mt-1 font-[var(--font-display)] text-2xl tracking-[-0.025em]">{title}</h3><p className="mt-1 text-sm leading-6 text-[#696459]">{text}</p></div></div>; }
function InfoPanel({ number, title, text }: { number: string; title: string; text: string }) { return <article className="group flex gap-5 rounded-2xl border border-[#dcd4c6] bg-[#faf7f0] p-5 transition hover:-translate-y-0.5 hover:border-[#b76421]/50"><span className="font-[var(--font-display)] text-3xl text-[#b76421]">{number}</span><div><h3 className="font-semibold text-[#24221d]">{title}</h3><p className="mt-1 text-sm leading-6 text-[#696459]">{text}</p></div></article>; }
function ContractItem({ label, value }: { label: string; value: string }) { return <div className="border-l border-[#f5b46f]/50 pl-4"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#f5b46f]">{label}</p><p className="mt-1 text-sm leading-6 text-[#f1ede5]">{value}</p></div>; }
