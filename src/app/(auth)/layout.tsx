export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-base-100 px-4">
      <div className="w-full max-w-md">
        {/* Logo Placeholder */}
        <div className="mb-8 flex justify-center">
          <h1 className="text-4xl font-bold text-primary">VCT Logo</h1>
        </div>

        {/* The content from login, register, etc., will be rendered here */}
        {children}
      </div>
    </div>
  );
}