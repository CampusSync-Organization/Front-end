import { useSelector } from "react-redux";
import { HeaderTextAnimation, SubtitleTextAnimation } from "../../../shared/animation/TextAnimation";

export default function WelcomeHeader() {
    const currentUser = useSelector((state) => state.auth.user);
    const name = currentUser?.name?.split(" ")[0] ?? "there";

    return (
        <div className="py-8 md:py-12">
            <HeaderTextAnimation text={`Welcome back ${name}!`}></HeaderTextAnimation>
            <SubtitleTextAnimation text={"Here's what's happening around campus today."}></SubtitleTextAnimation>
        </div >
    );
}
