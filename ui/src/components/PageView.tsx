import { ReactNode } from "react"
import NavBar from "./NavBar"

interface IPageProps {
    children: ReactNode
}

const Page: React.FC<IPageProps> = ({ children }) => {
    return <main>
        {children}
        <NavBar />
    </main>
}

export default Page;
