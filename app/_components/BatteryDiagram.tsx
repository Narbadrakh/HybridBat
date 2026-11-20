import type { BatterySpec } from "@/lib/models";

// Батерейны ерөнхий бүтцийн схем — lib/models.ts-ийн өгөгдлөөс зурна (зураг хуулахгүй).
// Модулийн тоо, цуваа холболт, хүчдэл, гол бүрэлдэхүүнийг харуулна. Бодит байрлал биш, ойлгоход зориулсан схем.

const GREEN = "#138a6e";

function layout(n: number) {
  // Мөрийн тоо: ≤40 модуль бол 2 мөр, түүнээс олон (Li-ion эс) бол 4 мөр
  const rows = n > 40 ? 4 : 2;
  return { rows, cols: Math.ceil(n / rows) };
}

export function BatteryDiagram({ spec }: { spec: BatterySpec }) {
  const { modules, voltage, capacityAh, chemistry } = spec;
  const unit = chemistry === "Li-ion" ? "эс" : "модуль";

  if (!modules || !voltage) {
    return (
      <div className="grid h-40 place-items-center rounded-xl border border-dashed border-slate-300 text-sm text-slate-400">
        Бүтцийн мэдээлэл тодруулагдаагүй
      </div>
    );
  }

  const perModule = Math.round((voltage / modules) * 10) / 10;
  const kwh = capacityAh ? Math.round(((voltage * capacityAh) / 1000) * 100) / 100 : null;

  // Схемийн хэмжээ
  const W = 600;
  const pack = { x: 40, y: 20, w: 490, h: 150 };
  const fanX = 568;
  const arrowId = `arrow-${chemistry}-${modules}`;
  const { rows, cols } = layout(modules);
  const pad = 14;
  const gap = cols > 20 ? 2 : 3;
  const gridH = 92;
  const mw = (pack.w - pad * 2 - gap * (cols - 1)) / cols;
  const mh = (gridH - gap * (rows - 1)) / rows;

  const cells = Array.from({ length: modules }, (_, i) => {
    const r = Math.floor(i / cols);
    // Могой хэлбэрийн цуваа холболт: тэгш мөр зүүнээс баруун, сондгой мөр баруунаас зүүн
    const c = r % 2 === 0 ? i % cols : cols - 1 - (i % cols);
    return { x: pack.x + pad + c * (mw + gap), y: pack.y + pad + r * (mh + gap) };
  });
  const first = cells[0];
  const last = cells[cells.length - 1];
  const compY = pack.y + pad + gridH + 10;

  return (
    <figure>
      <svg viewBox={`0 0 ${W} 200`} className="w-full" role="img" aria-label={`${modules} ${unit}тэй ${voltage}V батерейны схем`}>
        {/* Хөргөлтийн сэнс + агаарын урсгал */}
        <g>
          <circle cx={fanX} cy={pack.y + pack.h / 2} r="20" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />
          {[0, 120, 240].map((a) => (
            <ellipse
              key={a}
              cx={fanX}
              cy={pack.y + pack.h / 2 - 9}
              rx="5"
              ry="9"
              fill="#94a3b8"
              transform={`rotate(${a} ${fanX} ${pack.y + pack.h / 2})`}
            />
          ))}
          <path d={`M${fanX - 22} ${pack.y + pack.h / 2} h-12`} stroke="#94a3b8" strokeWidth="2" markerEnd={`url(#${arrowId})`} />
          <text x={fanX} y={pack.y + pack.h / 2 + 36} textAnchor="middle" fontSize="11" fill="#64748b">
            Сэнс
          </text>
        </g>

        <defs>
          <marker id={arrowId} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M0 0L10 5L0 10z" fill="#94a3b8" />
          </marker>
        </defs>

        {/* Савлагаа */}
        <rect x={pack.x} y={pack.y} width={pack.w} height={pack.h} rx="10" fill="#f8fafc" stroke="#334155" strokeWidth="2" />

        {/* Модуль / эсүүд */}
        {cells.map((p, i) => (
          <rect key={i} x={p.x} y={p.y} width={mw} height={mh} rx="2" fill={chemistry === "Li-ion" ? "#0ea5e9" : GREEN} opacity={0.85} />
        ))}

        {/* + / − гаралт: савлагааны зүүн хананд, эхний ба сүүлийн модулиас */}
        <g fontSize="13" fontWeight="700">
          {[
            { cell: first, sign: "+", color: "#dc2626" },
            { cell: last, sign: "−", color: "#1e293b" },
          ].map(({ cell, sign, color }) => {
            const cy = cell.y + mh / 2;
            // Сүүлийн модуль баруун талд дуусвал (сондгой мөртэй) баруун хананаас гаргана
            const right = cell.x > pack.x + pack.w / 2;
            const wallX = right ? pack.x + pack.w : pack.x;
            const tx = right ? wallX + 12 : wallX - 12;
            const from = right ? cell.x + mw : cell.x;
            return (
              <g key={sign}>
                <path d={`M${from} ${cy} H${tx}`} stroke={color} strokeWidth="2" />
                <circle cx={tx} cy={cy} r="9" fill={color} />
                <text x={tx} y={cy + 4.5} textAnchor="middle" fill="white">
                  {sign}
                </text>
              </g>
            );
          })}
        </g>

        {/* Гол бүрэлдэхүүн */}
        {[
          { label: "Батерейны ECU", x: pack.x + pad },
          { label: "Реле блок (SMR)", x: pack.x + pad + 165 },
          { label: "Сервис залгуур", x: pack.x + pad + 330 },
        ].map((c) => (
          <g key={c.label}>
            <rect x={c.x} y={compY} width="140" height="22" rx="5" fill="white" stroke="#cbd5e1" />
            <text x={c.x + 70} y={compY + 15} textAnchor="middle" fontSize="11" fill="#334155">
              {c.label}
            </text>
          </g>
        ))}

        <text x={pack.x + pack.w / 2} y="194" textAnchor="middle" fontSize="12" fill="#475569">
          {modules} {unit} цуваа холбогдсон (могой хэлбэрээр)
        </text>
      </svg>

      <figcaption className="mt-3 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-800">
          {modules} {unit} × {perModule}V = {voltage}V
        </span>
        {kwh && <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700">≈ {kwh} кВт·ц эрчим хүч</span>}
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700">📍 {spec.location}</span>
      </figcaption>
    </figure>
  );
}
