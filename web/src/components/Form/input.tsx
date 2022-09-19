import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {

}

const Input: React.FC<InputProps> = (props) => {
    return (
        <input
            {...props}
            className='bg-zinc-900 py-3 px-4 rounded text-sm placeholder:text-zinc-500'
        />
    )
}

export default Input;