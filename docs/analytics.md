# NextPrint — GA4 Analytics Documentation

Single source of truth for all GA4 tracking lives in `src/lib/analytics.ts`.
`src/lib/tracking.ts` is a deprecated backward-compatibility shim — new code
should import directly from `@/lib/analytics`.

All events are fire-and-forget, client-side only, and contain **zero personal
data** (no name, email, phone, comment text, filenames, or requestId).

---

## Event Reference

### `main_cta_click`

Fired when the user clicks any button that opens the Quote Wizard.

| Param | Type | Example |
|---|---|---|
| `location` | string | `"hero"`, `"header"`, `"footer"`, `"sticky_button"`, `"mobile_menu"`, `"capabilities"`, `"contacts"`, `"portfolio"` |

**Fires in:** `HeroSection.tsx` (location: `"hero"`), `WizardCTA.tsx` (location passed as prop by each call site: `"capabilities"`, `"contacts"`)

```js
gtag("event", "main_cta_click", { location: "hero" });
```

---

### `quote_modal_open`

Fired immediately after `main_cta_click`, when the wizard modal becomes visible.

| Param | Type | Example |
|---|---|---|
| `source` | string | `"cta"` |

**Fires in:** Same call sites as `main_cta_click`, fired together.

```js
gtag("event", "quote_modal_open", { source: "cta" });
```

---

### `quote_started`

Fired once per wizard session — when the user completes Step 1 (production type
selected) and advances to Step 2. This is the first meaningful action signal,
distinct from merely opening the modal.

No parameters.

**Fires in:** `QuoteWizard.tsx` → `handleNext()`, when `step === 1`.

```js
gtag("event", "quote_started");
```

---

### `quote_step_view`

Fired every time the user is shown a new step. Guarded by a `useEffect` keyed
on `[step, isOpen, submitted]` so it does not spam on component re-renders.

| Param | Type | Example |
|---|---|---|
| `step_number` | number | `1` |
| `step_name` | string | `"order_type"` |

**Step map:**

| step_number | step_name |
|---|---|
| 1 | `order_type` |
| 2 | `file_upload` |
| 3 | `order_details` |
| 4 | `contacts` |
| 5 | `review` |

**Fires in:** `QuoteWizard.tsx` → `useEffect` on step change.

```js
gtag("event", "quote_step_view", { step_number: 1, step_name: "order_type" });
```

---

### `quote_step_completed`

Fired when the user presses "Далі" and the step's validation passes (i.e. the
step is genuinely completed, not just viewed).

| Param | Type | Example |
|---|---|---|
| `step_number` | number | `2` |
| `step_name` | string | `"file_upload"` |

**Fires in:** `QuoteWizard.tsx` → `handleNext()`, after validation succeeds and before `goNext()`.

```js
gtag("event", "quote_step_completed", { step_number: 2, step_name: "file_upload" });
```

---

### `quote_file_attached`

Fired when the user attaches one or more files on Step 2.

| Param | Type | Example |
|---|---|---|
| `file_count` | number | `2` |
| `total_size_mb` | number | `4.7` |
| `file_type` | string | `"stl"`, `"step"`, `"3mf"`, `"pdf"`, `"image"`, `"mixed"`, `"other"` |

Filenames are **never** sent — only file extension category and aggregate size.

**Fires in:** `WizardSteps.tsx` → `Step2.handleFiles()`.

```js
gtag("event", "quote_file_attached", { file_count: 1, total_size_mb: 2.3, file_type: "stl" });
```

---

### `quote_file_removed`

Fired when the user removes a previously attached file.

| Param | Type | Example |
|---|---|---|
| `remaining_file_count` | number | `0` |

**Fires in:** `WizardSteps.tsx` → `Step2.removeFile()`.

```js
gtag("event", "quote_file_removed", { remaining_file_count: 0 });
```

---

### `quote_submit_click`

Fired when the user presses "Надіслати заявку" on the final review step,
before the API call is made.

| Param | Type | Example |
|---|---|---|
| `has_file` | boolean | `true` |
| `file_count` | number | `1` |
| `production_type` | string | `"prototype"` |
| `deadline` | string | `"urgent"` |

**Fires in:** `QuoteWizard.tsx` → `handleNext()`, when `step === TOTAL_STEPS`, before `handleSubmitQuote()`.

```js
gtag("event", "quote_submit_click", {
  has_file: true, file_count: 1, production_type: "prototype", deadline: "urgent"
});
```

---

### `quote_submit_success`

Fired when the API confirms the lead was accepted (`{ success: true }`).
Enriched with timing data to analyze how long users spend in the wizard.

| Param | Type | Example |
|---|---|---|
| `request_id_present` | boolean | `true` |
| `has_file` | boolean | `true` |
| `file_count` | number | `1` |
| `duration_seconds` | number | `94` |
| `steps_completed` | number | `5` |

`duration_seconds` is measured from when the wizard was first opened (not from
session start) to the moment of successful submission.
`steps_completed` is the highest step number reached during the session.

**Fires in:** `QuoteWizard.tsx` → `handleSubmitQuote()`, on successful API response.

```js
gtag("event", "quote_submit_success", {
  request_id_present: true, has_file: true, file_count: 1,
  duration_seconds: 94, steps_completed: 5
});
```

---

### `generate_lead`

**Standard GA4 recommended conversion event.** This is the primary conversion
event for the funnel — mark it as a Key Event in GA4 admin. Fires exactly
once, immediately after `quote_submit_success`, never on error.

| Param | Type | Example |
|---|---|---|
| `currency` | string | `"UAH"` |
| `value` | number | `1` |
| `order_type` | string | `"prototype"`, `"small-batch"`, `"medium-batch"`, `"regular"` |
| `file_type` | string | `"stl"`, `"step"`, `"3mf"`, `"drawing"`, `"photo"`, `"need-modeling"`, `"none"` |
| `quantity_bucket` | string | `"1"`, `"1-10"`, `"10-50"`, `"50-100"`, `"100-500"`, `"500+"`, `"unknown"` |
| `urgency` | string | `"urgent"`, `"3-5-days"`, `"week"`, `"flexible"` |
| `purpose` | string | `"electronics"`, `"robotics"`, `"automotive"`, `"industrial"`, `"household"`, `"other"` |
| `has_comment` | boolean | `true` |
| `has_attachment` | boolean | `true` |

**No personal data is ever included** — no name, email, phone, or the comment
text itself, only the boolean `has_comment`.

**Fires in:** `QuoteWizard.tsx` → `handleSubmitQuote()`, immediately after `trackSubmit(...)`.

```js
gtag("event", "generate_lead", {
  currency: "UAH", value: 1,
  order_type: "prototype", file_type: "stl", quantity_bucket: "100-500",
  urgency: "urgent", purpose: "industrial", has_comment: true, has_attachment: true
});
```

---

### `quote_submit_error`

Fired when the submit API call fails (network error, server error, rate
limit, timeout). Never fires alongside `generate_lead`.

| Param | Type | Example |
|---|---|---|
| `error_type` | string | `"validation"`, `"network"`, `"server"`, `"timeout"`, `"unknown"` |
| `step` | number | `5` |

The error message text itself is never sent — only a coarse category.

**Fires in:** `QuoteWizard.tsx` → `handleSubmitQuote()` catch block.

```js
gtag("event", "quote_submit_error", { error_type: "network", step: 5 });
```

---

### `quote_abandon`

Fired when the user closes the wizard (X button, ESC, click-outside, or
confirmed close dialog) **before** successfully submitting. Guarded to fire
at most once per wizard session via an internal ref.

| Param | Type | Example |
|---|---|---|
| `last_step` | number | `3` |
| `time_spent_seconds` | number | `87` |

**Fires in:** `WizardContext.tsx` → `useEffect` on `isOpen` transitioning to `false` while `submitted === false`.

```js
gtag("event", "quote_abandon", { last_step: 3, time_spent_seconds: 87 });
```

---

### `telegram_success`

Fired when the API response confirms the lead was accepted (Telegram delivery
is required server-side, so a successful response implies delivery succeeded).

No parameters.

**Fires in:** `QuoteWizard.tsx` → `handleSubmitQuote()`, alongside `email_success`.

```js
gtag("event", "telegram_success");
```

---

### `email_success`

Fired alongside `telegram_success` on successful submission. Email delivery
(owner + customer confirmation) is best-effort server-side; this event
indicates the request was accepted, not a per-channel delivery guarantee.

No parameters.

**Fires in:** `QuoteWizard.tsx` → `handleSubmitQuote()`.

```js
gtag("event", "email_success");
```

---

## Privacy Guarantees

The following are **never** sent to GA4, under any event:

- name, email, phone, company
- comment / message text (only `has_comment: boolean`)
- filenames (only file extension category + aggregate size)
- `requestId` (only `request_id_present: boolean`)
- raw error messages (only `error_type` enum)
- IP address (GA4 handles this internally per Google's own privacy controls, not via custom params)

---

## Recommended GA4 Funnel

Build this funnel in GA4 → Explore → Funnel exploration:

| Step | Event | Notes |
|---|---|---|
| 1 | `main_cta_click` | Entry point. Segment by `location` to compare CTA performance. |
| 2 | `quote_modal_open` | Confirms the modal actually rendered. |
| 3 | `quote_started` | First meaningful interaction — filters out people who opened and immediately closed. |
| 4 | `quote_step_completed` (step_number = 4) | Reached contacts — the highest-friction step. |
| 5 | `quote_submit_click` | Intent to submit. |
| 6 | `generate_lead` | **Conversion.** Mark as a GA4 Key Event. |

**Drop-off analysis:** compare `quote_step_view` counts per `step_number` to
find exactly which step loses the most users. Cross-reference with
`quote_abandon` segmented by `last_step` for qualitative drop-off reasons.

**CTA attribution:** segment `generate_lead` by the `location` dimension
captured upstream in `main_cta_click` (requires a session-scoped custom
dimension in GA4, or use BigQuery export for precise multi-touch attribution).

**Lead quality:** segment `generate_lead` by `order_type`, `urgency`, and
`quantity_bucket` to identify your highest-value traffic sources.
