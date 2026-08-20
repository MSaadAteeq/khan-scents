export function ShippingPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="container-page max-w-3xl prose-policy">
        <p className="text-xs uppercase tracking-widest-plus text-gold mb-3">Policies</p>
        <h1 className="font-display text-5xl md:text-6xl text-ivory mb-10">
          Shipping & Returns
        </h1>

        <section className="mb-12">
          <h2 className="font-display text-3xl text-ivory mb-4">Return & Exchange Policy</h2>
          <h3 className="font-display text-xl text-gold mb-3">Exchange Policy</h3>
          <p className="text-ivory-dim leading-relaxed mb-4">
            We accept exchanges only in the following situations:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-ivory-dim mb-4">
            <li>The wrong product was delivered.</li>
            <li>The product arrived damaged.</li>
            <li>The product received is defective or has a significant packaging issue.</li>
          </ul>
          <p className="text-ivory-dim leading-relaxed mb-4">
            To request an exchange, customers must contact us within 48 hours of receiving the
            order. The product must be unused, unopened, and in its original packaging, except where
            the issue is related to damage or a defect.
          </p>
        </section>

        <section className="mb-12">
          <h3 className="font-display text-xl text-gold mb-3">Change of Mind</h3>
          <p className="text-ivory-dim leading-relaxed">
            We do not accept returns or exchanges simply because a customer does not like the
            fragrance after opening or using the product. Because fragrance preferences are
            subjective and perfumes are hygiene-sensitive products, opened or used perfumes cannot
            be returned.
          </p>
        </section>

        <section className="mb-12">
          <h3 className="font-display text-xl text-gold mb-3">Damaged Parcel Policy</h3>
          <p className="text-ivory-dim leading-relaxed mb-4">
            Please inspect your parcel when you receive it. If your package arrives damaged,
            leaking, broken, or tampered with, please contact Khan Scents within 48 hours of
            delivery. Customers should provide:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-ivory-dim mb-4">
            <li>Order number</li>
            <li>Photos of the package</li>
            <li>Photos/videos showing the damage</li>
            <li>Photos of the perfume bottle and packaging</li>
          </ul>
          <p className="text-ivory-dim leading-relaxed mb-4">
            After reviewing the issue, Khan Scents may offer a replacement or another appropriate
            resolution. We strongly recommend customers record an unboxing video when opening their
            parcel, especially for damage-related claims.
          </p>
        </section>

        <section className="mb-12">
          <h3 className="font-display text-xl text-gold mb-3">Cancellation Policy</h3>
          <p className="text-ivory-dim leading-relaxed">
            Orders can be cancelled before dispatch by contacting Khan Scents through WhatsApp or
            our provided contact details. Once an order has been dispatched, cancellation may no
            longer be possible. For COD orders, repeated refusal of parcels may result in
            restrictions on future COD orders.
          </p>
        </section>

        <section>
          <h3 className="font-display text-xl text-gold mb-3">Refund Policy</h3>
          <p className="text-ivory-dim leading-relaxed">
            For approved returns or issues where a replacement cannot be provided, refunds will be
            processed according to the payment method used and the circumstances of the order. For
            COD orders, customers may need to provide valid bank/e-wallet details for an approved
            refund. Delivery charges are generally non-refundable, except where the issue was caused
            by an error on the part of Khan Scents.
          </p>
        </section>
      </div>
    </div>
  );
}
