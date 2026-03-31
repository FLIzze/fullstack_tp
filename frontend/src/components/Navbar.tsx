type Props = {
  count: number;
};

export default function Navbar({ count }: Props) {
  return (
    <header className="sticky top-0 z-20 border-b border-base-300/70 bg-base-100/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4 py-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary/15 ring-1 ring-primary/20 grid place-items-center">
              <span className="text-primary font-black">U</span>
            </div>
            <div className="min-w-0">
              <div className="text-base md:text-lg font-bold leading-tight truncate">Gestion des utilisateurs</div>
              <div className="text-xs opacity-70 truncate">TP Frontend · React + API REST</div>
            </div>
          </div>
        </div>

        <div className="flex-none">
          <div className="badge badge-neutral badge-lg">{count} utilisateurs</div>
        </div>
      </div>
    </header>
  );
}

