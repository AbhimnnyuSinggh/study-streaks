export default function AuthErrorPage() {
    return (
        <div className="flex flex-col min-h-[50vh] items-center justify-center p-4">
            <h1 className="text-3xl font-bold text-red-600 mb-4">Authentication Error</h1>
            <p className="text-gray-600 max-w-md text-center">
                There was a problem signing you in with your chosen provider. This usually happens if the link expired or if your Google account rejected the request.
            </p>
            <a href="/login" className="mt-8 bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-emerald-600">
                Try Again
            </a>
        </div>
    );
}
