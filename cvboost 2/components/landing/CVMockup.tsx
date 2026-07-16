export default function CVMockup() {
  return (
    <div className="relative">
      <div className="absolute -inset-4 bg-signal/10 blur-3xl rounded-full" aria-hidden="true" />
      <div className="relative bg-surface border border-line rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-line" />
            <span className="w-2.5 h-2.5 rounded-full bg-line" />
            <span className="w-2.5 h-2.5 rounded-full bg-line" />
          </div>
          <span className="font-mono text-xs text-muted">analyse.pdf</span>
        </div>

        <div className="space-y-3 mb-6">
          <div className="h-3 w-2/3 bg-surface2 rounded" />
          <div className="h-2.5 w-1/2 bg-surface2 rounded" />
          <div className="h-2.5 w-5/6 bg-surface2 rounded" />
          <div className="h-2.5 w-3/4 bg-surface2 rounded" />
        </div>

        <div className="border-t border-line pt-5 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted mb-1">Score global</p>
            <p className="font-display text-3xl">
              82<span className="text-muted text-lg">/100</span>
            </p>
          </div>
          <div>
            <p className="text-xs text-muted mb-1">Score ATS</p>
            <p className="font-display text-3xl">
              87<span className="text-muted text-lg">/100</span>
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-start gap-2 bg-signal/10 border border-signal/30 rounded-lg p-3">
          <span className="text-signal font-mono text-xs mt-0.5">IA</span>
          <p className="text-xs text-[#E7E9EE] leading-relaxed">
            3 phrases faibles detectees, 2 competences cles manquantes pour ce poste.
          </p>
        </div>
      </div>
    </div>
  );
}
