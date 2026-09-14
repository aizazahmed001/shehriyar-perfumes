import React from 'react';
import { Shield, Book, Gavel, AlertTriangle } from 'lucide-react';

const TermsConditions = () => {
    return (
        <div className="min-h-screen bg-white pt-32 pb-20 font-sans">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="bg-white border border-black/5 overflow-hidden shadow-2xl">
                    {/* Header */}
                    <div className="bg-black text-white p-12 md:p-20 relative overflow-hidden text-center">
                        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                        <div className="relative z-10">
                            <h1 className="text-4xl md:text-6xl font-serif tracking-tight italic mb-6">Terms <span className="opacity-40">&</span> <span className="text-white/80">Provisions</span></h1>
                            <p className="text-white/40 text-[10px] uppercase tracking-[0.5em] font-black leading-relaxed">
                                Latest Authorization: January 1, 2026 <br />
                                <span className="text-white/20 mt-2 block italic text-[8px]">Please analyze these statutes before engaging with the boutique terminal.</span>
                            </p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-10 md:p-20 space-y-20">
                        <div className="max-w-none text-black/60">
                            <p className="text-sm font-black uppercase tracking-[0.2em] leading-loose mb-12 border-l-2 border-black pl-8 italic">
                                Welcome to the Luxury Perfume Archive. By interfacing with our digital terminal, you acknowledge and agree to be bound by these exhaustive Terms and Conditions and our Privacy Protocol.
                            </p>
                        </div>

                        <section className="group">
                            <div className="flex items-center gap-4 mb-8">
                                <Book className="w-4 h-4 opacity-20 group-hover:opacity-100 transition-opacity" />
                                <h2 className="text-[11px] font-black uppercase tracking-[0.3em]">1. Operational Mandate</h2>
                            </div>
                            <p className="text-black/40 text-[10px] uppercase font-black leading-relaxed tracking-widest mb-6">
                                Engagement with this boutique is restricted to individuals of legal age (18+). You agree to utilize the terminal for authorized purposes only and to refrain from any conduct that compromises the structural integrity of the service.
                            </p>
                        </section>

                        <section className="group">
                            <div className="flex items-center gap-4 mb-8">
                                <Gavel className="w-4 h-4 opacity-20 group-hover:opacity-100 transition-opacity" />
                                <h2 className="text-[11px] font-black uppercase tracking-[0.3em]">2. Fragment Representation</h2>
                            </div>
                            <p className="text-black/40 text-[10px] uppercase font-black leading-relaxed tracking-widest mb-8">
                                We maintain rigorous accuracy regarding fragment compositions and value representation. However, we do not warrant that descriptions are absolute, infallible, or entirely current.
                            </p>
                            <ul className="space-y-4 text-[9px] uppercase font-black tracking-[0.2em] text-black border-l border-black/5 pl-8">
                                <li className="flex items-center gap-4">Values are subject to fluctuation without prior notification.</li>
                                <li className="flex items-center gap-4">The boutique reserves the right to restrict fragment allocation.</li>
                                <li className="flex items-center gap-4">Chromatic representation may vary across terminal outputs.</li>
                            </ul>
                        </section>

                        <section className="group">
                            <div className="flex items-center gap-4 mb-8">
                                <AlertTriangle className="w-4 h-4 opacity-20 group-hover:opacity-100 transition-opacity" />
                                <h2 className="text-[11px] font-black uppercase tracking-[0.3em]">3. Identity Security</h2>
                            </div>
                            <p className="text-black/40 text-[10px] uppercase font-black leading-relaxed tracking-widest mb-6">
                                Terminal users are solely responsible for the encryption and confidentiality of their authentication tokens. Any activity executed under your credentials remains your legal responsibility.
                            </p>
                        </section>

                        <section className="group">
                            <div className="flex items-center gap-4 mb-8">
                                <Shield className="w-4 h-4 opacity-20 group-hover:opacity-100 transition-opacity" />
                                <h2 className="text-[11px] font-black uppercase tracking-[0.3em]">4. Intellectual Sovereignty</h2>
                            </div>
                            <p className="text-black/40 text-[10px] uppercase font-black leading-relaxed tracking-widest mb-6">
                                All assets within this boutique, including visual data, logos, and textual fragments, remain the exclusive property of the Store and are protected under international copyright mandates.
                            </p>
                        </section>

                        <section className="group border-t border-black/5 pt-20">
                            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] mb-8 italic">5. Limit of Liability</h2>
                            <p className="text-black/40 text-[10px] uppercase font-black leading-relaxed tracking-widest mb-6">
                                The Store shall not be held accountable for any direct or indirect consequences resulting from the utilization or failure of terminal services.
                            </p>
                        </section>

                        <div className="bg-black p-12 text-center shadow-xl">
                            <p className="text-white/20 text-[8px] font-black uppercase tracking-[0.4em] mb-4 font-sans">Liaison Contact</p>
                            <p className="text-white text-[10px] uppercase tracking-[0.2em] font-black underline hover:text-white/60 transition-colors">
                                concierge@perfume-store.com
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsConditions;
