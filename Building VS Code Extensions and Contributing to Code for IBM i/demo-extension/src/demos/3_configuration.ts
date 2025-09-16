import { ConfigurationTarget, workspace } from 'vscode';

export enum Section {
    clearOutputChannelOnChange = 'clearOutputChannelOnChange'
}

export namespace DemoConfiguration {
    export const group: string = 'demo-extension';

    export function get<T>(section: Section): T | undefined {
        return workspace.getConfiguration(DemoConfiguration.group).get(section) as T;
    }

    export async function set(section: Section, value: any): Promise<void> {
        return await workspace.getConfiguration(DemoConfiguration.group).update(section, value, ConfigurationTarget.Global);
    }
}