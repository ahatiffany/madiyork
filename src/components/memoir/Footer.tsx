export const Footer = () => {
  return (
    <footer className="relative border-t border-border/50 px-6 md:px-14 py-12 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-xs tracking-[0.4em] uppercase text-mist/60">
          Madi York · Ari Winters: The Blue Hole
        </p>
        <p className="text-xs tracking-[0.3em] uppercase text-mist/40">
          © {new Date().getFullYear()} · All rights reserved
        </p>
      </div>
    </footer>
  );
};
