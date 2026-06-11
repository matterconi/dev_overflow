import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import { common, createLowlight } from "lowlight";

// Create the lowlight instance
const lowlight = createLowlight(common);

// Register the languages
lowlight.register("javascript", js);
lowlight.register("css", css);

export default lowlight;
