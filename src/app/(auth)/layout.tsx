import Image from "next/image";

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
          {process.env.CLUB_LOGO_URL ? (
            <Image
              src={process.env.CLUB_LOGO_URL}
              alt="Club Logo"
              width={150}
              height={150}
              className="h-auto w-auto object-contain"
              priority
            />
          ) : process.env.APP_NAME ? (
            <h1 className="text-4xl font-bold text-primary">{process.env.APP_NAME}</h1>
          ) : (
            <h1 className="text-4xl font-bold text-primary">Add your Name or Logo in .env file</h1>
          )}
        </div>

        {children}
      </div>
    </div>
  );
}