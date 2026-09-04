const test = require('node:test');
const assert = require('node:assert/strict');
process.env.SKIP_DATABASE = 'true';
const app = require('../server');

test('report API supports its main demo flow', async () => {
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const baseUrl = `http://127.0.0.1:${server.address().port}`;

  try {
    // 1. List reports
    let response = await fetch(`${baseUrl}/reports`);
    let body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.count, 8);

    // 2. Filter reports
    response = await fetch(`${baseUrl}/reports?category=Unsafe%20Area&status=Open`);
    body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.count, 1);
    assert.equal(body.reports[0].category, 'Unsafe Area');

    // 3. Stats endpoints (/stats and /reports/stats)
    response = await fetch(`${baseUrl}/stats`);
    body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.totalReports, 8);
    assert.equal(body.openCount, 5);
    assert.equal(body.inProgressCount, 2);
    assert.equal(body.resolvedCount, 1);

    response = await fetch(`${baseUrl}/reports/stats`);
    body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.totalReports, 8);

    // 4. AI Analysis endpoint (/reports/analyze)
    response = await fetch(`${baseUrl}/reports/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description: 'Large deep pothole on Galle Road forcing vehicles to swerve into oncoming traffic at night.',
      }),
    });
    body = await response.json();
    assert.equal(response.status, 200);
    assert.ok(['Low', 'Medium', 'High'].includes(body.suggestedUrgency));
    assert.ok(typeof body.suggestedCategory === 'string');
    assert.ok(typeof body.summary === 'string');

    // 5. Add report
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

    // 6. Update status
    response = await fetch(`${baseUrl}/reports/${reportId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'In Progress' }),
    });
    body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.report.status, 'In Progress');

    // 7. Upvote report
    response = await fetch(`${baseUrl}/reports/${reportId}/upvote`, { method: 'POST' });
    body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.report.upvotes, 1);

    // 8. Admin Verify report
    response = await fetch(`${baseUrl}/reports/${reportId}/verify`, { method: 'PATCH' });
    body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.report.isVerified, true);

    // 9. Admin Priority override
    response = await fetch(`${baseUrl}/reports/${reportId}/priority`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priority: 'High' }),
    });
    body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.report.priority, 'High');

    // 10. Validation checks
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

    // 11. 404 check
    response = await fetch(`${baseUrl}/reports/9999`);
    assert.equal(response.status, 404);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
