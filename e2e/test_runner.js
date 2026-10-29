const { chromium } = require('playwright');
const { AxeBuilder } = require('@axe-core/playwright');
const fs = require('fs');
const path = require('path');

const screenshotDir = path.join(__dirname, '../screenshots');
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

const pagesToTest = [
  { name: '01_home_light', url: 'http://localhost:8000/', theme: 'default' },
  { name: '01_home_dark', url: 'http://localhost:8000/', theme: 'slate' },
  { name: '02_visao_escopo_light', url: 'http://localhost:8000/produto/visao-e-escopo/', theme: 'default' },
  { name: '02_visao_escopo_dark', url: 'http://localhost:8000/produto/visao-e-escopo/', theme: 'slate' },
  { name: '03_ishikawa', url: 'http://localhost:8000/produto/ishikawa/', theme: 'default' },
  { name: '04_backlog_moscow', url: 'http://localhost:8000/backlog/requisitos-moscow/', theme: 'default' },
  { name: '05_dod', url: 'http://localhost:8000/gestao/dod/', theme: 'default' },
  { name: '06_adr_stack', url: 'http://localhost:8000/arquitetura/adrs/001-stack-base/', theme: 'default' }
];

async function run() {
  const executablePath = process.env.CHROME_BIN || (fs.existsSync('/usr/bin/google-chrome') ? '/usr/bin/google-chrome' : undefined);

  const browser = await chromium.launch({
    headless: true,
    executablePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const a11yResults = [];
  let totalViolations = 0;

  for (const pageInfo of pagesToTest) {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 }
    });
    const page = await context.newPage();

    console.log(`Auditing: ${pageInfo.url} [${pageInfo.theme}]...`);
    await page.goto(pageInfo.url, { waitUntil: 'networkidle' });

    if (pageInfo.theme) {
      await page.evaluate((theme) => {
        document.body.setAttribute('data-md-color-scheme', theme);
      }, pageInfo.theme);
      await page.waitForTimeout(200);
    }

    const screenshotPath = path.join(screenshotDir, `${pageInfo.name}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: false });

    try {
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      const violations = results.violations.map(v => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        help: v.help,
        nodesCount: v.nodes.length
      }));

      totalViolations += violations.length;
      a11yResults.push({
        name: pageInfo.name,
        url: pageInfo.url,
        theme: pageInfo.theme,
        violations
      });
    } catch (err) {
      console.error(`Axe error on ${pageInfo.name}:`, err.message);
    }

    await context.close();
  }

  await browser.close();

  const reportPath = path.join(screenshotDir, 'a11y_report.json');
  fs.writeFileSync(reportPath, JSON.stringify(a11yResults, null, 2));

  console.log(`\n========================================`);
  console.log(`A11y Audit Complete! Total Violations: ${totalViolations}`);
  console.log(`Report: ${reportPath}`);
  console.log(`Screenshots: ${screenshotDir}`);
  console.log(`========================================\n`);

  if (totalViolations > 0) {
    process.exit(1);
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
