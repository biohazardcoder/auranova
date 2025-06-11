import { ThemeProvider } from "@/components/theme-provider"
import { Route, Routes } from "react-router-dom"
import { Home } from "./pages/home"
import { SignIn, SignUp, useUser } from "@clerk/clerk-react";
import { Navbar } from "./components/mods/navbar";
import Loader from "./components/ui/loader";
import { Anime } from "./pages/anime";
import { Error } from "./pages/error";
import { AnimeDetail } from "./pages/anime-detail";
import { Toaster } from "sonner";
import { DramaDetail } from "./pages/drama-detail";
import { Drama } from "./pages/drama";
import { MovieDetail } from "./pages/movie-detail";
import { Movie } from "./pages/movie";
import { Profile } from "./pages/profile";
import Footer from "./components/mods/footer";

const App = () => {
  const { isLoaded } = useUser();

  return (
    <ThemeProvider defaultTheme="dark" storageKey="aura-nova-theme">
      <Toaster position="top-center" theme="system" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in/*" element={
          isLoaded ?
            <div>
              <Navbar />
              <section className="h-[90vh] flex items-center justify-center">
                <SignIn routing="path" path="/sign-in" />
              </section>
            </div> : <div>
              <Navbar />
              <section className="h-[90vh] flex items-center justify-center">
                <Loader />
              </section>
            </div>
        } />
        <Route path="/sign-up/*" element={
          isLoaded ?
            <div>
              <Navbar />
              <section className="min-h-screen flex items-center justify-center">
                <SignUp routing="path" path="/sign-up" />
              </section>
            </div> : <div>
              <Navbar />
              <section className="h-[90vh] flex items-center justify-center">
                <Loader />
              </section>
            </div>
        } />
        <Route path="/anime" element={<Anime />} />
        <Route path="/anime/:id" element={<AnimeDetail />} />
        <Route path="/drama" element={<Drama />} />
        <Route path="/drama/:id" element={<DramaDetail />} />
        <Route path="/movie" element={<Movie />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Error />} />
      </Routes>
      <Footer />
    </ThemeProvider>
  )
}

export default App