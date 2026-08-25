import React from "react";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("wouter", () => ({ Link: ({ children, ...props }: { children: React.ReactNode; href: string }) => React.createElement("a", props, children) }));

import Lab from "./Lab";

afterEach(cleanup);

describe("Laboratorio XML", () => {
  it("permite cargar, seleccionar, normalizar y validar XML sin abrir el WSDL", async () => {
    const user = userEvent.setup();
    const { container } = render(<Lab />);
    const editor = screen.getByLabelText("Editor XML local") as HTMLTextAreaElement;

    expect(screen.getByText("Usar fixture CFDI 4.0 válido")).toBeTruthy();
    expect(screen.queryByText("Abrir WSDL oficial")).toBeNull();

    await user.click(screen.getByText("Usar fixture CFDI 4.0 válido"));
    await waitFor(() => expect(editor.value).toContain("cfdi:Comprobante"));
    await waitFor(() => expect(screen.getByText("Estructura válida")).toBeTruthy());

    await user.click(screen.getByText("Usar fixture con error XSD"));
    await waitFor(() => expect(screen.getByText("Errores estructurales")).toBeTruthy());

    const file = new File(["<FixtureJournal><Entry><Line debit=\"1\" credit=\"1\" /></Entry></FixtureJournal>"], "fixture.xml", { type: "application/xml" });
    const upload = container.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(upload, file);
    await waitFor(() => expect(editor.value).toContain("FixtureJournal"));

    await user.clear(editor); await user.type(editor, "<Comprobante>");
    await user.click(screen.getByText("Normalizar"));
    await waitFor(() => expect(screen.getByText("El XML no puede normalizarse porque no es válido.")).toBeTruthy());
  });

  it("permite recorrer por teclado el editor y sus controles principales", async () => {
    const user = userEvent.setup();
    render(<Lab />);
    const editor = screen.getByLabelText("Editor XML local");

    await user.tab();
    await user.tab();
    await user.tab();
    expect(document.activeElement).toBe(editor);
    await user.type(editor, "<FixtureJournal />");
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Normalizar" }));
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Validar XML" }));
  });
});
