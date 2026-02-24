import Head from 'next/head';

export default function Success() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center px-6">
      <Head>
        <title>Success! - The FastStart Blueprint</title>
      </Head>

      <div className="max-w-2xl bg-white rounded-2xl shadow-2xl p-12 text-center">
        <div className="text-6xl mb-6">✅</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to The FastStart Blueprint!
        </h1>
        <p className="text-xl text-gray-700 mb-8">
          Check your email for instant access to the guide.
        </p>
        <p className="text-lg text-gray-600">
          You'll receive a download link within the next 5 minutes.
        </p>
        <a 
          href="/"
          className="inline-block mt-8 bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}
