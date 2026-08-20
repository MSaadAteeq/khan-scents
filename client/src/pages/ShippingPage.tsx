export function ShippingPage() {
  return (
    <div className="pt-24 pb-20 bg-bg min-h-screen">
      <div className="container-page max-w-2xl">
        <span className="section-label">Policies</span>
        <h1 className="section-title">Shipping & returns</h1>

        <div className="space-y-10 -mt-8 text-sm text-text-muted leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-text mb-3">Exchange policy</h2>
            <p className="mb-3">We accept exchanges only when:</p>
            <ul className="list-disc pl-5 space-y-1 mb-3">
              <li>The wrong product was delivered</li>
              <li>The product arrived damaged</li>
              <li>The product is defective or has a significant packaging issue</li>
            </ul>
            <p>Contact us within 48 hours. Product must be unused and in original packaging unless damaged.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text mb-3">Change of mind</h2>
            <p>Opened or used perfumes cannot be returned — fragrance preferences are subjective and perfumes are hygiene-sensitive products.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text mb-3">Damaged parcels</h2>
            <p>Inspect your parcel on delivery. Contact us within 48 hours with order number and photos/videos of the damage. We recommend recording an unboxing video.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text mb-3">Cancellation</h2>
            <p>Orders can be cancelled before dispatch via WhatsApp. Once dispatched, cancellation may not be possible. Repeated COD refusals may restrict future COD orders.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text mb-3">Refunds</h2>
            <p>Approved refunds are processed per payment method. COD refunds may require valid bank/e-wallet details. Delivery charges are generally non-refundable unless caused by our error.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
