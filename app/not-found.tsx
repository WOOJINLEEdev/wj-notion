import Link from "next/link";

export default function NotFound() {
  return (
    <div className="absolute top-0 flex flex-col items-center justify-center w-full h-screen">
      <h2 className="text-3xl font-bold mb-4">Not Found</h2>
      <p className="text-gray-500 mb-4">
        Could not find the requested resource
      </p>
      <Link href="/" className="text-blue-500 hover:underline">
        Return Home
      </Link>
    </div>
  );
}
