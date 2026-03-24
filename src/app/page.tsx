import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center" style={{ animation: "fade-in 0.5s ease-out" }}>
        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-plug-green text-3xl font-bold text-white shadow-lg">
          P
        </div>
        <h1 className="mb-2 text-4xl font-bold tracking-tight text-plug-navy">
          Plug Trust Pass
        </h1>
        <p className="mb-8 max-w-md text-lg text-slate-500">
          Turn device certifications into shareable trust pages. Sell refurbished phones with confidence.
        </p>
        <Link
          href="/login"
          className="inline-block rounded-xl bg-plug-green px-8 py-3 text-lg font-semibold text-white shadow-md transition hover:bg-plug-green-dark"
        >
          Reseller Login
        </Link>
      </div>
    </main>
  );
}
