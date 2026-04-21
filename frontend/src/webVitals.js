/**
 * Core Web Vitals tracker
 * =======================
 * Captures LCP, CLS, INP, FCP, TTFB for every real user and pushes to:
 *   1. Google Analytics 4 (window.gtag) if present
 *   2. POST /api/metrics/vitals  (best-effort, beacon)
 *
 * Sampling: 100% in production, disabled in dev to keep the console quiet.
 */

import { onCLS, onLCP, onINP, onFCP, onTTFB } from "web-vitals";

const API = process.env.REACT_APP_BACKEND_URL;
const ENABLED =
  process.env.NODE_ENV === "production" ||
  process.env.REACT_APP_TRACK_VITALS === "1";

function sendToGA4(metric) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", metric.name, {
    event_category: "Web Vitals",
    value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
    metric_id: metric.id,
    metric_value: metric.value,
    metric_delta: metric.delta,
    metric_rating: metric.rating,
    non_interaction: true,
  });
}

function sendToBackend(metric) {
  if (!API) return;
  const payload = JSON.stringify({
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    id: metric.id,
    path: window.location.pathname,
    navigation_type: metric.navigationType,
  });
  try {
    // Prefer sendBeacon so the request survives page unloads
    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon(`${API}/api/metrics/vitals`, blob);
    } else {
      fetch(`${API}/api/metrics/vitals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    /* silent */
  }
}

function report(metric) {
  sendToGA4(metric);
  sendToBackend(metric);
}

export function initWebVitals() {
  if (!ENABLED) return;
  try {
    onCLS(report);
    onLCP(report);
    onINP(report);
    onFCP(report);
    onTTFB(report);
  } catch (err) {
    // web-vitals can throw on very old browsers — never crash the app
    // eslint-disable-next-line no-console
    console.warn("[web-vitals] init failed", err);
  }
}
