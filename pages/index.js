import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
      <h1 className="text-5xl font-bold">Ludo Game</h1>
      <Link href="/lobby" className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">
        Start Ludo Game
      </Link>
    </div>
  );
}
