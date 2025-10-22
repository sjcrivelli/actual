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
            }
        });
    });
}
function promptPassword() {
    return __awaiter(this, void 0, void 0, function () {
        var password, password2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, askForPassword('Enter a password, then press enter: ')];
                case 1:
                    password = _a.sent();
                    if (password === '') {
                        console.log('Password cannot be empty.');
                        return [2 /*return*/, promptPassword()];
                    }
                    return [4 /*yield*/, askForPassword('Enter the password again, then press enter: ')];
                case 2:
                    password2 = _a.sent();
                    if (password !== password2) {
                        console.log('Passwords do not match.');
                        return [2 /*return*/, promptPassword()];
                    }
                    return [2 /*return*/, password];
            }
        });
    });
}
function askForPassword(prompt) {
    return __awaiter(this, void 0, void 0, function () {
        var dataListener, endListener, promise, answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dataListener = function () { };
                    endListener = function () { };
                    promise = new Promise(function (resolve) {
                        var result = '';
                        process.stdout.write(prompt);
                        process.stdin.setRawMode(true);
                        process.stdin.resume();
                        dataListener = function (key) {
                            var char = typeof key === 'string' ? key : key.toString();
                            switch (key[0]) {
                                case 0x03: // ^C
                                    process.exit();
                                    break;
                                case 0x0d: // Enter
                                    process.stdin.setRawMode(false);
                                    process.stdin.pause();
                                    resolve(result);
                                    break;
                                case 0x7f: // Backspace
                                case 0x08: // Delete
                                    if (result) {
                                        result = result.slice(0, -1);
                                        (0, node_readline_1.cursorTo)(process.stdout, prompt.length + result.length);
                                        process.stdout.write(' ');
                                        (0, node_readline_1.cursorTo)(process.stdout, prompt.length + result.length);
                                    }
                                    break;
                                default:
                                    result += char;
                                    process.stdout.write('*');
                                    break;
                            }
                        };
                        process.stdin.on('data', dataListener);
                        endListener = function () { return resolve(result); };
                        process.stdin.on('end', endListener);
                    });
                    return [4 /*yield*/, promise];
                case 1:
                    answer = _a.sent();
                    process.stdin.off('data', dataListener);
                    process.stdin.off('end', endListener);
                    process.stdout.write('\n');
                    return [2 /*return*/, answer];
            }
        });
    });
}
