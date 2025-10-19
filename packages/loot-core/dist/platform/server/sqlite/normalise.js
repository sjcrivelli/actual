"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalise = normalise;
const normalisation_1 = require("../../../shared/normalisation");
function normalise(value) {
    if (!value) {
        return null;
    }
    return (0, normalisation_1.getNormalisedString)(value);
}
