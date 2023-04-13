/* ******************************************************************************
 * index.ts                                                                     *
 * *************************************************************************/ /**
 *
 * @fileoverview Main entry point of this Mattermost Plugin client side (webapp)
 *
 * Created on       April 13, 2023
 * @author          Jane Developer
 *
 * @copyright (c) 2023-present Riff Analytics,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import {Store, Action} from 'redux';

import {GlobalState} from 'mattermost-redux/types/store';

import {manifest} from '@/manifest';

import type {PluginRegistry} from '@/types/mattermost-webapp';

class Plugin {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    public async initialize(registry: PluginRegistry, store: Store<GlobalState, Action<Record<string, unknown>>>) {
        // @see https://developers.mattermost.com/extend/plugins/webapp/reference/
    }
}

declare global {
    interface Window {
        registerPlugin(pluginId: string, plugin: Plugin): void
    }
}

window.registerPlugin(manifest.id, new Plugin());

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export default Plugin;
export {
    Plugin,
};
