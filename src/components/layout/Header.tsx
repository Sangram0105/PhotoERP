const Header = () => {
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <h2 className="text-2xl font-semibold">
        Photo Studio
      </h2>

      <span className="text-sm text-slate-500">
        {today}
      </span>
    </header>
  );
};

export default Header;