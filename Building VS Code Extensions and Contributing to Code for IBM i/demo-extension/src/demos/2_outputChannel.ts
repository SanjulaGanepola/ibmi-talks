import { OutputChannel, window } from "vscode";

export class DemoOutputChannel {
    private static instance: DemoOutputChannel | null = null;
    private readonly outputChannel: OutputChannel;

    private constructor() {
        this.outputChannel = window.createOutputChannel('Demo Extension');
    }

    public static getInstance(): DemoOutputChannel {
        if (!this.instance) {
            this.instance = new DemoOutputChannel();
        }

        return this.instance;
    }

    public appendLine(message: string): void {
        this.outputChannel.appendLine(message);
    }

    public clear(): void {
        this.outputChannel.clear();
    }

    public show(): void {
        this.outputChannel.show();
    }

    public hide(): void {
        this.outputChannel.hide();
    }

    public dispose(): void {
        this.outputChannel.dispose();
        DemoOutputChannel.instance = null;
    }
}