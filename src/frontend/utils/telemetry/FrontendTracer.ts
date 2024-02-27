// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import { HoneycombWebSDK } from '@honeycombio/opentelemetry-web';

const {
  NEXT_PUBLIC_OTEL_SERVICE_NAME = '',
  NEXT_PUBLIC_OTEL_EXPORTER_OTLP_TRACES_ENDPOINT = '',
  IS_SYNTHETIC_REQUEST = '',
} = typeof window !== 'undefined' ? window.ENV : {};

const FrontendTracer = async (collectorString: string) => {
  const sdk = new HoneycombWebSDK({
    serviceName: NEXT_PUBLIC_OTEL_SERVICE_NAME,
    endpoint: NEXT_PUBLIC_OTEL_EXPORTER_OTLP_TRACES_ENDPOINT || collectorString || 'http://localhost:4318/v1/traces',
    instrumentations: [
      getWebAutoInstrumentations({
        '@opentelemetry/instrumentation-fetch': {
          propagateTraceHeaderCorsUrls: /.*/,
          clearTimingResources: true,
          applyCustomAttributesOnSpan(span) {
            span.setAttribute('app.synthetic_request', IS_SYNTHETIC_REQUEST);
          },
        },
      }),
    ],
  });
  sdk.start();
};

export default FrontendTracer;
