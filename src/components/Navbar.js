import { AiOutlineMenu, AiOutlineShareAlt, AiOutlineRetweet, AiOutlineLogin } from 'react-icons/ai';
import React from "react";
import { Link, useHistory } from 'react-router-dom'
import { supabase } from '../Store'
import AnimateHeight from 'react-animate-height';

function MenuItem(props) {
    return (
        <Link {...props}
            className="px-3 py-2 flex items-center text-sm font-bold text-gray-700 dark:text-gray-50 hover:opacity-75"
        >
            {props.icon}
            <span className={props.icon ? "ml-2" : null}>{props.label}</span>
        </Link>
    )
}

export default function Navbar(props) {
    const [navbarOpen, setNavbarOpen] = React.useState(false)

    const history = useHistory()

    const Bar = () => (
        <ul className="flex flex-col lg:flex-row list-none lg:ml-auto text-left">
            <li className="nav-item self-end flex" >
                <MenuItem to="/home" label="Packages" icon={<AiOutlineShareAlt />} />
                {/* <MenuItem to="" label="Tweet" icon={<AiOutlineRetweet />} /> */}
            </li>
            {
                props.user == null ?
                    <li className="nav-item self-end">
                        <MenuItem to="/login" label="Login / Register" icon={<AiOutlineLogin />} />
                    </li>
                    :
                    <li className="nav-item self-end flex">
                        {/* <MenuItem to="/profile" label={props.user && props.user.attributes ? props.user.attributes.name : null} /> */}
                        <MenuItem to="/profile" label={props.user ? props.user.email : null} />
                        <MenuItem to="" label="Sign Out" onClick={async () => {
                            // await Auth.signOut()
                            await supabase.auth.signOut();
                            history.push('/')
                        }} icon={<AiOutlineLogin />} />
                    </li>
            }
        </ul>
    )

    return (
        <>
            <nav className={"relative flex flex-wrap items-center justify-between px-2  py-1 lg:py-3 navbar-expand-lg bg-white dark:bg-gray-700 shadow-md"}>
                <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
                    <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
                        <Link
                            className="text-gray-700 dark:text-gray-50 text-xl font-bold leading-relaxed inline-block mr-4 py-2 whitespace-no-wrap"
                            to="/"
                        >
                            Unity Amplify
                        </Link>
                        <button
                            className="text-gray-700 dark:text-gray-50 cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
                            type="button"
                            onClick={() => setNavbarOpen(!navbarOpen)}
                        >
                            <AiOutlineMenu />
                        </button>
                    </div>
                    <AnimateHeight
                        duration={300}
                        height={navbarOpen ? 'auto' : 0}
                        className="flex lg:hidden flex-grow items-center justify-end"
                        id="example-navbar-danger"
                    >
                        <Bar/>
                    </AnimateHeight>
                    <div
                        className="hidden lg:flex flex-grow items-center justify-end"
                        id="example-navbar-danger"
                    >
                        <Bar/>
                    </div>
                </div>
            </nav>
        </>
    );
}