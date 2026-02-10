export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-[var(--accent-green)] to-[var(--accent-yellow)] bg-clip-text text-transparent">
          Emotion Analysis
        </h1>
        <p className="text-xl text-[var(--text-secondary)] mb-8">
          AI-powered emotional intelligence for your mental well-being
        </p>
        <div className="flex gap-4 justify-center">
          <button className="btn-primary">
            Get Started
          </button>
          <button className="btn-secondary">
            Learn More
          </button>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <div className="text-4xl mb-4">🧠</div>
            <h3 className="font-semibold mb-2">AI Analysis</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              8-emotion classification using advanced NLP
            </p>
          </div>

          <div className="card">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="font-semibold mb-2">Visual Insights</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Interactive charts and emotion wheels
            </p>
          </div>

          <div className="card">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="font-semibold mb-2">Secure & Private</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              AES-256 encryption for your data
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

