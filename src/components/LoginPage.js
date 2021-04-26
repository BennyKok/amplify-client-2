import {
    BrowserRouter as Router,
    useHistory,
} from "react-router-dom";
import React, { useRef } from "react";
import { supabase } from '../Store'
import { handleError } from '../Utils'

export default function LoginPage() {
    let history = useHistory()
    const emailInput = useRef();
    const passwordInput = useRef();
    return (
        <div className="container mx-auto px-4 mt-10 max-w-2xl">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
                <div className="mb-4">
                    <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input ref={emailInput} className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker" id="email" type="text" placeholder="Email" />
                </div>
                <div className="mb-6">
                    <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input ref={passwordInput} className="shadow appearance-none border border-red rounded w-full py-2 px-3 text-grey-darker mb-3" id="password" type="password" placeholder="******************" />
                    {/* <p className="text-red text-xs italic">Please choose a password.</p> */}
                </div>
                <div className="flex items-center justify-end">
                    <button className="bg-gray-700 hover:bg-blue-dark text-white font-bold py-2 px-4 rounded mr-4" type="button" onClick={async () => {
                        const { user, session, error } = await supabase.auth.signIn({
                            email: emailInput.current.value,
                            password: passwordInput.current.value,
                        })

                        handleError(error)
                        if (!error) history.push("/")
                    }}>
                        Sign In
                    </button>
                    <button className="bg-gray-700 hover:bg-blue-dark text-white font-bold py-2 px-4 rounded" type="button" onClick={async () => {
                        const { user, session, error } = await supabase.auth.signUp({
                            email: emailInput.current.value,
                            password: passwordInput.current.value,
                        })

                        handleError(error)
                        if (!error) history.push("/")
                    }}>
                        Register
                    </button>
                    {/* <a className="inline-block align-baseline font-bold text-sm text-blue hover:text-blue-darker" href="#">
                        Forgot Password?
                </a> */}
                </div>
            </div>
        </div>
    )
}