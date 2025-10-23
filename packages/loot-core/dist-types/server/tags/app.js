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
exports.app = void 0;
const app_1 = require("../app");
const db = __importStar(require("../db"));
const mutators_1 = require("../mutators");
const sync_1 = require("../sync");
const undo_1 = require("../undo");
exports.app = (0, app_1.createApp)();
exports.app.method('tags-get', getTags);
exports.app.method('tags-create', (0, mutators_1.mutator)((0, undo_1.undoable)(createTag)));
exports.app.method('tags-delete', (0, mutators_1.mutator)((0, undo_1.undoable)(deleteTag)));
exports.app.method('tags-delete-all', (0, mutators_1.mutator)(deleteAllTags));
exports.app.method('tags-update', (0, mutators_1.mutator)((0, undo_1.undoable)(updateTag)));
exports.app.method('tags-find', (0, mutators_1.mutator)(findTags));
async function getTags() {
    return await db.getTags();
}
async function createTag({ tag, color = null, description = null, }) {
    const allTags = await db.getAllTags();
    const { id: tagId = null } = allTags.find(t => t.tag === tag) || {};
    if (tagId) {
        await db.updateTag({
            id: tagId,
            tag,
            color,
            description,
            tombstone: 0,
        });
        return { id: tagId, tag, color, description };
    }
    const id = await db.insertTag({
        tag: tag.trim(),
        color: color ? color.trim() : null,
        description,
    });
    return { id, tag, color, description };
}
async function deleteTag(tag) {
    await db.deleteTag(tag);
    return tag.id;
}
async function deleteAllTags(ids) {
    await (0, sync_1.batchMessages)(async () => {
        for (const id of ids) {
            await db.deleteTag({ id });
        }
    });
    return ids;
}
async function updateTag(tag) {
    await db.updateTag(tag);
    return tag;
}
async function findTags() {
    const taggedNotes = await db.findTags();
    const tags = await getTags();
    for (const { notes } of taggedNotes) {
        for (const [_, tag] of notes.matchAll(/(?<!#)#([^#\s]+)/g)) {
            if (!tags.find(t => t.tag === tag)) {
                tags.push(await createTag({ tag }));
            }
        }
    }
    return tags.sort(function (a, b) {
        if (a.tag < b.tag) {
            return -1;
        }
        if (a.tag > b.tag) {
            return 1;
        }
        return 0;
    });
}
//# sourceMappingURL=app.js.map