import { motion } from "framer-motion";
import { CreateAnnouncementWidget, QuickAccessWidget, WhoToFollowWidget } from "../../announcement/components/AnnouncementWidgets";

export default function Sidebar() {
    const containerVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.5,
                when: "beforeChildren", // Animate container first
                staggerChildren: 0.15,  // Then stagger children by 0.15s
            }
        }
    };

    return (
        <motion.aside variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6">
            <CreateAnnouncementWidget></CreateAnnouncementWidget>
            <QuickAccessWidget></QuickAccessWidget>
            <WhoToFollowWidget></WhoToFollowWidget>

        </motion.aside>
    );
}
