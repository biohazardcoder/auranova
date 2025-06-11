import { useUser, } from "@clerk/clerk-react"
import { ModeToggle } from "../mode-toggle"
import Loader from "../ui/loader"
import { Button } from "../ui/button"
import { Link } from "react-router-dom"
import { Menu } from "./menu"

export const Navbar = () => {

    const { isLoaded, isSignedIn } = useUser()

    return (
        <div className="w-full h-[10vh] bg-secondary flex items-center justify-between px-4 font-semibold">
            <Link to={"/"}>
                <h1>AURA NOVA</h1>
            </Link>
            <div className="flex items-center gap-2">
                <ModeToggle />
                {!isLoaded && <Loader />}
                {isLoaded && !isSignedIn && (
                    <div className="flex items-center gap-2">
                        <Link to={"/sign-in"}>
                            <Button variant={"outline"}>Login</Button>
                        </Link>
                        <Link to={"/sign-up"}>
                            <Button>Register</Button>
                        </Link>
                    </div>
                )}
                {isLoaded && isSignedIn && (
                    <Menu />
                )}
            </div>
        </div>
    )
}
