import { ExtensionContext, window, workspace } from "vscode";
import { DemoOutputChannel } from "./2_outputChannel";
import { DemoConfiguration, Section } from "./3_configuration";

export namespace DemoListener {
    export function initialize(context: ExtensionContext) {
        context.subscriptions.push(
            workspace.onDidChangeTextDocument((event) => {
                const document = event.document;
                if (document.languageId === 'sql') {
                    // Get file name and content
                    const fileName = document.fileName;
                    const text = document.getText();

                    // Clear output channel if configured to do so
                    const outputChannel = DemoOutputChannel.getInstance();
                    const clearOutputChannelOnChange = DemoConfiguration.get<boolean>(Section.clearOutputChannelOnChange);
                    if (clearOutputChannelOnChange) {
                        outputChannel.clear();
                    }

                    // Log opened file and preview to output channel
                    outputChannel.appendLine('--------');
                    outputChannel.appendLine(`Changed SQL File:\n${fileName}`);
                    outputChannel.appendLine(`Text:\n${text}`);
                    outputChannel.appendLine('--------\n');
                }
            })
        );
    }
}