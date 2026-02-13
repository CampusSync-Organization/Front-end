import { HeaderTextAnimation, SubtitleTextAnimation } from "../../../shared/animation/TextAnimation";
import { MOCK_USER } from "../../profile/api/mockData";

export default function WelcomeHeader() {
    const name = MOCK_USER?.firstName ?? "there";

    return (
        <div className="py-8 md:py-12">
            <HeaderTextAnimation text={`Welcome back ${name}!`}></HeaderTextAnimation>
            <SubtitleTextAnimation text={"Here's what's happening around campus today."}></SubtitleTextAnimation>
        </div >
    );
}
