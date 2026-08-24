import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
}

function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Brand section */}
        <div className="hidden bg-blue-600 p-12 lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sm font-bold text-blue-600">
                E
              </div>

              <span className="text-xl font-bold text-white">EchoLife</span>
            </div>
          </div>

          <div className="max-w-lg">
            <h2 className="text-4xl font-bold leading-tight text-white">
              Preserve the moments that matter most.
            </h2>

            <p className="mt-5 text-base leading-7 text-blue-100">
              A private digital space for your family's memories, stories and
              connections.
            </p>
          </div>

          <p className="text-sm text-blue-200">© 2026 EchoLife</p>
        </div>

        {/* Form section */}
        <div className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
                  E
                </div>

                <span className="text-xl font-bold text-slate-900">
                  EchoLife
                </span>
              </div>
            </div>

            <div className="mb-8">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                {title}
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {description}
              </p>
            </div>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
