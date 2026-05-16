import { Navbar } from "@/components/ui/navbar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userName={session.name} />
      <main className="flex-1 p-4 md:p-8 bg-slate-50/50">
        <div className="container max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
