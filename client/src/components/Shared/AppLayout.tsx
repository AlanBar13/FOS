import {ReactNode} from 'react'
import AppBarComponent from "./AppBarComponent";

interface AppLayoutProps {
    companyName: string
    hideCart?: boolean
    children: ReactNode
}

export default function AppLayout({ companyName, hideCart, children }: AppLayoutProps){
    return (
        <>
            <AppBarComponent companyName={companyName} hideCart={hideCart} />
            {children}
        </>
    )
}