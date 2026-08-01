export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="flex justify-center mb-6">
          <div className="h-10 w-10 rounded-xl bg-blue-600 shadow-md flex items-center justify-center">
             <span className="text-white font-bold text-xl">E</span>
          </div>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-zinc-900 tracking-tight">
          Welcome to EduPredict
        </h2>
        <p className="mt-2 text-center text-sm text-zinc-500 max-w-md mx-auto">
          Before we generate your customized learning dashboard, we need a few details to calibrate our AI engine.
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-6 shadow sm:rounded-xl sm:px-10 border border-zinc-200">
          {children}
        </div>
      </div>
    </div>
  );
}
