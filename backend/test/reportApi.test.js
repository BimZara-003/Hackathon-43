const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('../server');

test('report API supports its main demo flow', async () => {
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const baseUrl = `http://127.0.0.1:${server.address().port}`;

  try {
    let response = await fetch(`${baseUrl}/reports`);
    let body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.count, 8);

    response = await fetch(`${baseUrl}/reports?category=Unsafe%20Area&status=Open`);
    body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.count, 1);
    assert.equal(body.reports[0].category, 'Unsafe Area');

    response = await fetch(`${baseUrl}/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Streetlight broken near school',
        description: 'The streetlight outside the school has not worked for three nights.',
        category: 'Streetlight',
        location: 'High Level Road, Nugegoda',
        severity: 'High',
        isAnonymous: true,
      }),
    });
    body = await response.json();
    assert.equal(response.status, 201);
    assert.equal(body.report.status, 'Open');
    assert.equal(body.report.upvotes, 0);
    const reportId = body.report.id;

    response = await fetch(`${baseUrl}/reports/${reportId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'In Progress' }),
    });
    body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.report.status, 'In Progress');

    response = await fetch(`${baseUrl}/reports/${reportId}/upvote`, { method: 'POST' });
    body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.report.upvotes, 1);

    response = await fetch(`${baseUrl}/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Short description test',
        description: 'Too short',
        category: 'Other',
        location: 'Colombo',
      }),
    });
    body = await response.json();
    assert.equal(response.status, 400);
    assert.equal(body.error, 'Description must be at least 10 characters');

    response = await fetch(`${baseUrl}/reports/9999`);
    assert.equal(response.status, 404);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
