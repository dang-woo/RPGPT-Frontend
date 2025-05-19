import Navigation from "@/components/navegation";

export default function MainGroupLayout({ children }) {
  return (
    <>
      <Navigation />
      <main className="w-full h-screen pt-16 box-border overflow-y-auto overflow-x-hidden">
        {children}
      </main>
    </>
  );
} 