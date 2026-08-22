import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import { buildPrintedExpression, buildSoapBody, querySatStatus, runSatStatus, satStatusInput } from "./satStatus";

const validInput = {
  issuerRfc: "AAA010101AAA",
  receiverRfc: "XAXX010101000",
  total: "100.00",
  uuid: "123e4567-e89b-12d3-a456-426614174000",
  sealLast8: "ABC12345",
};

describe("ConsultaCFDI SAT", () => {
  it("normaliza y construye la expresionImpresa sin incluir campos ajenos", () => {
    const input = satStatusInput.parse(validInput);
    expect(buildPrintedExpression(input)).toBe("?re=AAA010101AAA&rr=XAXX010101000&tt=100.00&id=123E4567-E89B-12D3-A456-426614174000&fe=ABC12345");
    expect(buildSoapBody(buildPrintedExpression(input))).toContain("<expresionImpresa>?re=AAA010101AAA&amp;rr=XAXX010101000&amp;tt=100.00&amp;id=123E4567-E89B-12D3-A456-426614174000&amp;fe=ABC12345</expresionImpresa>");
  });

  it("rechaza una entrada inválida antes de crear una petición", () => {
    expect(satStatusInput.safeParse({ ...validInput, uuid: "no-es-uuid" }).success).toBe(false);
    expect(satStatusInput.safeParse({ ...validInput, sealLast8: "corto" }).success).toBe(false);
  });

  it("devuelve errores de validación por campo sin iniciar una consulta", async () => {
    await expect(runSatStatus({ ...validInput, uuid: "no-es-uuid" })).resolves.toMatchObject({
      ok: false,
      code: "validation_error",
      fieldErrors: { uuid: ["El UUID no tiene un formato válido."] },
    });
  });

  it("expone errores por campo desde el procedimiento tRPC público", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const caller = appRouter.createCaller({ req: {}, res: {} } as Parameters<typeof appRouter.createCaller>[0]);

    await expect(caller.satStatus.query({ ...validInput, sealLast8: "corto" })).resolves.toMatchObject({
      ok: false,
      code: "validation_error",
      fieldErrors: { sealLast8: ["Ingresa exactamente los ocho últimos caracteres del sello."] },
    });
    expect(fetchMock).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it("devuelve únicamente el Acuse oficial tras una respuesta SOAP válida", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(`<?xml version="1.0"?><s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"><s:Body><ConsultaResponse xmlns="http://tempuri.org/"><ConsultaResult xmlns:a="http://schemas.datacontract.org/2004/07/Sat.Cfdi.Negocio.ConsultaCfdi.Servicio"><a:CodigoEstatus>S - Comprobante obtenido satisfactoriamente.</a:CodigoEstatus><a:Estado>Vigente</a:Estado><a:EsCancelable>No cancelable</a:EsCancelable><a:EstatusCancelacion>En proceso</a:EstatusCancelacion><a:ValidacionEFOS>200</a:ValidacionEFOS></ConsultaResult></ConsultaResponse></s:Body></s:Envelope>`, { status: 200 }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(querySatStatus(satStatusInput.parse(validInput))).resolves.toEqual({
      ok: true,
      httpStatus: 200,
      acuse: {
        CodigoEstatus: "S - Comprobante obtenido satisfactoriamente.",
        Estado: "Vigente",
        EsCancelable: "No cancelable",
        EstatusCancelacion: "En proceso",
        ValidacionEFOS: "200",
      },
    });
    expect(fetchMock).toHaveBeenCalledOnce();
    vi.unstubAllGlobals();
  });

  it("mantiene el error SOAP aunque el SAT responda HTTP 500", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(`<?xml version="1.0"?><s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"><s:Body><s:Fault><faultcode>s:Client</faultcode><faultstring>Expresión inválida</faultstring></s:Fault></s:Body></s:Envelope>`, { status: 500 })));
    await expect(querySatStatus(satStatusInput.parse(validInput))).resolves.toEqual({ ok: false, code: "soap_fault", httpStatus: 500 });
    vi.unstubAllGlobals();
  });
});
