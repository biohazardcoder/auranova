import Loader from "@/components/ui/loader"
import { fetcher } from "@/middlewares/Fetcher"
import { ContactTypes } from "@/types/RootTypes"
import useSWR from "swr"

const Contacts = () => {
  const { data: contacts, isLoading, error } = useSWR("/contact", fetcher)

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-lg font-medium text-red-600">{error}</p>
      </div>
    );
  }
  return (
    <div className="p-4 h-screen overflow-y-auto">
      <div className="flex justify-between items-center mb-4 gap-3 flex-wrap">
        <h1 className="text-2xl font-bold">Contacts</h1>
      </div>

      {contacts?.length <= 0 ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-lg font-medium text-sky-400">
            Нет ни одного админа
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {contacts?.map(({ message, _id, email, name, createdAt, }: ContactTypes) => (
            <div key={_id} className="bg-[#202020] text-white rounded-lg p-4 flex flex-col gap-3 relative">
              <h1 className="text-2xl font-bold">{name}</h1>
              <p className="text-gray-500">{email}</p>
              <p className="text-gray-500">{message}</p>
              <p className="text-gray-500">{createdAt.slice(0, 10)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Contacts