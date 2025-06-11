import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Separator } from "../ui/separator"
import { SignOutButton, useUser } from "@clerk/clerk-react"
import { Link } from "react-router-dom"
import { Button } from "../ui/button"
import { Clapperboard, Drama, FileText, Heart, Home, LogOut, TvMinimalPlay, User } from "lucide-react"

export const Menu = () => {
  const { user } = useUser()

  return (
    <Popover>
      <PopoverTrigger>
        <Avatar>
          <AvatarImage src={user?.imageUrl} alt="User Avatar" />
          <AvatarFallback>{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent >
        <div>
          <div className="flex flex-col">
            <h1 className="font-semibold">{user?.firstName} {user?.lastName}</h1>
            <p className="text-sm text-muted-foreground">{user?.emailAddresses[0]?.emailAddress}</p>
          </div>
        </div>
        <Separator className="my-2" />
        <div className="space-y-1">
          <Link to={"/"}>
            <Button variant="ghost" className="w-full block">
              <div className="flex items-center gap-2">
                <Home />
                Bosh sahifa
              </div>
            </Button>
          </Link>
          <Link to={"/profile"}>
            <Button variant="ghost" className="w-full block">
              <div className="flex items-center gap-2">
                <User />
                Profil
              </div>
            </Button>
          </Link>
          <Link to={"/wishlist"}>
            <Button variant="ghost" className="w-full block">
              <div className="flex items-center gap-2">
                <Heart />
                Istaklar ro`yxati
              </div>
            </Button>
          </Link>
          <Separator />
          <Link to={"/movie"}>
            <Button variant="ghost" className="w-full block">
              <div className="flex items-center gap-2">
                <Clapperboard />
                Filmlar
              </div>
            </Button>
          </Link>
          <Link to={"/anime"}>
            <Button variant="ghost" className="w-full block">
              <div className="flex items-center gap-2">
                <TvMinimalPlay />
                Animelar
              </div>
            </Button>
          </Link>
          <Link to={"/drama"}>
            <Button variant="ghost" className="w-full block">
              <div className="flex items-center gap-2">
                <Drama />
                Dramalar
              </div>
            </Button>
          </Link>
          <Separator className="my-2" />
          <Link to={"/about"}>
            <Button variant="ghost" className="w-full block">
              <div className="flex items-center gap-2">
                <FileText />
                Biz haqimizda
              </div>
            </Button>
          </Link>
          <Separator className="my-2" />
          <SignOutButton>
            <Button variant="ghost" className="w-full block">
              <div className="flex items-center gap-2">
                <LogOut />
                Chiqish
              </div>
            </Button>
          </SignOutButton>
        </div>
      </PopoverContent>
    </Popover>
  )
}
