import { Router } from 'express';
import { db } from './db.js';
import * as schema from './schema.js';
import { eq, desc, and, like, or, sql } from 'drizzle-orm';

const router = Router();

// Sales Reps
router.get('/api/sales-reps', async (req, res) => {
  try {
    const reps = await db.select().from(schema.salesReps);
    res.json(reps);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sales reps' });
  }
});

// Customers
router.get('/api/customers', async (req, res) => {
  try {
    const customers = await db.select().from(schema.customers);
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

router.get('/api/customers/:id', async (req, res) => {
  try {
    const customer = await db
      .select()
      .from(schema.customers)
      .where(eq(schema.customers.id, parseInt(req.params.id)))
      .limit(1);
    res.json(customer[0] || null);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

// Emails
router.get('/api/emails', async (req, res) => {
  try {
    const emails = await db
      .select()
      .from(schema.emails)
      .orderBy(desc(schema.emails.receivedAt));
    res.json(emails);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch emails' });
  }
});

router.get('/api/emails/:id', async (req, res) => {
  try {
    const email = await db
      .select()
      .from(schema.emails)
      .where(eq(schema.emails.id, parseInt(req.params.id)))
      .limit(1);
    res.json(email[0] || null);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch email' });
  }
});

router.patch('/api/emails/:id', async (req, res) => {
  try {
    const updated = await db
      .update(schema.emails)
      .set(req.body)
      .where(eq(schema.emails.id, parseInt(req.params.id)))
      .returning();
    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update email' });
  }
});

// Products
router.get('/api/products', async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = db.select().from(schema.products);
    
    if (search && typeof search === 'string') {
      query = query.where(
        or(
          like(schema.products.code, `%${search}%`),
          like(schema.products.name, `%${search}%`)
        )
      );
    }
    
    if (category && typeof category === 'string') {
      query = query.where(eq(schema.products.category, category));
    }
    
    const products = await query;
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.get('/api/products/:id', async (req, res) => {
  try {
    const product = await db
      .select()
      .from(schema.products)
      .where(eq(schema.products.id, parseInt(req.params.id)))
      .limit(1);
    
    if (!product[0]) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Get components if it's a composite product
    let components = [];
    if (product[0].isComposite) {
      components = await db
        .select({
          id: schema.productComponents.id,
          quantity: schema.productComponents.quantity,
          product: schema.products,
        })
        .from(schema.productComponents)
        .innerJoin(
          schema.products,
          eq(schema.productComponents.componentProductId, schema.products.id)
        )
        .where(eq(schema.productComponents.parentProductId, product[0].id));
    }
    
    res.json({ ...product[0], components });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Invoices
router.get('/api/invoices', async (req, res) => {
  try {
    const { type, status } = req.query;
    let query = db.select().from(schema.invoices);
    
    if (type && typeof type === 'string') {
      query = query.where(eq(schema.invoices.type, type));
    }
    
    if (status && typeof status === 'string') {
      query = query.where(eq(schema.invoices.status, status));
    }
    
    const invoices = await query.orderBy(desc(schema.invoices.createdAt));
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

router.get('/api/invoices/:id', async (req, res) => {
  try {
    const invoice = await db
      .select()
      .from(schema.invoices)
      .where(eq(schema.invoices.id, parseInt(req.params.id)))
      .limit(1);
    res.json(invoice[0] || null);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch invoice' });
  }
});

router.patch('/api/invoices/:id', async (req, res) => {
  try {
    const updated = await db
      .update(schema.invoices)
      .set(req.body)
      .where(eq(schema.invoices.id, parseInt(req.params.id)))
      .returning();
    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update invoice' });
  }
});

// Delivery Notes
router.get('/api/delivery-notes', async (req, res) => {
  try {
    const notes = await db
      .select()
      .from(schema.deliveryNotes)
      .orderBy(desc(schema.deliveryNotes.date));
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch delivery notes' });
  }
});

// Orders
router.get('/api/orders', async (req, res) => {
  try {
    const orders = await db
      .select()
      .from(schema.orders)
      .orderBy(desc(schema.orders.createdAt));
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

router.post('/api/orders', async (req, res) => {
  try {
    const order = await db.insert(schema.orders).values(req.body).returning();
    res.json(order[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Dashboard Stats
router.get('/api/dashboard/stats', async (req, res) => {
  try {
    const stats = await db.select().from(schema.dashboardStats);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// Dashboard summary
router.get('/api/dashboard/summary', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [emailsToday] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.emails)
      .where(sql`${schema.emails.receivedAt} >= ${today}`);

    const [ordersToday] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.orders)
      .where(sql`${schema.orders.createdAt} >= ${today}`);

    const [totalInvoices] = await db
      .select({ total: sql<number>`sum(${schema.invoices.amount})::numeric` })
      .from(schema.invoices)
      .where(eq(schema.invoices.type, 'issued'));

    const [overdueInvoices] = await db
      .select({ total: sql<number>`sum(${schema.invoices.amount})::numeric` })
      .from(schema.invoices)
      .where(
        and(
          eq(schema.invoices.type, 'issued'),
          eq(schema.invoices.status, 'overdue')
        )
      );

    res.json({
      emailsToday: emailsToday?.count || 0,
      ordersToday: ordersToday?.count || 0,
      totalInvoiced: totalInvoices?.total || 0,
      overdueAmount: overdueInvoices?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard summary' });
  }
});

export default router;
