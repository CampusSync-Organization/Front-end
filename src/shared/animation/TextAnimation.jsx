import { motion, AnimatePresence } from "framer-motion";
export function HeaderTextAnimation({ text }) {

    return (
        <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-primary mb-2 tracking-tight"
        >
            {text}
        </motion.h1>);
}

export function SubtitleTextAnimation({ text }) {


    return (
        <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-muted-foreground max-w-2xl text-base leading-relaxed"
        >
            {text}
        </motion.p>
    );
}
