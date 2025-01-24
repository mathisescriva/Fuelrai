interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen w-screen bg-gray-100">
      {/* Header */}
      <header className="w-full bg-white shadow">
        <div className="w-full px-8 py-4">
          <h1 className="text-3xl font-bold text-gray-900">Finance Document Analysis</h1>
        </div>
      </header>

      <main className="w-full p-8">
        {children}
      </main>
    </div>
  );
};
