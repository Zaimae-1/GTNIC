import { EmptyState } from "@/components/ui";
export default function NotFound() {
  return (
    <div className="container section">
      <EmptyState
        title="Halaman ini belum ada di meja kami."
        description="Mari kembali untuk menemukan menu atau merencanakan kunjungan Anda."
        href="/menu"
        label="Jelajahi menu"
      />
    </div>
  );
}
