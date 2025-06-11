import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import { useDispatch, useSelector } from "react-redux";
import { setError, setPending, setUser } from "./toolkit/UserSlicer";
import { useEffect, useMemo } from "react";
import Loading from "./pages/Loading";
import Login from "./pages/Login";
import Error from "./pages/Error";
import { RootState } from "./store/RootStore";
import { Fetch } from "./middlewares/Fetch";
import Admins from "./pages/Admins";
import Contacts from "./pages/Contacts";
import Animes from "./pages/Animes";
import { AnimeDetail } from "./pages/AnimeDetail";
import Dramas from "./pages/Dramas";
import { DramaDetail } from "./pages/DramaDetail";
import Carousels from "./pages/Carousels";
import Movies from "./pages/Movies";
import { MovieDetail } from "./pages/MovieDetail";

function App() {
  const { isPending, isAuth } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    async function getMyData() {
      try {
        dispatch(setPending());
        const response = await Fetch.get("admin/me");
        if (response.data) {
          dispatch(setUser(response.data));
        } else {
          dispatch(setError("No user data available"));
        }
      } catch (error) {
        const err = error as Error;
        dispatch(setError(err.message || "Unknown error"));
        console.error(error);
      }
    }
    getMyData();
  }, [dispatch]);

  const router = useMemo(() => {
    if (isPending) {
      return createBrowserRouter([
        {
          path: "/",
          element: <Loading />,
        },
      ]);
    }
    if (isAuth) {
      return createBrowserRouter([
        {
          path: "/",
          element: <RootLayout />,
          children: [
            {
              path: "/",
              element: <Carousels />,
              index: true,
            },
            {
              path: "/admins",
              element: <Admins />,
            },
            {
              path: "/anime",
              element: <Animes />,
            },
            {
              path: "/anime/:id",
              element: <AnimeDetail />,
            },
            {
              path: "/movie",
              element: <Movies />,
            },
            {
              path: "/movie/:id",
              element: <MovieDetail />,
            },
            {
              path: "/drama",
              element: <Dramas />,
            },
            {
              path: "/drama/:id",
              element: <DramaDetail />,
            },
            {
              path: "/contacts",
              element: <Contacts />
            },
            {
              path: "*",
              element: <Error />,
            },
          ],
        },
      ]);
    } else {
      return createBrowserRouter([
        {
          path: "/",
          element: <Login />,
        },
        {
          path: "*",
          element: <Error />,
        },
      ]);
    }
  }, [isAuth, isPending]);

  return <RouterProvider router={router} />;
}

export default App;
