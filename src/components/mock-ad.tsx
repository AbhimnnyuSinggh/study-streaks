export default function MockAd({ className = '' }: { className?: string }) {
    return (
        <div className={`w-full bg-gray-100 border border-gray-200 border-dashed rounded-lg flex flex-col items-center justify-center p-4 text-gray-400 my-8 ${className}`}>
            <span className="text-xs uppercase tracking-widest font-bold mb-1">Advertisement</span>
            <div className="w-full h-full min-h-[90px] bg-white rounded border border-gray-200 flex items-center justify-center text-sm font-medium">
                Google AdSense Placeholder (Responsive)
            </div>
        </div>
    );
}
