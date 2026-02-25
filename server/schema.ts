import { pgTable, serial, text, integer, decimal, timestamp, json, varchar, boolean } from 'drizzle-orm/pg-core';

export const customers = pgTable('customers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  company: text('company').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  assignedOzId: integer('assigned_oz_id'),
  segment: text('segment'),
  creditTerms: integer('credit_terms').default(30),
  discount: decimal('discount', { precision: 5, scale: 2 }).default('0'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const salesReps = pgTable('sales_reps', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  location: text('location'),
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const emails = pgTable('emails', {
  id: serial('id').primaryKey(),
  from: text('from').notNull(),
  fromCompany: text('from_company'),
  subject: text('subject').notNull(),
  body: text('body').notNull(),
  receivedAt: timestamp('received_at').defaultNow(),
  status: text('status').notNull().default('new'), // new, processed, action-taken
  aiSuggestedAction: text('ai_suggested_action'), // create-order, create-invoice, respond-with-prices, assign-to-rep, request-info
  aiConfidence: decimal('ai_confidence', { precision: 5, scale: 2 }),
  assignedOzId: integer('assigned_oz_id'),
  customerId: integer('customer_id'),
});

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  stockQty: integer('stock_qty').default(0),
  supplier: text('supplier'),
  unit: text('unit').default('ks'),
  description: text('description'),
  isComposite: boolean('is_composite').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const productComponents = pgTable('product_components', {
  id: serial('id').primaryKey(),
  parentProductId: integer('parent_product_id').notNull(),
  componentProductId: integer('component_product_id').notNull(),
  quantity: decimal('quantity', { precision: 10, scale: 3 }).notNull(),
});

export const invoices = pgTable('invoices', {
  id: serial('id').primaryKey(),
  number: varchar('number', { length: 50 }).notNull().unique(),
  customerId: integer('customer_id').notNull(),
  type: text('type').notNull(), // issued, received
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  vatAmount: decimal('vat_amount', { precision: 10, scale: 2 }).notNull(),
  dueDate: timestamp('due_date').notNull(),
  status: text('status').notNull().default('draft'), // draft, sent, viewed, paid, overdue
  revolutPaymentId: text('revolut_payment_id'),
  deliveryNoteId: integer('delivery_note_id'),
  items: json('items'),
  createdAt: timestamp('created_at').defaultNow(),
  paidAt: timestamp('paid_at'),
});

export const deliveryNotes = pgTable('delivery_notes', {
  id: serial('id').primaryKey(),
  number: varchar('number', { length: 50 }).notNull().unique(),
  customerId: integer('customer_id').notNull(),
  date: timestamp('date').defaultNow(),
  status: text('status').notNull().default('pending'), // pending, invoiced, completed
  items: json('items').notNull(),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  customerId: integer('customer_id').notNull(),
  emailId: integer('email_id'),
  status: text('status').notNull().default('new'), // new, confirmed, in-progress, completed, cancelled
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }),
  items: json('items').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  confirmedAt: timestamp('confirmed_at'),
});

export const dashboardStats = pgTable('dashboard_stats', {
  id: serial('id').primaryKey(),
  date: timestamp('date').notNull(),
  metric: text('metric').notNull(),
  value: decimal('value', { precision: 12, scale: 2 }).notNull(),
});
