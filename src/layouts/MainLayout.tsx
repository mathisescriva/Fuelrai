interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen w-screen bg-gray-100">
      {/* Header */}
      <header className="w-full bg-white shadow">
        <div className="w-full px-8 py-4">
          <img src="/images/logo.png" alt="Elixir Logo" className="h-8 w-auto" />
        </div>
      </header>

      <main className="w-full p-8">
        {children}
      </main>
    </div>
  );
};
