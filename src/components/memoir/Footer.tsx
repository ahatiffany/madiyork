export const Footer = () => {
  return (
    <footer className="relative border-t border-border/50 px-6 md:px-14 py-12 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 text-center">
        <p className="text-[10px] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase text-mist/60">
          Madi York · ARI WYNTER: THE BLUE HOLE
        </p>
        <p className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-mist/40">
          © {new Date().getFullYear()} · All rights reserved
        </p>
      </div>
    </footer>
  );
};
