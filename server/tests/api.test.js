import request from 'supertest';
import mongoose from 'mongoose';
import app from '../index.js';

// ---------------------------------------------------------------------------
// Test configuration
// ---------------------------------------------------------------------------
const TEST_DB = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/nextstep_test';

beforeAll(async () => {
  await mongoose.connect(TEST_DB);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

// ---------------------------------------------------------------------------
// Helper utilities
// ---------------------------------------------------------------------------
const testUser = {
  name: 'Test User',
  email: `test_${Date.now()}@nextstep.test`,
  password: 'TestPass123!',
  confirmPassword: 'TestPass123!',
};

let authCookie = '';
let userId = '';

/** Register a user and capture the auth cookie */
const registerAndLogin = async () => {
  const res = await request(app)
    .post('/api/auth/register')
    .send(testUser);
  
  expect(res.status).toBe(201);
  authCookie = res.headers['set-cookie']?.[0] || '';
  userId = res.body.data?.user?._id;
  return res;
};

// ===========================================================================
// AUTH ROUTES
// ===========================================================================
describe('POST /api/auth/register', () => {
  it('registers a new user successfully', async () => {
    const uniqueUser = {
      name: 'Auth Test User',
      email: `auth_${Date.now()}@nextstep.test`,
      password: 'SecurePass99!',
      confirmPassword: 'SecurePass99!',
    };
    const res = await request(app).post('/api/auth/register').send(uniqueUser);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(uniqueUser.email.toLowerCase());
    expect(res.body.data.user.password).toBeUndefined(); // Never expose password
  });

  it('rejects registration with mismatched passwords', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'User',
      email: `mismatch_${Date.now()}@test.com`,
      password: 'Pass1234!',
      confirmPassword: 'Different!',
    });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('rejects registration with invalid email', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'User',
      email: 'not-an-email',
      password: 'Pass1234!',
      confirmPassword: 'Pass1234!',
    });
    expect(res.status).toBe(400);
  });

  it('rejects registration with password shorter than 8 chars', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'User',
      email: `short_${Date.now()}@test.com`,
      password: 'short',
      confirmPassword: 'short',
    });
    expect(res.status).toBe(400);
  });

  it('rejects duplicate email registration', async () => {
    const email = `dup_${Date.now()}@nextstep.test`;
    await request(app).post('/api/auth/register').send({
      name: 'First',
      email,
      password: 'Pass1234!',
      confirmPassword: 'Pass1234!',
    });
    const res = await request(app).post('/api/auth/register').send({
      name: 'Second',
      email,
      password: 'Pass1234!',
      confirmPassword: 'Pass1234!',
    });
    expect(res.status).toBe(409);
  });
});

describe('POST /api/auth/login', () => {
  let loginEmail;

  beforeAll(async () => {
    loginEmail = `login_${Date.now()}@nextstep.test`;
    await request(app).post('/api/auth/register').send({
      name: 'Login Test',
      email: loginEmail,
      password: 'LoginPass1!',
      confirmPassword: 'LoginPass1!',
    });
  });

  it('logs in with valid credentials and sets cookie', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: loginEmail,
      password: 'LoginPass1!',
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.password).toBeUndefined();
    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    expect(cookies[0]).toMatch(/token=/);
    expect(cookies[0]).toMatch(/HttpOnly/i);
  });

  it('rejects login with wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: loginEmail,
      password: 'WrongPassword!',
    });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('rejects login with non-existent email', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'nobody@nowhere.test',
      password: 'AnyPass123!',
    });
    expect(res.status).toBe(401);
  });
});

describe('GET /api/auth/me', () => {
  beforeAll(registerAndLogin);

  it('returns current user when authenticated', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Cookie', authCookie);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.password).toBeUndefined();
  });

  it('returns 401 without auth cookie', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});

// ===========================================================================
// CAREER GOALS
// ===========================================================================
describe('Career Goals CRUD', () => {
  let goalId;

  beforeAll(async () => {
    if (!authCookie) await registerAndLogin();
  });

  it('creates a career goal', async () => {
    const res = await request(app)
      .post('/api/career-goals')
      .set('Cookie', authCookie)
      .send({
        title: 'Become a Full-Stack Developer',
        targetRole: 'Full-Stack Developer',
        description: 'Learn React and Node.js',
        targetDate: '2025-12-31',
        status: 'active',
      });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    goalId = res.body.data.goal?._id || res.body.data.careerGoal?._id;
  });

  it('lists career goals for the user', async () => {
    const res = await request(app)
      .get('/api/career-goals')
      .set('Cookie', authCookie);
    expect(res.status).toBe(200);
    const list = res.body.data.goals || res.body.data.careerGoals;
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThan(0);
  });

  it('updates a career goal', async () => {
    const res = await request(app)
      .patch(`/api/career-goals/${goalId}`)
      .set('Cookie', authCookie)
      .send({ title: 'Updated Goal Title' });
    expect(res.status).toBe(200);
    const updated = res.body.data.goal || res.body.data.careerGoal;
    expect(updated.title).toBe('Updated Goal Title');
  });

  it('rejects access to another user goal', async () => {
    // A second user tries to access the first user's goal
    const secondUser = {
      name: 'Second User',
      email: `second_${Date.now()}@nextstep.test`,
      password: 'SecondPass1!',
      confirmPassword: 'SecondPass1!',
    };
    const regRes = await request(app).post('/api/auth/register').send(secondUser);
    const secondCookie = regRes.headers['set-cookie']?.[0];
    
    const res = await request(app)
      .patch(`/api/career-goals/${goalId}`)
      .set('Cookie', secondCookie)
      .send({ title: 'Hijacked' });
    expect(res.status).toBe(404); // Not found for this user
  });

  it('deletes a career goal', async () => {
    const res = await request(app)
      .delete(`/api/career-goals/${goalId}`)
      .set('Cookie', authCookie);
    expect(res.status).toBe(200);
  });
});

// ===========================================================================
// JOB APPLICATIONS
// ===========================================================================
describe('Job Applications CRUD', () => {
  let appId;

  it('creates a job application', async () => {
    const res = await request(app)
      .post('/api/job-applications')
      .set('Cookie', authCookie)
      .send({
        company: 'Acme Corp',
        jobTitle: 'Junior Developer',
        applicationDate: '2024-01-15',
        status: 'applied',
      });
    expect(res.status).toBe(201);
    appId = res.body.data.application._id;
  });

  it('lists job applications', async () => {
    const res = await request(app)
      .get('/api/job-applications')
      .set('Cookie', authCookie);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data.applications)).toBe(true);
  });

  it('filters job applications by status', async () => {
    const res = await request(app)
      .get('/api/job-applications?status=applied')
      .set('Cookie', authCookie);
    expect(res.status).toBe(200);
    res.body.data.applications.forEach((a) => expect(a.status).toBe('applied'));
  });

  it('updates a job application status', async () => {
    const res = await request(app)
      .patch(`/api/job-applications/${appId}`)
      .set('Cookie', authCookie)
      .send({ status: 'interview' });
    expect(res.status).toBe(200);
    expect(res.body.data.application.status).toBe('interview');
  });

  it('deletes a job application', async () => {
    const res = await request(app)
      .delete(`/api/job-applications/${appId}`)
      .set('Cookie', authCookie);
    expect(res.status).toBe(200);
  });
});

// ===========================================================================
// TRANSACTIONS
// ===========================================================================
describe('Transactions CRUD', () => {
  let txId;

  it('creates an expense transaction', async () => {
    const res = await request(app)
      .post('/api/transactions')
      .set('Cookie', authCookie)
      .send({
        type: 'expense',
        amount: 1500,
        category: 'Food',
        description: 'Monthly groceries',
        date: new Date().toISOString(),
      });
    expect(res.status).toBe(201);
    txId = res.body.data.transaction._id;
  });

  it('rejects negative transaction amounts', async () => {
    const res = await request(app)
      .post('/api/transactions')
      .set('Cookie', authCookie)
      .send({
        type: 'expense',
        amount: -500,
        category: 'Food',
        date: new Date().toISOString(),
      });
    expect(res.status).toBe(400);
  });

  it('lists transactions', async () => {
    const res = await request(app)
      .get('/api/transactions')
      .set('Cookie', authCookie);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data.transactions)).toBe(true);
  });

  it('deletes a transaction', async () => {
    const res = await request(app)
      .delete(`/api/transactions/${txId}`)
      .set('Cookie', authCookie);
    expect(res.status).toBe(200);
  });
});

// ===========================================================================
// BUDGETS
// ===========================================================================
describe('Budgets CRUD', () => {
  let budgetId;
  const now = new Date();

  it('creates a budget', async () => {
    const res = await request(app)
      .post('/api/budgets')
      .set('Cookie', authCookie)
      .send({
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        category: 'Transport',
        limit: 3000,
      });
    expect(res.status).toBe(201);
    budgetId = res.body.data.budget._id;
  });

  it('rejects duplicate budget for same month/category', async () => {
    const res = await request(app)
      .post('/api/budgets')
      .set('Cookie', authCookie)
      .send({
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        category: 'Transport',
        limit: 5000,
      });
    expect(res.status).toBe(409);
  });

  it('lists budgets for a month', async () => {
    const res = await request(app)
      .get(`/api/budgets?month=${now.getMonth() + 1}&year=${now.getFullYear()}`)
      .set('Cookie', authCookie);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data.budgets)).toBe(true);
  });

  it('deletes a budget', async () => {
    const res = await request(app)
      .delete(`/api/budgets/${budgetId}`)
      .set('Cookie', authCookie);
    expect(res.status).toBe(200);
  });
});

// ===========================================================================
// SAVINGS GOALS
// ===========================================================================
describe('Savings Goals CRUD', () => {
  let goalId;

  it('creates a savings goal', async () => {
    const res = await request(app)
      .post('/api/savings-goals')
      .set('Cookie', authCookie)
      .send({
        name: 'Emergency Fund',
        targetAmount: 50000,
        targetDate: '2025-06-30',
        description: '3 months of expenses',
      });
    expect(res.status).toBe(201);
    goalId = res.body.data.goal?._id || res.body.data.savingsGoal?._id;
  });

  it('records a contribution', async () => {
    const res = await request(app)
      .post(`/api/savings-goals/${goalId}/contribute`)
      .set('Cookie', authCookie)
      .send({ amount: 5000, type: 'deposit', note: 'Monthly deposit' });
    expect([200, 201]).toContain(res.status);
    const updated = res.body.data.goal || res.body.data.savingsGoal;
    expect(updated.currentAmount).toBe(5000);
  });

  it('rejects a withdrawal that would result in negative balance', async () => {
    const res = await request(app)
      .post(`/api/savings-goals/${goalId}/contribute`)
      .set('Cookie', authCookie)
      .send({ amount: 99999, type: 'withdrawal' });
    expect(res.status).toBe(400);
  });

  it('deletes a savings goal', async () => {
    const res = await request(app)
      .delete(`/api/savings-goals/${goalId}`)
      .set('Cookie', authCookie);
    expect(res.status).toBe(200);
  });
});

// ===========================================================================
// DASHBOARD SUMMARY
// ===========================================================================
describe('GET /api/dashboard/summary', () => {
  it('returns a summary object for the authenticated user', async () => {
    const now = new Date();
    const res = await request(app)
      .get(`/api/dashboard/summary?month=${now.getMonth() + 1}&year=${now.getFullYear()}`)
      .set('Cookie', authCookie);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const d = res.body.data;
    expect(d).toHaveProperty('careerGoals');
    expect(d).toHaveProperty('applications');
    expect(d).toHaveProperty('finances');
    expect(d.finances).toHaveProperty('income');
    expect(d.finances).toHaveProperty('expenses');
    expect(d.finances).toHaveProperty('netBalance');
    expect(d).toHaveProperty('savingsGoals');
    expect(d).toHaveProperty('recentTransactions');
  });

  it('returns 401 without auth cookie', async () => {
    const res = await request(app).get('/api/dashboard/summary');
    expect(res.status).toBe(401);
  });
});

// ===========================================================================
// CONTACT FORM
// ===========================================================================
describe('POST /api/contact', () => {
  it('saves a contact message', async () => {
    const res = await request(app).post('/api/contact').send({
      name: 'Test Sender',
      email: 'sender@test.com',
      subject: 'Hello',
      message: 'This is a test message from the contact form.',
    });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it('rejects contact form with invalid email', async () => {
    const res = await request(app).post('/api/contact').send({
      name: 'Test',
      email: 'not-valid',
      subject: 'Hi',
      message: 'A message',
    });
    expect(res.status).toBe(400);
  });

  it('rejects contact form with missing fields', async () => {
    const res = await request(app).post('/api/contact').send({
      name: 'Test',
    });
    expect(res.status).toBe(400);
  });
});

// ===========================================================================
// USER DATA ISOLATION
// ===========================================================================
describe('User data isolation', () => {
  let user1Cookie, user2Cookie, user1TxId;

  beforeAll(async () => {
    // Register two separate users
    const res1 = await request(app).post('/api/auth/register').send({
      name: 'Isolation User 1',
      email: `iso1_${Date.now()}@nextstep.test`,
      password: 'IsoPass1111!',
      confirmPassword: 'IsoPass1111!',
    });
    user1Cookie = res1.headers['set-cookie']?.[0];

    const res2 = await request(app).post('/api/auth/register').send({
      name: 'Isolation User 2',
      email: `iso2_${Date.now()}@nextstep.test`,
      password: 'IsoPass2222!',
      confirmPassword: 'IsoPass2222!',
    });
    user2Cookie = res2.headers['set-cookie']?.[0];

    // User 1 creates a transaction
    const txRes = await request(app)
      .post('/api/transactions')
      .set('Cookie', user1Cookie)
      .send({ type: 'income', amount: 25000, category: 'Salary', date: new Date().toISOString() });
    user1TxId = txRes.body.data?.transaction?._id;
  });

  it("user 2 cannot see user 1's transactions", async () => {
    const res = await request(app)
      .get('/api/transactions')
      .set('Cookie', user2Cookie);
    expect(res.status).toBe(200);
    const ids = res.body.data.transactions.map((t) => t._id);
    expect(ids).not.toContain(user1TxId);
  });

  it("user 2 cannot delete user 1's transaction", async () => {
    const res = await request(app)
      .delete(`/api/transactions/${user1TxId}`)
      .set('Cookie', user2Cookie);
    expect(res.status).toBe(404);
  });
});
