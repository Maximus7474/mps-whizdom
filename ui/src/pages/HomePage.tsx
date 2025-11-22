import { IPageProps } from "@/types";

import './HomePage.css';

const HomePage = ({ device }: IPageProps) => {
    return <div className="homepage">
        <div className="home-header">
            <h1 className={device}>Welcome to</h1>
            <img src='./TextBanner.png' className={`text-banner ${device}`} />
        </div>
    </div>
}

export default HomePage;
