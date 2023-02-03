// Do not remove this import. If you do Vite will think your styles are dead
// code and not include them in the build output.
import {ModuleData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/packages.mjs";

import { moduleId } from "./constants";
import "./apps/chat-paste";
import "../styles/style.scss";

declare global {
    interface LenientGlobalVariableTypes {
        game: never;
    }
}

export class MarkupPaste {
    static ID = moduleId;
    static module: Game.ModuleData<ModuleData>;

    static log(force: boolean | any, ...args: any) {
        // @ts-ignore
        const shouldLog = force == true || game.modules.get('_dev-mode')?.api?.getPackageDebugValue(this.ID);
        if (shouldLog)
            console.log(this.ID, '|', force,  ...args);
    }
}

Hooks.once('devModeReady', ({ registerPackageDebugFlag }: any) => {
    registerPackageDebugFlag(MarkupPaste.ID);
});

Hooks.once("init", () => {
    MarkupPaste.module = (game as Game).modules.get(moduleId);
    // @ts-ignore
    MarkupPaste.module.api = {
        MarkupPaste,
    }
    console.log(`Initializing ${moduleId}`);
});
