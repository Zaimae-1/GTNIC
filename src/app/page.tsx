export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-6 px-6 py-16">
      <span className="w-fit rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-800">
        Fondasi proyek
      </span>
      <h1 className="text-5xl font-bold tracking-tight text-green-950 sm:text-6xl">
        DapurCerdas
      </h1>
      <p className="max-w-xl text-lg leading-relaxed text-slate-700">
        Smart POS untuk membantu usaha kuliner mencatat penjualan dan memahami pemakaian bahan.
        Aplikasi sedang disiapkan.
      </p>
    </main>
  );
}
