<template>
  <div class="terms-page" :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'">
    <div class="card">
      <header class="card-header">
        <h1>{{ $t("terms.termsPage.title") }}</h1>
      </header>

      <main class="card-body">
        <section>
          <h2>{{ $t("terms.termsPage.sections.respect.title") }}</h2>
          <p v-html="$t('terms.termsPage.sections.respect.body')"></p>
        </section>

        <section>
          <h2>{{ $t("terms.termsPage.sections.violation.title") }}</h2>
          <ol>
            <li>{{ $t("terms.termsPage.sections.violation.point1") }}</li>
            <li>{{ $t("terms.termsPage.sections.violation.point2") }}</li>
            <li>{{ $t("terms.termsPage.sections.violation.point3") }}</li>
          </ol>
        </section>

        <section>
          <h2>{{ $t("terms.termsPage.sections.complaint.title") }}</h2>
          <p v-html="$t('terms.termsPage.sections.complaint.body')"></p>
        </section>

        <section>
          <h2>{{ $t("terms.termsPage.sections.appeal.title") }}</h2>
          <p>{{ $t("terms.termsPage.sections.appeal.body") }}</p>
        </section>

        <section>
          <h2>{{ $t("terms.termsPage.sections.nurseConduct.title") }}</h2>
          <p>{{ $t("terms.termsPage.sections.nurseConduct.body") }}</p>
        </section>

        <section>
          <h2>{{ $t("terms.termsPage.sections.changes.title") }}</h2>
          <p>{{ $t("terms.termsPage.sections.changes.body") }}</p>
        </section>

        <section>
          <h2>{{ $t("terms.termsPage.sections.law.title") }}</h2>
          <p>{{ $t("terms.termsPage.sections.law.body") }}</p>
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
:root {
  --bg: #f6f8fb;
  --card: #ffffff;
  --accent: #0b74de;
  --muted: #6b7280;
  --text-color-light: #24303a;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0f172a;
    --card: #1e293b;
    --muted: #94a3b8;
    --text-color-dark: #ffffff;
  }
}

.terms-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: linear-gradient(180deg, var(--bg), #eef3fb);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: var(--text-color-light);
}

@media (prefers-color-scheme: dark) {
  .terms-page {
    background: var(--bg);
    color: var(--text-color-dark);
  }
}

.card {
  width: 100%;
  max-width: 920px;
  background: var(--card);
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(15, 23, 42, 0.08);
  overflow: hidden;
}

.card-header {
  padding: 28px 32px;
  border-bottom: 1px solid #eef2f6;
}

.card-header h1 {
  margin: 0 0 6px 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--accent);
}

.card-body {
  padding: 20px 32px;
}

.card-body section {
  margin-bottom: 24px;
}

.card-body h2 {
  margin: 0 0 12px 0;
  font-size: 18px;
  font-weight: 500;
  color: var(--accent);
  border-bottom: 1px solid #eef2f6;
  padding-bottom: 8px;
}

.card-body p,
.card-body li {
  line-height: 1.8;
  margin: 0 0 12px 0;
}

.card-body ol {
  padding-right: 20px;
  padding-left: 0;
}

.card-body li {
  margin-bottom: 8px;
}

/* Dark mode styles */
@media (prefers-color-scheme: dark) {
  .card-header {
    border-bottom: 1px solid #334155;
  }

  .card-body h2 {
    color: var(--accent);
    border-bottom: 1px solid #334155;
  }
}
</style>
