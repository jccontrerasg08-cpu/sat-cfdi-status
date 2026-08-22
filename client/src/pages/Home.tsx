import { trpc } from "@/lib/trpc";
import {
  ArrowDown,
  ArrowUpRight,
  CheckCircle2,
  CircleAlert,
  Copy,
  FileKey2,
  FileText,
  Info,
  LoaderCircle,
  LockKeyhole,
  Network,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

type FormValues = {
  issuerRfc: string;
  receiverRfc: string;
  total: string;
  uuid: string;
  sealLast8: string;
};

type FieldName = keyof FormValues;

const emptyForm: FormValues = { issuerRfc: "", receiverRfc: "", total: "", uuid: "", sealLast8: "" };
const rfcPattern = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/i;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const fieldLabels: Record<FieldName, string> = {
  issuerRfc: "RFC del emisor",
  receiverRfc: "RFC del receptor",
  total: "Total de la factura",
  uuid: "UUID / Folio fiscal",
  sealLast8: "Últimos 8 del sello",
};

function validate(values: FormValues) {
  const errors: Partial<Record<FieldName, string>> = {};
  if (!rfcPattern.test(values.issuerRfc.trim())) errors.issuerRfc = "Revisa los 12 o 13 caracteres del RFC.";
  if (!rfcPattern.test(values.receiverRfc.trim())) errors.receiverRfc = "Revisa los 12 o 13 caracteres del RFC.";
  if (!/^\d{1,18}(?:\.\d{1,6})?$/.test(values.total.trim()) || Number(values.total) <= 0) errors.total = "Usa un importe mayor a cero, sin separadores de miles.";
  if (!uuidPattern.test(values.uuid.trim())) errors.uuid = "Usa el UUID completo con guiones.";
  if (values.sealLast8.trim().length !== 8 || /\s/.test(values.sealLast8)) errors.sealLast8 = "Ingresa exactamente ocho caracteres sin espacios.";
  return errors;
}

function Notice({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "error" }) {
  return <div className={`notice ${tone === "error" ? "notice-error" : ""}`}>{children}</div>;
}

export default function Home() {
  const [form, setForm] = useState<FormValues>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [copied, setCopied] = useState(false);
  const status = trpc.satStatus.query.useMutation();

  const expressionPreview = useMemo(() => {
    const pairs = [
      ["re", form.issuerRfc || "RFC_EMISOR"],
      ["rr", form.receiverRfc || "RFC_RECEPTOR"],
      ["tt", form.total || "TOTAL"],
      ["id", form.uuid || "UUID"],
      ["fe", form.sealLast8 || "ULTIMOS_8_SELLO"],
    ];
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
    status.mutate({ ...form, total: form.total.trim() });
  };

  const reset = () => {
    status.reset();
    setForm(emptyForm);
    setErrors({});
  };

  const copyExpression = async () => {
    await navigator.clipboard.writeText(expressionPreview);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const backendError = status.error?.message;
  const serverErrors = status.data && !status.data.ok && status.data.code === "validation_error" ? status.data.fieldErrors : {};
  const failedMessage = status.data && !status.data.ok
    ? {
        validation_error: "Revisa los campos señalados antes de volver a consultar.",
        network_error: "No se pudo conectar al servicio del SAT. Inténtalo de nuevo en unos minutos.",
        http_error: "El servicio del SAT respondió con un error de transporte.",
        soap_fault: "El SAT devolvió un error SOAP para esta consulta.",
        invalid_soap_response: "La respuesta del SAT no tuvo el formato esperado.",
        empty_acuse: "El SAT no devolvió un Acuse con datos consultables.",
      }[status.data.code]
    : null;

  return (
    <div className="min-h-screen overflow-hidden bg-[#f5f1e8] text-[#171611]">
      <div className="mesh mesh-one" aria-hidden="true" />
      <div className="mesh mesh-two" aria-hidden="true" />

      <header className="relative z-10 mx-auto flex w-full max-w-[1340px] items-center justify-between px-5 py-6 sm:px-8 lg:px-12">
        <a href="#consulta" className="group inline-flex items-center gap-3 font-[var(--font-display)] text-xl tracking-tight sm:text-2xl">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#171611] text-[#f5f1e8] transition-transform duration-200 group-hover:-rotate-6"><FileKey2 size={18} strokeWidth={1.8} /></span>
          consulta<span className="text-[#b76421]">.cfdi</span>
        </a>
        <a href="#como-funciona" className="hidden items-center gap-2 text-sm font-medium text-[#595649] transition-colors hover:text-[#171611] sm:flex">
          Cómo funciona <ArrowDown size={15} />
        </a>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-[1340px] px-5 pb-20 sm:px-8 lg:px-12">
        <section className="grid gap-10 pb-14 pt-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(560px,1.08fr)] lg:items-end lg:gap-16 lg:pb-20 lg:pt-16">
          <div className="max-w-xl">
            <div className="eyebrow"><span className="pulse-dot" /> Consulta individual · SAT</div>
            <h1 className="mt-5 font-[var(--font-display)] text-[clamp(3.15rem,7vw,6.8rem)] leading-[0.88] tracking-[-0.06em] text-[#171611]">Una factura.<br /><em className="font-normal text-[#b76421]">Una respuesta</em><br />oficial.</h1>
            <p className="mt-7 max-w-md text-base leading-7 text-[#595649] sm:text-lg">Consulta el estatus de un CFDI directamente en el servicio público del SAT. Sin cuenta, sin XML y sin conservar tus identificadores.</p>
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-[#49463d]">
              <span className="inline-flex items-center gap-2"><ShieldCheck size={17} className="text-[#26775a]" /> Sin credenciales</span>
              <span className="inline-flex items-center gap-2"><LockKeyhole size={17} className="text-[#26775a]" /> Sin almacenamiento</span>
              <span className="inline-flex items-center gap-2"><Network size={17} className="text-[#26775a]" /> Servicio público SAT</span>
            </div>
          </div>

          <section id="consulta" className="relative rounded-[2rem] border border-[#d9d2c4] bg-[#fffdf8]/90 p-5 shadow-[0_24px_80px_rgba(56,40,21,0.12)] backdrop-blur sm:p-8" aria-labelledby="form-title">
            <div className="mb-7 flex items-start justify-between gap-4 border-b border-[#e5ded1] pb-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b76421]">Consulta operativa</p>
                <h2 id="form-title" className="mt-2 font-[var(--font-display)] text-3xl tracking-[-0.035em]">Datos del comprobante</h2>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#edf5ef] px-3 py-1.5 text-xs font-semibold text-[#26775a]"><span className="h-1.5 w-1.5 rounded-full bg-[#26775a]" /> HTTPS</span>
            </div>

            <form onSubmit={submit} noValidate className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                {(["issuerRfc", "receiverRfc"] as FieldName[]).map(field => <Field key={field} label={fieldLabels[field]} hint={field === "issuerRfc" ? "Quien expidió la factura" : "A quien se expidió"} value={form[field]} error={errors[field] ?? serverErrors[field]?.[0]} onChange={value => update(field, value)} placeholder="XAXX010101000" autoComplete="off" />)}
              </div>
              <div className="grid gap-5 sm:grid-cols-[0.75fr_1.25fr]">
                <Field label={fieldLabels.total} hint="Ej. 1,250.00 → 1250.00" value={form.total} error={errors.total ?? serverErrors.total?.[0]} onChange={value => update("total", value)} placeholder="0.00" inputMode="decimal" autoComplete="off" />
                <Field label={fieldLabels.uuid} hint="Folio fiscal de 36 caracteres" value={form.uuid} error={errors.uuid ?? serverErrors.uuid?.[0]} onChange={value => update("uuid", value)} placeholder="00000000-0000-0000-0000-000000000000" autoComplete="off" />
              </div>
              <Field label={fieldLabels.sealLast8} hint="Los ocho últimos caracteres del sello digital" value={form.sealLast8} error={errors.sealLast8 ?? serverErrors.sealLast8?.[0]} onChange={value => update("sealLast8", value)} placeholder="ABC12345" maxLength={8} autoComplete="off" />

              <div className="flex flex-col gap-3 border-t border-[#e5ded1] pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-xs text-xs leading-5 text-[#777164]">Sólo se procesa esta solicitud. No guardamos RFC, UUID, total ni sello.</p>
                <button type="submit" disabled={status.isPending} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#171611] px-6 text-sm font-semibold text-[#fffdf8] transition hover:bg-[#2b2922] disabled:cursor-wait disabled:opacity-70">
                  {status.isPending ? <><LoaderCircle className="animate-spin" size={17} /> Consultando…</> : <>Consultar ante el SAT <ArrowUpRight size={17} /></>}
                </button>
              </div>
            </form>

            {(backendError || failedMessage) && <Notice tone="error"><CircleAlert size={19} /><div><strong>La consulta no pudo completarse.</strong><p>{failedMessage ?? "Revisa los datos e inténtalo nuevamente."}</p></div><button className="ml-auto rounded-full p-2 transition hover:bg-[#fde6de]" onClick={reset} aria-label="Limpiar formulario"><RotateCcw size={16} /></button></Notice>}

            {status.data?.ok && <div className="result-enter mt-7 border-t border-[#e5ded1] pt-7" aria-live="polite">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 text-[#26775a]"><CheckCircle2 size={21} /><span className="text-sm font-bold">Acuse recibido del SAT</span></div>
                <span className="rounded-full bg-[#f2eee5] px-3 py-1 text-xs font-medium text-[#605b50]">HTTP {status.data.httpStatus}</span>
              </div>
              <div className="grid divide-y divide-[#e6ded1] rounded-2xl border border-[#e6ded1] bg-[#fffdf8] sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                <AcuseCell label="Código de estatus" value={status.data.acuse.CodigoEstatus} />
                <AcuseCell label="Estado" value={status.data.acuse.Estado} />
                <AcuseCell label="Es cancelable" value={status.data.acuse.EsCancelable} />
                <AcuseCell label="Estatus de cancelación" value={status.data.acuse.EstatusCancelacion} />
                <div className="sm:col-span-2"><AcuseCell label="Validación EFOS" value={status.data.acuse.ValidacionEFOS} /></div>
              </div>
              <p className="mt-4 text-xs leading-5 text-[#777164]">Los valores se muestran tal como llegaron en el Acuse. Esta herramienta no los interpreta ni emite conclusiones fiscales.</p>
            </div>}
          </section>
        </section>

        <section className="grid gap-5 border-y border-[#d8d0c2] py-7 sm:grid-cols-3">
          <Feature number="01" icon={<FileText size={20} />} title="Captura" text="Ingresa cinco datos que ya están en el comprobante." />
          <Feature number="02" icon={<Network size={20} />} title="Consulta" text="Se construye la expresionImpresa y se envía una sola operación SOAP." />
          <Feature number="03" icon={<ShieldCheck size={20} />} title="Acuse" text="Recibes los campos oficiales, sin almacenamiento ni reinterpretación." />
        </section>

        <section id="como-funciona" className="grid gap-10 py-20 lg:grid-cols-[0.85fr_1.15fr] lg:py-28">
          <div>
            <div className="eyebrow">Cómo funciona</div>
            <h2 className="mt-5 max-w-md font-[var(--font-display)] text-5xl leading-[0.95] tracking-[-0.05em] sm:text-6xl">Una conexión breve con el <em className="font-normal text-[#b76421]">endpoint</em> público.</h2>
          </div>
          <div className="space-y-4">
            <InfoPanel number="1" title="Tu formulario se valida dos veces" text="Primero en el navegador y después en el servidor. Si un dato no cumple el formato, no se envía ninguna solicitud al SAT." />
            <InfoPanel number="2" title="El servidor crea la expresionImpresa" text="Agrupa re, rr, tt, id y fe en el formato requerido. Luego envía POST HTTPS al endpoint ConsultaCFDI con la operación Consulta y su SOAPAction." />
            <InfoPanel number="3" title="El SAT devuelve un Acuse" text="La respuesta SOAP contiene CodigoEstatus, Estado, EsCancelable, EstatusCancelacion y ValidacionEFOS. Aquí se presentan sin modificar su significado." />
          </div>
        </section>

        <section className="rounded-[2rem] bg-[#171611] px-6 py-8 text-[#f6f2e9] sm:px-9 sm:py-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.35fr] lg:items-start">
            <div>
              <div className="eyebrow eyebrow-dark">Contrato público</div>
              <h2 className="mt-4 font-[var(--font-display)] text-4xl tracking-[-0.04em]">Claro en lo que hace.<br />Estricto en lo que no.</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <ContractItem label="Endpoint" value="HTTPS · ConsultaCFDIService.svc" />
              <ContractItem label="Operación" value="Consulta · SOAPAction oficial" />
              <ContractItem label="Entrada" value="expresionImpresa, no XML" />
              <ContractItem label="Límites" value="Una consulta · sin login · sin datos guardados" />
            </div>
          </div>
          <div className="mt-8 flex flex-col justify-between gap-4 border-t border-white/15 pt-6 sm:flex-row sm:items-center">
            <p className="text-sm leading-6 text-[#d7d0c5]">Esta herramienta es operativa. Los fixtures, validación XSD y pruebas educativas pertenecen a otro contexto y no intervienen en esta consulta.</p>
            <a className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[#f5b46f] transition hover:text-white" href="https://consultaqr.facturaelectronica.sat.gob.mx/ConsultaCFDIService.svc" target="_blank" rel="noreferrer">Abrir WSDL oficial <ArrowUpRight size={16} /></a>
          </div>
        </section>

        <section className="grid gap-7 py-16 lg:grid-cols-[1fr_1fr] lg:py-24">
          <div className="rounded-3xl border border-[#d9d2c4] bg-[#faf7f0] p-6 sm:p-8">
            <div className="mb-5 flex items-center gap-2 text-[#b76421]"><FileKey2 size={19} /><span className="text-xs font-bold uppercase tracking-[0.16em]">Formato requerido</span></div>
            <p className="mb-5 text-sm leading-6 text-[#605b50]">La consulta usa una expresión impresa compuesta por los cinco datos del formulario.</p>
            <div className="flex items-start gap-3 rounded-2xl bg-[#ece5d9] p-4">
              <code className="min-w-0 flex-1 break-all font-mono text-xs leading-5 text-[#3d392f]">{expressionPreview}</code>
              <button onClick={copyExpression} className="rounded-lg p-2 text-[#595549] transition hover:bg-white" aria-label="Copiar expresión impresa"><Copy size={17} /></button>
            </div>
            <p className="mt-3 text-xs text-[#777164]">{copied ? "Expresión copiada al portapapeles." : "La vista previa es local; no se envía hasta que pulses “Consultar ante el SAT”."}</p>
          </div>
          <div className="rounded-3xl border border-[#d9d2c4] bg-[#faf7f0] p-6 sm:p-8">
            <div className="mb-5 flex items-center gap-2 text-[#b76421]"><LockKeyhole size={19} /><span className="text-xs font-bold uppercase tracking-[0.16em]">Límites de uso</span></div>
            <div className="space-y-3 text-sm leading-6 text-[#605b50]">
              <p><strong className="text-[#171611]">No hay inicio de sesión.</strong> El servicio es público y no solicita credenciales.</p>
              <p><strong className="text-[#171611]">No subes XML.</strong> Sólo se envía la expresión requerida por ConsultaCFDI.</p>
              <p><strong className="text-[#171611]">No se almacena la consulta.</strong> Los campos se usan únicamente durante la solicitud activa.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-[#d8d0c2] px-5 py-7 text-xs text-[#777164] sm:px-8 lg:px-12"><div className="mx-auto flex max-w-[1340px] flex-col justify-between gap-2 sm:flex-row"><span>Consulta CFDI · herramienta pública de consulta individual</span><span>Los resultados son el Acuse del SAT; no constituyen una conclusión fiscal.</span></div></footer>
    </div>
  );
}

function Field({ label, hint, value, error, onChange, placeholder, inputMode, maxLength, autoComplete }: { label: string; hint: string; value: string; error?: string; onChange: (value: string) => void; placeholder: string; inputMode?: "decimal"; maxLength?: number; autoComplete: string }) {
  const id = label.replaceAll(" ", "-").toLowerCase();
  return <label htmlFor={id} className="block"><span className="mb-2 flex justify-between gap-3 text-sm font-semibold text-[#302e27]"><span>{label}</span><span className="text-right text-xs font-normal text-[#8a8478]">{hint}</span></span><input id={id} value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} inputMode={inputMode} maxLength={maxLength} autoComplete={autoComplete} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} className={`h-12 w-full rounded-xl border bg-[#fffdf8] px-3.5 font-mono text-sm tracking-[0.02em] outline-none transition placeholder:text-[#b5afa2] focus:border-[#b76421] focus:ring-4 focus:ring-[#b76421]/10 ${error ? "border-[#c75042]" : "border-[#d8d0c2]"}`} />{error && <span id={`${id}-error`} className="mt-1.5 block text-xs text-[#b44035]">{error}</span>}</label>;
}

function AcuseCell({ label, value }: { label: string; value: string | null }) {
  return <div className="p-4 sm:p-5"><p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#8b8478]">{label}</p><p className="mt-2 text-sm font-semibold leading-5 text-[#27251f]">{value ?? "No informado por el SAT"}</p></div>;
}

function Feature({ number, icon, title, text }: { number: string; icon: React.ReactNode; title: string; text: string }) {
  return <div className="flex gap-4"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#e8dfd0] text-[#b76421]">{icon}</div><div><p className="text-xs font-bold tracking-[0.15em] text-[#a6a092]">{number}</p><h3 className="mt-1 font-[var(--font-display)] text-2xl tracking-[-0.025em]">{title}</h3><p className="mt-1 text-sm leading-6 text-[#696459]">{text}</p></div></div>;
}

function InfoPanel({ number, title, text }: { number: string; title: string; text: string }) {
  return <article className="group flex gap-5 rounded-2xl border border-[#dcd4c6] bg-[#faf7f0] p-5 transition hover:-translate-y-0.5 hover:border-[#b76421]/50"><span className="font-[var(--font-display)] text-3xl text-[#b76421]">{number}</span><div><h3 className="font-semibold text-[#24221d]">{title}</h3><p className="mt-1 text-sm leading-6 text-[#696459]">{text}</p></div></article>;
}

function ContractItem({ label, value }: { label: string; value: string }) {
  return <div className="border-l border-[#f5b46f]/50 pl-4"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#f5b46f]">{label}</p><p className="mt-1 text-sm leading-6 text-[#f1ede5]">{value}</p></div>;
}
