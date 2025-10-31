import { pgTable, serial, integer, text, timestamp, pgEnum, boolean } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	age: integer('age'),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});
export type User = typeof user.$inferSelect;


export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id').notNull().references(() => user.id),
	token: text('token').unique(),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});
export type Session = typeof session.$inferSelect;


// this is the stuff from the old meta.md
export const guide = pgTable('guide', {
	id: text('id').primaryKey().notNull().unique(),
	title: text('title').notNull().unique(),
	
})
export type Guide = typeof guide.$inferSelect;

export const typeEnum = pgEnum('elementType', ['cache', 'tutorial', 'project'])
export const element = pgTable('element', {
	id: text('id').primaryKey(),
	title: text('title').notNull().unique(),
	authors: text('authors').notNull(),
	content: text('content'),
	short: text('short').notNull(),
	long: text('long').notNull(),
	type: typeEnum().notNull(),
	file: text('file').notNull(),
	locked: boolean('locked').notNull(),
	guide: text('guide').notNull().references(() => guide.id)
})
export type Element = typeof element.$inferSelect;



export const project = pgTable('project', {
	id: text('id').primaryKey(),
	title: text('title').notNull().unique(),
	authors: text('authors').notNull(),
	locked: boolean('locked').notNull()
})
export type Project = typeof project.$inferSelect;


export const project_node = pgTable('project_node', {
	id: text('id').primaryKey(),
	element: text('element').notNull().references(() => element.id),
	project: text('project').notNull().references(() => project.id),
	position: integer('position').notNull(),
	optional: boolean('optional').notNull()
})
export type ProjectNode = typeof project_node.$inferSelect;

export const practice_question = pgTable('practice_question', {
	id: text('id').primaryKey(),
	content: text('content').notNull(),
	elementID: text('elementID').notNull().references(() => element.id)
})
export type PracticeQuestion = typeof practice_question.$inferSelect;


export const quiz_performance = pgTable('quiz_performance', {
	id: text('id').primaryKey(),
	questionID: text('questionID').notNull().references(() => practice_question.id),
	userID: text('userID').notNull().references(() => user.id),
	response: text('response'),
	status: boolean('status').notNull(),
	date: timestamp('date', { withTimezone: true, mode: 'date' }).notNull()
})
export type QuizPerformance = typeof quiz_performance.$inferSelect;



export const prompt = pgTable('prompt', {
	id: text('id').primaryKey(),
	content: text('id').notNull(),
	elementID: text('elementID').notNull().references(() => element.id)
})
export type Prompt = typeof prompt.$inferSelect;


export const prompt_performance = pgTable('prompt_performance', {
	id: text('id').primaryKey(),
	promptID: text('promptID').notNull().references(() => prompt.id),
	userID: text('userID').notNull().references(() => user.id),
	response: text('response'),
	status: boolean('status').notNull(),
	date: timestamp('date', { withTimezone: true, mode: 'date' }).notNull()
})
export type PromptPerformance= typeof prompt_performance.$inferSelect;


export const edge = pgTable('edge', {
	id: text('id').primaryKey(),
	to: text('to').notNull().references(() => element.id),
	from: text('from').notNull().references(() => element.id),
	optional: boolean('optional').notNull(),
	project: text('project').references(() => project.id)
})
export type Edge = typeof edge.$inferSelect;


