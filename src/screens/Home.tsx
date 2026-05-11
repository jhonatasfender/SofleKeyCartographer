import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import sofleSvg from "../assets/svg/sofle.svg?raw";

export default function Home() {
  const [totalLayers, setTotalLayers] = useState<number>(4);
  const [selectedKeyIndex, setSelectedKeyIndex] = useState<number | null>(null);
  const [selectedKeyLabel, setSelectedKeyLabel] = useState<string>("");
  const [activeLayer, setActiveLayer] = useState<number>(0);
  const [targetLayer, setTargetLayer] = useState<number>(0);
  const [comboLayers, setComboLayers] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const containerEl = containerRef.current;
    if (!containerEl) return;

    const container = d3.select(containerEl);
    container.selectAll("*").remove();
    container.html(sofleSvg);

    const svg = container.select<SVGSVGElement>("svg");
    svg
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("preserveAspectRatio", "xMidYMid meet");

    const hasViewBox = !!svg.attr("viewBox");
    if (!hasViewBox) {
      const width = svg.attr("width") || "956";
      const height = svg.attr("height") || "420";
      svg.attr("viewBox", `0 0 ${width} ${height}`);
    }

    const styleId = "d3-enhancements";
    if (svg.select(`#${styleId}`).empty()) {
      svg
        .append("style")
        .attr("id", styleId)
        .text(
          ".selected-key{stroke:#22d3ee !important;stroke-width:3 !important;} rect.key{cursor:pointer} rect.combo, rect.combo-separate{cursor:pointer} rect.key:hover, rect.combo:hover, rect.combo-separate:hover{stroke:#a3a3a3;stroke-width:2;}",
        );
    }

    const keyRects = svg.selectAll<SVGRectElement, unknown>(
      "rect.key, rect.combo, rect.combo-separate",
    );
    keyRects.on("click", function () {
      const nodes = keyRects.nodes();
      const idx = nodes.indexOf(this as SVGRectElement);

      let label = "";
      const parent = (this as SVGRectElement).parentNode as SVGGElement | null;
      if (parent) {
        const g = d3.select(parent);
        const candidate = g.select("text");
        if (!candidate.empty()) {
          label = (candidate.text() || "").trim();
        }
      }
      setSelectedKeyIndex(idx >= 0 ? idx : null);
      setSelectedKeyLabel(label);
    });

    return () => {
      container.selectAll("*").remove();
    };
  }, []);

  useEffect(() => {
    const containerEl = containerRef.current;
    if (!containerEl) return;
    const svg = d3.select(containerEl).select<SVGSVGElement>("svg");
    if (svg.empty()) return;
    const keyRects = svg.selectAll<SVGRectElement, unknown>(
      "rect.key, rect.combo, rect.combo-separate",
    );
    keyRects.classed("selected-key", false);
    if (selectedKeyIndex != null) {
      const node = keyRects.nodes()[selectedKeyIndex];
      if (node) d3.select(node).classed("selected-key", true);
    }
  }, [selectedKeyIndex]);

  function toggleComboLayer(layerIndex: number): void {
    setComboLayers((prev) =>
      prev.includes(layerIndex)
        ? prev.filter((l) => l !== layerIndex)
        : [...prev, layerIndex].sort((a, b) => a - b),
    );
  }

  return (
    <div className="w-full mx-auto grid place-items-center">
      <div className="w-full max-w-[1100px] flex flex-col gap-4">
        <div className="w-full rounded-lg bg-neutral-900/60 border border-neutral-800/60 p-4 flex flex-col gap-3">
          <div className="text-sm font-medium text-neutral-200">Layers</div>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <label htmlFor="totalLayers" className="text-sm text-neutral-300">
                Total de layers
              </label>
              <input
                id="totalLayers"
                type="number"
                min={1}
                max={32}
                value={totalLayers}
                onChange={(e) => {
                  const next = Number(e.target.value);
                  if (Number.isNaN(next)) return;
                  const clamped = Math.min(32, Math.max(1, next));
                  setTotalLayers(clamped);
                  if (activeLayer >= clamped) setActiveLayer(clamped - 1);
                  if (targetLayer >= clamped) setTargetLayer(clamped - 1);
                  setComboLayers((prev) => prev.filter((l) => l < clamped));
                }}
                className="w-20 rounded-md border border-neutral-700 bg-neutral-800 px-2 py-1 text-neutral-100 focus:outline-none focus:ring focus:ring-neutral-600/40"
              />
            </div>
            <div className="flex items-center gap-3">
              <label htmlFor="activeLayer" className="text-sm text-neutral-300">
                Layer ativo
              </label>
              <select
                id="activeLayer"
                value={activeLayer}
                onChange={(e) => setActiveLayer(Number(e.target.value))}
                className="rounded-md border border-neutral-700 bg-neutral-800 px-2 py-1 text-neutral-100 focus:outline-none focus:ring focus:ring-neutral-600/40"
              >
                {Array.from({ length: totalLayers }).map((_, i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: totalLayers }).map((_, index) => (
              <span
                key={index}
                className={`inline-flex items-center justify-center rounded-md border px-2 py-1 text-xs ${
                  index === activeLayer
                    ? "border-cyan-500 bg-cyan-500/20 text-cyan-200"
                    : "border-neutral-700 bg-neutral-800 text-neutral-200"
                }`}
                title={`Layer ${index}`}
              >
                {index}
              </span>
            ))}
          </div>
        </div>

        <div className="w-full rounded-lg bg-neutral-900/60 border border-neutral-800/60 p-4 flex flex-col gap-4">
          <div className="text-sm font-medium text-neutral-200">Mapeamento da tecla</div>
          <ol className="list-decimal list-inside text-sm text-neutral-300 space-y-1">
            <li>Clique em uma tecla no layout abaixo.</li>
            <li>Escolha o layer alvo onde a tecla está.</li>
            <li>Se necessário, marque a combinação de layers que ativa o layer alvo.</li>
          </ol>
          <div className="flex items-center justify-between">
            <div className="text-sm text-neutral-300">
              Selecionado: 
              {selectedKeyIndex != null ? `Key #${selectedKeyIndex}` : "—"}
              {selectedKeyLabel ? ` (${selectedKeyLabel})` : ""}
            </div>
            <div className="flex items-center gap-3">
              <label htmlFor="targetLayer" className="text-sm text-neutral-300">
                Layer alvo
              </label>
              <select
                id="targetLayer"
                value={targetLayer}
                onChange={(e) => setTargetLayer(Number(e.target.value))}
                disabled={selectedKeyIndex == null}
                className="rounded-md border border-neutral-700 bg-neutral-800 px-2 py-1 text-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring focus:ring-neutral-600/40"
              >
                {Array.from({ length: totalLayers }).map((_, i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-sm text-neutral-300">Combinação de layers (se precisar ativar o layer alvo)</div>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: totalLayers }).map((_, i) => (
                <label key={i} className="inline-flex items-center gap-2 text-xs text-neutral-200">
                  <input
                    type="checkbox"
                    checked={comboLayers.includes(i)}
                    onChange={() => toggleComboLayer(i)}
                    disabled={selectedKeyIndex == null}
                    className="accent-cyan-400"
                  />
                  Layer {i}
                </label>
              ))}
            </div>
            <div className="text-xs text-neutral-400">
              Caminho: {comboLayers.length ? `[${comboLayers.join(" + ")}] -> ${targetLayer}` : `${targetLayer}`}
            </div>
          </div>
        </div>

        <div className="w-full aspect-[956/420] rounded-xl bg-neutral-900/40 border border-neutral-800/60 shadow-2xl overflow-hidden select-none">
          <div
            ref={containerRef}
            className="w-full h-full"
            aria-label="Sofle keyboard layout"
          />
        </div>
      </div>
    </div>
  );
}
