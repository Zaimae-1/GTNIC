import { ButtonLink, Notice, PageTitle } from "@/components/ui";
export default function Page() {
  return (
    <div className="container inner-page auth-page">
      <PageTitle
        label="AKSES STAF"
        title="Panel pengelolaan restoran."
        description="Area simulasi untuk mencoba alur pesanan dan reservasi."
      />
      <Notice>
        Autentikasi staf belum diterapkan. Panel berikut hanya demonstrasi data
        lokal, bukan akses ke data restoran nyata.
      </Notice>
      <ButtonLink href="/admin">Buka panel simulasi</ButtonLink>
    </div>
  );
}
