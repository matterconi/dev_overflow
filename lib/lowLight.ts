import { common, createLowlight } from 'lowlight';
import js from 'highlight.js/lib/languages/javascript';
import css from 'highlight.js/lib/languages/css';

// Create the lowlight instance
const lowlight = createLowlight(common);

// Register the languages
lowlight.register('javascript', js);
lowlight.register('css', css);

export default lowlight;
