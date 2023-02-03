import TurndownService from 'Turndown';
import {MarkupPaste} from "../module";

const turndown = new TurndownService({
    hr: "---",
    emDelimiter: "*",
    bulletListMarker: "-",
});
turndown.addRule("notionStyles", {
    filter: "span",
    replacement: function(content, node, options) {
        if (!content.trim()) return '';
        if ((node as HTMLElement).style.fontStyle === "italic")
            content = options.emDelimiter + content + options.emDelimiter;
        if ((node as HTMLElement).style.fontWeight >= "600")
            content = options.strongDelimiter + content + options.strongDelimiter;
        if ((node as HTMLElement).style.textDecoration === "line-through")
            content = "~" + content + "~";
        return content;
    }
})

const endSpaceRe = new RegExp('\u00a0', 'g')

// Or maybe listen for it on body and be able to paste markdown everywhere... except DFCE markdown is only for chat
Hooks.on("renderChatLog", (_app: Application, html: JQuery, _options: never) => {
    const chatMessageEl = html.find("#chat-message")[0] as HTMLTextAreaElement;
    chatMessageEl.addEventListener("paste", (e) => {
        const clipboardData = e.clipboardData.getData("text/html");
        if (!clipboardData) return;
        try {
            const result = turndown.turndown(clipboardData.replace(/\n/g, '\u00a0'));
            e.preventDefault();
            const text = chatMessageEl.value;
            chatMessageEl.value = text.slice(0, chatMessageEl.selectionStart) +
                result.replace(endSpaceRe, '\n').trim() +
                text.slice(chatMessageEl.selectionEnd);
            MarkupPaste.log("Successfully parsed clipboard data", result, clipboardData)
        } catch (err) { // turndown throws TypeError if input isn't string
            MarkupPaste.log("Error parsing clipboard data", err);
            return;
        }
    });
});