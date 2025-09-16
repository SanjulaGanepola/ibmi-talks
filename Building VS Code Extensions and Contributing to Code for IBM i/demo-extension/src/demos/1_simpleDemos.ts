import { commands, ExtensionContext, window, workspace } from "vscode";

export namespace SimpleDemos {
    export function registerCommands(context: ExtensionContext) {
        context.subscriptions.push(
            commands.registerCommand('demo-extension.getLineCount', async () => {
                // Get the active text editor
                const activeTextEditor = window.activeTextEditor;
                if (activeTextEditor) {
                    // Get the line count
                    const document = activeTextEditor.document;
                    const fileName = document.fileName;
                    const lineCount = document.lineCount;
                    await window.showInformationMessage(`${fileName} has ${lineCount} lines.`);
                } else {
                    await window.showErrorMessage('No active text editor found.');
                }
            }),

            commands.registerCommand('demo-extension.getUserInformation', async () => {
                // Prompt for name
                const name = await window.showInputBox({
                    prompt: 'Enter your name',
                    placeHolder: 'Name'
                });
                if (!name) {
                    return;
                }

                // Prompt for age
                const age = await window.showInputBox({
                    prompt: 'Enter your age',
                    placeHolder: 'Age',
                    validateInput: (value) => {
                        const ageNum = Number(value);
                        if (isNaN(ageNum) || ageNum <= 0) {
                            return 'Please enter a valid number for age.';
                        }
                        return null;
                    }
                });
                if (!age) {
                    return;
                }

                // Prompt for country
                const country = await window.showQuickPick(
                    ['Canada', 'United States', 'Mexico', 'Europe', 'China', 'Japan', 'Other'],
                    {
                        placeHolder: 'Select your country of birth'
                    }
                );
                if (!country) {
                    return;
                }

                // Create a new document with user information
                const user = { name, age, country };
                const content = JSON.stringify(user, null, 2);
                const document = await workspace.openTextDocument({
                    content: content,
                });

                await window.showTextDocument(document);
            }),

            commands.registerCommand('demo-extension.runTerminalCommands', async () => {
                // Create and show a new terminal
                const terminal = window.createTerminal('Demo Terminal');
                terminal.show();

                // Send commands to the terminal
                terminal.sendText(`echo 'Hello from the demo terminal!'`, true);
                terminal.sendText(`whoami`, true);
                terminal.sendText(`pwd`, true);
            })
        );
    }
}