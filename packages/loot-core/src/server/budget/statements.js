import * as db from '../db';
import { GOAL_PREFIX, TEMPLATE_PREFIX } from './template-notes';
/* eslint-disable actual/typography */
export async function resetCategoryGoalDefsWithNoTemplates() {
    await db.run(`
      UPDATE categories
      SET goal_def = NULL
      WHERE id NOT IN (SELECT n.id
                       FROM notes n
                       WHERE lower(note) LIKE '%${TEMPLATE_PREFIX}%'
                          OR lower(note) LIKE '%${GOAL_PREFIX}%')
        AND COALESCE(JSON_EXTRACT(template_settings, '$.source'), 'notes') <> 'ui'
    `);
}
export async function getCategoriesWithTemplateNotes() {
    return await db.all(`
      SELECT c.id AS id, c.name as name, n.note AS note
      FROM notes n
             JOIN categories c ON n.id = c.id
      WHERE c.id = n.id
        AND c.tombstone = 0
        AND COALESCE(JSON_EXTRACT(c.template_settings, '$.source'), 'notes') <> 'ui'
        AND (lower(note) LIKE '%${TEMPLATE_PREFIX}%'
        OR lower(note) LIKE '%${GOAL_PREFIX}%')
    `);
}
export async function getActiveSchedules() {
    return await db.all('SELECT id, rule, active, completed, posts_transaction, tombstone, name from schedules WHERE name NOT NULL AND tombstone = 0');
}
