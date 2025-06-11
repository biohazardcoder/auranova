import { Navbar } from "@/components/mods/navbar"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export const Error = () => {
    return (
        <div>
            <Navbar />
            <div className="w-full h-[90vh] flex flex-col gap-2 items-center justify-center text-3xl">
                Saxifa topilmadi!
                <Link to={"/"}>
                    <Button>
                        Ortga qaytish
                    </Button>
                </Link>
            </div>
        </div>
    )
}
