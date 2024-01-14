import {ReactNode} from 'react'
import AppBarComponent from "./AppBarComponent";

interface AppLayoutProps {
    companyName: string
    hideCart?: boolean
    children: ReactNode
    toggleCart?: () => void
}

export default function AppLayout({ companyName, hideCart, children, toggleCart }: AppLayoutProps){
    return (
        <>
            <AppBarComponent companyName={companyName} hideCart={hideCart} toggleCart={toggleCart} />
            {children}
        </>
    )
}