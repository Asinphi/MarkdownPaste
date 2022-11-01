// Do not remove this import. If you do Vite will think your styles are dead
// code and not include them in the build output.
import {ModuleData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/packages.mjs";

import { moduleId } from "./constants";
import { registerSettings, loadSettings } from "./settings";
import "./apps/message-confirmation";
import "../styles/style.scss";

declare global {
    interface LenientGlobalVariableTypes {
        game: never;
    }
}

export class ConfirmChatSend {
    static ID = moduleId;
    static module: Game.ModuleData<ModuleData>;
    static messageTypesToConfirm = {
        [CONST.CHAT_MESSAGE_TYPES.OTHER]: false,
        [CONST.CHAT_MESSAGE_TYPES.OOC]: false,
        [CONST.CHAT_MESSAGE_TYPES.IC]: false,
        [CONST.CHAT_MESSAGE_TYPES.EMOTE]: false,
        [CONST.CHAT_MESSAGE_TYPES.WHISPER]: false,
        [CONST.CHAT_MESSAGE_TYPES.ROLL]: false,
    };

    static log(force: boolean | any, ...args: any) {
        // @ts-ignore
        const shouldLog = force == true || game.modules.get('_dev-mode')?.api?.getPackageDebugValue(this.ID);
        if (shouldLog)
            console.log(this.ID, '|', force,  ...args);
    }
}

Hooks.once('devModeReady', ({ registerPackageDebugFlag }: any) => {
    registerPackageDebugFlag(ConfirmChatSend.ID);
});

Hooks.once("init", () => {
    ConfirmChatSend.module = (game as Game).modules.get(moduleId);
    // @ts-ignore
    ConfirmChatSend.module.api = {
        ConfirmChatSend,
    }
    console.log(`Initializing ${moduleId}`);

    // Setup settings
    registerSettings();
    loadSettings();
});
