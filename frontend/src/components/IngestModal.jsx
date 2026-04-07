import { motion } from "framer-motion";
import { Loader2, Github, CheckCircle2 } from "lucide-react";

const IngestModal = ({ isOpen, step }) => {
  if (!isOpen) return null;

  const steps = {
    cloning: { icon: <Github className="animate-pulse text-zinc-400" />, text: "Cloning Repository..." },
    embedding: { icon: <Loader2 className="animate-spin text-green-500" />, text: "Generating Vector Embeddings..." },
    success: { icon: <CheckCircle2 className="text-green-500" />, text: "Codebase Indexed Successfully!" }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-[#1E1E1E] border border-white/10 p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl"
      >
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-zinc-800/50 rounded-2xl border border-white/5">
            {steps[step].icon}
          </div>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{steps[step].text}</h3>
        <p className="text-zinc-500 text-sm">
          {step === 'embedding' ? "RepoMind is reading every line of code to build your AI's brain." : "Please wait while we sync the repository data."}
        </p>

        {/* 🚀 Faux Progress Bar */}
        <div className="mt-8 w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: "0%" }}
            animate={{ width: step === 'success' ? "100%" : "70%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="h-full bg-green-500 shadow-[0_0_10px_#4ADE80]"
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default IngestModal;