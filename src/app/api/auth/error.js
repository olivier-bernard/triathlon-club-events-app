export default function AuthErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-red-600">Authentication Error</h1>
      <p className="mb-4">There was a problem logging you in. Please check your credentials or try again.</p>
      <a href="/login" className="text-blue-500 underline">Back to Login</a>
    </div>
  );
}