export default function NavBar() {
    return (
        <nav className="fixed top-0 left-0 h-20 w-full flex lg:px-20 items-center justify-between text-white md:px-10 sm:px-5 bg-black">
            <a href="/" className="text-3xl font-semibold">
            🤓 IP-Tracker
            </a>
            <a href="https://github.com/jonas-is-coding/ip-tracker" className="text-xl hover:underline">
                Github Project
            </a>
        </nav>
    )
}