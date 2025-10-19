"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetCategoryGoalDefsWithNoTemplates = resetCategoryGoalDefsWithNoTemplates;
exports.getCategoriesWithTemplateNotes = getCategoriesWithTemplateNotes;
exports.getActiveSchedules = getActiveSchedules;
const db = __importStar(require("../db"));
const template_notes_1 = require("./template-notes");
/* eslint-disable actual/typography */
async function resetCategoryGoalDefsWithNoTemplates() {
    await db.run(`
      UPDATE categories
      SET goal_def = NULL
      WHERE id NOT IN (SELECT n.id
                       FROM notes n
                       WHERE lower(note) LIKE '%${template_notes_1.TEMPLATE_PREFIX}%'
                          OR lower(note) LIKE '%${template_notes_1.GOAL_PREFIX}%')
        AND COALESCE(JSON_EXTRACT(template_settings, '$.source'), 'notes') <> 'ui'
    `);
}
async function getCategoriesWithTemplateNotes() {
    return await db.all(`
      SELECT c.id AS id, c.name as name, n.note AS note
      FROM notes n
             JOIN categories c ON n.id = c.id
      WHERE c.id = n.id
        AND c.tombstone = 0
        AND COALESCE(JSON_EXTRACT(c.template_settings, '$.source'), 'notes') <> 'ui'
        AND (lower(note) LIKE '%${template_notes_1.TEMPLATE_PREFIX}%'
        OR lower(note) LIKE '%${template_notes_1.GOAL_PREFIX}%')
    `);
}
async function getActiveSchedules() {
    return await db.all('SELECT id, rule, active, completed, posts_transaction, tombstone, name from schedules WHERE name NOT NULL AND tombstone = 0');
}
