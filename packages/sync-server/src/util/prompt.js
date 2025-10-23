import { createInterface } from "node:readline";

/**
 * Prompts the user for input in the terminal.
 * @param {string} message - The prompt message.
 * @returns {Promise<string>} The user's input.
 */
export async function prompt(message) {
    return new Promise(resolve => {
        const rl = createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question(message, answer => {
            rl.close();
            resolve(answer);
            });
        });
    }

/**
 * Prompts the user for a password in the terminal (input hidden).
 * @param {string} message - The prompt message.
 * @returns {Promise<string>} The user's input.
 */
export async function promptPassword(message) {
    return new Promise(resolve => {
        const rl = createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        // Hide input by muting output
        process.stdout.write(message);
        let input = "";
        rl.input.on("data", char => {
            char = char.toString();
            switch (char) {
                case "\n":
                case "\r":
                case "\u0004":
                    rl.close();
                    process.stdout.write("\n");
                    resolve(input);
                    break;
                default:
                    input += char;
                    break;
            }
        });
    });
}
