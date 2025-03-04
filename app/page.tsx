import { JapaneseConverter } from "@/components/japanese-converter";

export default function Home() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <main className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Japanese Writing System Converter
        </h1>
        <JapaneseConverter />
      </main>
    </div>
  );
}
