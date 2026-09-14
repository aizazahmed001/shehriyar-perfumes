import React from 'react';
import { Truck, RefreshCw, Clock, ShieldCheck, AlertCircle } from 'lucide-react';

const ShippingReturns = () => {
    return (
        <div className="min-h-screen bg-white pt-32 pb-20 font-sans">
            {/* Header */}
            <div className="bg-black text-white py-24 mb-20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                <div className="container mx-auto px-6 text-center relative z-10">
                    <p className="text-[10px] uppercase tracking-[0.5em] font-black text-white/40 mb-4">Logistics & Reversals</p>
                    <h1 className="text-5xl font-serif italic mb-4">Shipping <span className="text-white/40">&</span> <span className="text-white/80">Returns</span></h1>
                    <p className="text-white/20 text-[10px] uppercase tracking-[0.3em] font-black">Comprehensive guide to delivery and retrieval protocols.</p>
                </div>
            </div>

            <div className="container mx-auto px-6 max-w-5xl">

                {/* Shipping Section */}
                <section className="bg-white border border-black/5 shadow-2xl p-12 md:p-20 mb-20">
                    <div className="flex items-center gap-6 mb-12">
                        <div className="w-12 h-12 border border-black/5 flex items-center justify-center">
                            <Truck className="w-5 h-5 opacity-40" />
                        </div>
                        <h2 className="text-[12px] font-black uppercase tracking-[0.4em]">I. Delivery Mandate</h2>
                    </div>

                    <div className="space-y-12">
                        <div className="border-l-2 border-black pl-8 py-2">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 font-serif italic">Complimentary Dispatch</h3>
                            <p className="text-black/40 text-[10px] uppercase tracking-widest font-black">Standard logistics are complimentary for acquisitions exceeding ₹999.</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-12">
                            <div className="group">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 flex items-center gap-4">
                                    <Clock className="w-4 h-4 opacity-10 group-hover:opacity-100 transition-opacity" />
                                    Boutique Dispatch
                                </h3>
                                <p className="text-black/40 text-[10px] uppercase font-black leading-relaxed tracking-widest">
                                    Fulfillment within 5-7 solar days for major metropolises. Peripheral sectors may require up to 10 days.
                                </p>
                            </div>
                            <div className="group">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 flex items-center gap-4">
                                    <ShieldCheck className="w-4 h-4 opacity-10 group-hover:opacity-100 transition-opacity" />
                                    Express Conduit
                                </h3>
                                <p className="text-black/40 text-[10px] uppercase font-black leading-relaxed tracking-widest">
                                    Accelerated fulfillment for select terminal coordinates. Delivery within 2-3 solar days.
                                </p>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-black/5">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 font-serif italic">Manifest Intelligence</h3>
                            <p className="text-black/40 text-[10px] uppercase font-black leading-relaxed tracking-widest mb-6">
                                Upon dispatch, a real-time tracking key will be transmitted to your digital liaison.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-4 text-[9px] uppercase font-black tracking-widest text-black/20 italic"><span className="w-1 h-1 bg-black opacity-20"></span>Manifests are processed within 24 hours of confirmation.</li>
                                <li className="flex items-center gap-4 text-[9px] uppercase font-black tracking-widest text-black/20 italic"><span className="w-1 h-1 bg-black opacity-20"></span>No logistics are conducted during sabbatical solar days.</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Returns Section */}
                <section className="bg-white border border-black/5 shadow-2xl p-12 md:p-20">
                    <div className="flex items-center gap-6 mb-12">
                        <div className="w-12 h-12 border border-black/5 flex items-center justify-center">
                            <RefreshCw className="w-5 h-5 opacity-40" />
                        </div>
                        <h2 className="text-[12px] font-black uppercase tracking-[0.4em]">II. Retrieval Protocol</h2>
                    </div>

                    <div className="space-y-12">
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] leading-loose italic max-w-2xl">
                            We curate quality. If a fragment fails to meet expectations, our retrieval concierge is at your disposal.
                        </p>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="p-8 border border-black/5 text-center group hover:border-black transition-all duration-700">
                                <h3 className="text-3xl font-serif mb-2 group-hover:italic transition-all">30</h3>
                                <p className="text-[8px] text-black/40 uppercase font-black tracking-[0.4em]">Solar Days</p>
                            </div>
                            <div className="p-8 border border-black/5 text-center group hover:border-black transition-all duration-700">
                                <h3 className="text-3xl font-serif mb-2 group-hover:italic transition-all">Free</h3>
                                <p className="text-[8px] text-black/40 uppercase font-black tracking-[0.4em]">Return Logistics</p>
                            </div>
                            <div className="p-8 border border-black/5 text-center group hover:border-black transition-all duration-700">
                                <h3 className="text-3xl font-serif mb-2 group-hover:italic transition-all">100%</h3>
                                <p className="text-[8px] text-black/40 uppercase font-black tracking-[0.4em]">Reimbursement</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6">Validation Criteria</h3>
                            <ul className="space-y-6">
                                <li className="flex items-center gap-6 text-[10px] uppercase font-black tracking-widest text-black/40">
                                    <span className="w-1 h-1 bg-black shrink-0" />
                                    Fragment must remain pristine and unevoked
                                </li>
                                <li className="flex items-center gap-6 text-[10px] uppercase font-black tracking-widest text-black/40">
                                    <span className="w-1 h-1 bg-black shrink-0" />
                                    Original sigils and sarcophagus must be intact
                                </li>
                                <li className="flex items-center gap-6 text-[10px] uppercase font-black tracking-widest text-black/40">
                                    <span className="w-1 h-1 bg-black shrink-0" />
                                    Manifest or proof of acquisition is mandatory
                                </li>
                            </ul>
                        </div>

                        <div className="flex items-start gap-3 bg-black/[0.02] p-8 border border-black/5">
                            <AlertCircle className="w-4 h-4 opacity-20 shrink-0 mt-1" />
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 font-serif italic">Non-Returnable Exceptions</h4>
                                <p className="text-black/40 text-[9px] uppercase tracking-widest font-black leading-loose">
                                    Personal elixirs, digital fragments, and archive acquisitions (Final Sale) are excluded from retrieval unless integrity is compromised.
                                </p>
                            </div>
                        </div>

                        <div className="pt-12 border-t border-black/5">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6">Execution Steps</h3>
                            <ol className="space-y-6 list-none">
                                <li className="flex gap-6 items-center">
                                    <span className="text-xl font-serif italic opacity-10">01</span>
                                    <span className="text-[10px] uppercase font-black tracking-widest text-black/60">Access 'Individual Manifests' and select the target fragment.</span>
                                </li>
                                <li className="flex gap-6 items-center">
                                    <span className="text-xl font-serif italic opacity-10">02</span>
                                    <span className="text-[10px] uppercase font-black tracking-widest text-black/60">Identify rationale and designate reimbursement conduit.</span>
                                </li>
                                <li className="flex gap-6 items-center">
                                    <span className="text-xl font-serif italic opacity-10">03</span>
                                    <span className="text-[10px] uppercase font-black tracking-widest text-black/60">Synchronize extraction time with our logistics conduit.</span>
                                </li>
                            </ol>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default ShippingReturns;
