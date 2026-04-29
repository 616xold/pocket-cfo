import React from "react";
import Link from "next/link";
import type { Route } from "next";
import { DeliveryReadinessCard } from "../../components/delivery-readiness-card";
import { getDeliveryReadiness } from "../../lib/api";

type DeliveryReadinessPageProps = {
  searchParams?: Promise<{ companyKey?: string }>;
};

export default async function DeliveryReadinessPage(
  props: DeliveryReadinessPageProps,
) {
  const searchParams = props.searchParams ? await props.searchParams : {};
  const companyKey = normalizeCompanyKey(searchParams.companyKey);
  const readiness = await getDeliveryReadiness(companyKey);

  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">F6M delivery readiness</p>
        <h1>Delivery readiness for {companyKey}.</h1>
        <p className="lede">
          Internal review-before-delivery posture from deterministic
          operator-readiness and acknowledgement-readiness evidence.
        </p>
        <div className="button-row">
          <Link href={"/" as Route} className="button outline">
            Back to operator home
          </Link>
        </div>
      </section>

      <DeliveryReadinessCard readiness={readiness} />
    </main>
  );
}

function normalizeCompanyKey(companyKey: string | undefined) {
  const normalized = companyKey?.trim();
  return normalized && normalized.length > 0 ? normalized : "acme";
}
