export default function NavBar() {
    return (
        <nav className="fixed left-0 top-0 h-20 w-full flex px-20 items-center justify-between text-white">
            <a href="/" className="text-3xl font-semibold">
            🤓 IP-Tracker
            </a>
            <a href="https://github.com/jonas-is-coding/ip-tracker" className="text-xl hover:underline">
                Github Project
            </a>
        </nav>
    )
}