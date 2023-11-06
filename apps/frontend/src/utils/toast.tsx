import { cn } from '@/utils'
import { CheckCircle2, XCircle } from 'lucide-react'
import { default as toastBase } from 'react-hot-toast'


const Notification = (
    {message, type="success"}:
        {message: string, type?: "success" | "error"}
    ) => {
    return (
        <div className='p-3 gap-3 rounded-lg w-[450px] flex bg-intg-bg-4'>
            <div className={cn(
                'pt-1',
            )}>
                {type === "success" && <CheckCircle2 fill='green' color='white' />}
                {type === "error" && <XCircle fill='red' color='white' />}
            </div>
            <div>
                <h5 className='text-xl text-white'>{type == "success" ? "Success!" : "Error!"}</h5>
                <p className='text-base text-intg-text'>{message}</p>
            </div>
        </div>
    )
}

export const toast = {
    success: (message: string) => toastBase.custom(<Notification message={message} type='success' />),
    error: (message: string) => toastBase.custom(<Notification message={message} type='error' />),
}
