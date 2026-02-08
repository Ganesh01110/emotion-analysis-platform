export default function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center w-full h-full min-h-[200px]">
            <div className="relative w-12 h-12">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-[var(--bg-secondary)] rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-[var(--accent-green)] rounded-full animate-spin border-t-transparent"></div>
            </div>
        </div>
    );
}
