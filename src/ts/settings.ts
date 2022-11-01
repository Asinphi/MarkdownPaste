import { moduleId } from "./constants";
import {ConfirmChatSend} from "./module";

export const registerSettings = () => {
    for (const messageType in CONST.CHAT_MESSAGE_TYPES) {
        game.settings.register(moduleId, `confirm-${messageType}`, {
            name: game.i18n.localize(`confirm-chat-send.settings.confirm.${messageType.toLowerCase()}.name`),
            hint: game.i18n.localize(`confirm-chat-send.settings.confirm.${messageType.toLowerCase()}.hint`),
            scope: "client",
            config: true,
            type: Boolean,
            default: false,
            onChange: (value: boolean) => {
                // @ts-ignore
                ConfirmChatSend.messageTypesToConfirm[CONST.CHAT_MESSAGE_TYPES[messageType]] = value;
            }
        });
    }
}

export const loadSettings = () => {
    for (const messageType in CONST.CHAT_MESSAGE_TYPES) {
        // @ts-ignore
        ConfirmChatSend.messageTypesToConfirm[CONST.CHAT_MESSAGE_TYPES[messageType]] = game.settings.get(moduleId, `confirm-${messageType}`);
    }
}