import { useState } from 'react'
import { Mail, MapPin, Phone } from 'lucide-react'
import { Fetch } from '../../middlewares/Axios'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { ContactProps } from '../../types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Label } from '../ui/label'
import useSWR from 'swr'
import { fetcher } from '@/middlewares/Fetcher'

export const Contact = () => {
    const { mutate } = useSWR("/contact", fetcher)
    const contact: ContactProps = {
        title: "Biz haqimizda",
        description: "Aura Nova Studio",
        email: "buxorojahon@gmail.com",
        location: "Oʻzbekiston, Toshkent",
        phone: "+998 336116383",
    }

    const [name, setName] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [message, setMessage] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isError, setIsError] = useState<boolean>(false)
    const [isSuccess, setIsSuccess] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>("")
    const [successMessage, setSuccessMessage] = useState<string>("")

    const handleSubmit = async () => {
        if (!name || !email || !message) {
            setIsError(true)
            setIsSuccess(false)
            setSuccessMessage("")
            setErrorMessage("Iltimos, barcha maydonlarni to‘ldiring.")
            return
        }
        if (!email.includes("@")) {
            setIsError(true)
            setIsSuccess(false)
            setSuccessMessage("")
            setErrorMessage("Iltimos, to‘g‘ri email kiriting.")
            return
        }
        if (message.length < 10) {
            setIsError(true)
            setIsSuccess(false)
            setSuccessMessage("")
            setErrorMessage("Xabar kamida 10 ta belgidan iborat bo‘lishi kerak.")
            return
        }
        if (!message.match(/^[a-zA-Z0-9\s.,!?]+$/)) {
            setIsError(true)
            setIsSuccess(false)
            setSuccessMessage("")
            setErrorMessage("Xabar faqat matn, raqam va tinish belgilaridan iborat bo‘lishi kerak.")
            return
        }
        if (!name.match(/^[a-zA-Z0-9\s.,!?]+$/)) {
            setIsError(true)
            setIsSuccess(false)
            setSuccessMessage("")
            setErrorMessage("Ism faqat matn, raqam va tinish belgilaridan iborat bo‘lishi kerak.")
            return
        }

        try {
            setIsLoading(true)
            await Fetch.post("/contact", {
                name,
                email,
                message
            })
            setIsSuccess(true)
            setIsError(false)
            setName("")
            setEmail("")
            setMessage("")
            setErrorMessage("")
            setSuccessMessage("Xabaringiz muvaffaqiyatli yuborildi!")
            await mutate()
        } catch (error) {
            const err = error as Error
            setIsError(true)
            console.log(err.message)
            setErrorMessage(err.message || "Xatolik yuz berdi. Iltimos, qayta urinib ko‘ring.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className='grid grid-cols-1 lg:grid-cols-2 w-full p-4 gap-4' id='contact'>
            <Card className='bg-secondary border-t-8 border-primary'>
                <div className='flex flex-col justify-between h-full'>
                    <div className='space-y-2'>
                        <CardHeader>
                            <CardTitle className='text-2xl font-semibold'>{contact.title}</CardTitle>
                            <CardDescription className='text-sm font-semibold'>{contact.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className='space-y-2'>
                                {
                                    contact.email && <li className='flex items-center gap-1'>
                                        <Mail /> {contact.email}
                                    </li>
                                }
                                {
                                    contact.phone && <li className='flex items-center gap-1'>
                                        <Phone /> {contact.phone}
                                    </li>
                                }
                                {
                                    contact.location && <li className='flex items-center gap-1'>
                                        <MapPin /> {contact.location}
                                    </li>
                                }
                            </ul>
                        </CardContent>
                    </div>
                </div>
            </Card>
            <Card className='bg-secondary border-t-8 border-primary'>
                <CardHeader>
                    <CardTitle className='text-2xl font-semibold'>
                        Biz bilan bog‘laning
                    </CardTitle>
                    <CardDescription className='text-sm text-muted-foreground'>
                        Savolingiz bormi? Quyidagi forma orqali murojaat qiling.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Label className='text-sm font-semibold'>Ismingiz</Label>
                    <Input onChange={(e: any) => setName(e.target.value)} value={name} placeholder='Ismingizni kiriting...' type="text" className='w-full bg-sidebar dark:bg-secondary-foreground text-sidebar-foreground dark:text-sidebar p-1 rounded-md' />

                    <Label className='text-sm font-semibold mt-2'>Email manzilingiz</Label>
                    <Input onChange={(e: any) => setEmail(e.target.value)} value={email} placeholder='misol@gmail.com' type="email" className='w-full bg-sidebar dark:bg-secondary-foreground text-sidebar-foreground dark:text-sidebar p-1 rounded-md' />

                    <Label className='text-sm font-semibold mt-2'>Xabaringiz</Label>
                    <Textarea onChange={(e: any) => setMessage(e.target.value)} value={message} placeholder="Xabaringizni shu yerga yozing..." className='w-full bg-sidebar dark:bg-secondary-foreground text-sidebar-foreground dark:text-sidebar p-1 rounded-md' rows={5} />
                </CardContent>
                <CardFooter className='flex flex-col items-center'>
                    {
                        isError && <p className='text-sm text-red-500'>{errorMessage}</p>
                    }
                    {
                        isSuccess && <p className='text-sm text-green-500'>{successMessage}</p>
                    }
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className='bg-sidebar-primary dark:bg-sidebar w-full cursor-pointer text-white p-2 rounded-md mt-2'>
                        {isLoading ? "Yuborilmoqda..." : "Yuborish"}
                    </button>
                </CardFooter>
            </Card>
        </div>
    )
}
