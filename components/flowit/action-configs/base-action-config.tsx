export default function BaseActionConfig({children, show}: {children: React.ReactNode, show: boolean}) {
    return (
        <div className={`${!show?'hidden':''} overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full`}>
            <div className="relative p-4 w-full max-w-2xl h-full md:h-auto">
                {children}
            </div>
        </div>
    );
}