export default function PlantaTorre({ className = '' }: { className?: string }) {
  return (
    <div className={`relative w-16 h-full flex flex-col items-center justify-end select-none pointer-events-none ${className}`}>
      {/* Hojas trepando */}
      <span className="animate-hoja text-xl -mb-1 ml-3" style={{ animationDelay: '0s' }}>
        🌿
      </span>
      <span className="animate-hoja text-lg -mb-1 -ml-3" style={{ animationDelay: '0.5s' }}>
        🍃
      </span>
      <span className="animate-hoja text-xl -mb-1 ml-4" style={{ animationDelay: '1s' }}>
        🌿
      </span>
      <span className="animate-hoja text-lg -mb-1 -ml-2" style={{ animationDelay: '1.5s' }}>
        🍃
      </span>

      {/* Torre */}
      <div className="relative w-3.5 rounded-full bg-white/25 overflow-hidden" style={{ height: '70%' }}>
        <div className="absolute bottom-0 left-0 w-full bg-white/70 animate-tallo rounded-full" />
      </div>

      {/* Base / maceta */}
      <span className="text-2xl -mt-1 animate-balancear">🪴</span>
    </div>
  )
}
