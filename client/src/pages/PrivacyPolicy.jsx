import React from 'react';
import { Lock, Eye, FileText, Globe } from 'lucide-react';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-white pt-32 pb-20 font-sans">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="bg-white border border-black/5 overflow-hidden shadow-2xl">
                    {/* Header */}
                    <div className="bg-black text-white p-12 md:p-20 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-6 mb-8">
                                <div className="w-12 h-12 border border-white/20 flex items-center justify-center">
                                    <Lock className="w-5 h-5 opacity-40" />
                                </div>
                                <h1 className="text-4xl md:text-5xl font-serif tracking-tight italic">Privacy <span className="opacity-40 font-sans not-italic uppercase text-base tracking-[0.4em] ml-4 font-black">Protocols</span></h1>
                            </div>
                            <p className="text-white/40 text-[10px] uppercase tracking-[0.4em] font-black leading-relaxed">
                                Effective Jurisdictional Date: January 1, 2026 <br />
                                <span className="text-white/20 mt-2 block italic">Governing the collection and preservation of personal data within the boutique.</span>
                            </p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-10 md:p-20 space-y-16">
                        <section className="group">
                            <div className="flex items-center gap-4 mb-8">
                                <Eye className="w-4 h-4 opacity-20 group-hover:opacity-100 transition-opacity" />
                                <h2 className="text-[11px] font-black uppercase tracking-[0.3em]">1. Acquisition of Fragment Data</h2>
                            </div>
                            <p className="text-black/60 text-xs leading-relaxed uppercase tracking-widest font-bold mb-6">
                                We curate information provided directly during registration, acquisition, or concierge correspondence. This encompasses:
                            </p>
                            <ul className="space-y-4 text-[10px] uppercase font-black tracking-widest text-black/40">
                                <li className="flex items-center gap-4"><span className="w-1 h-1 bg-black opacity-20"></span>Personal identification (Identity, Digital Address, Telecommunication)</li>
                                <li className="flex items-center gap-4"><span className="w-1 h-1 bg-black opacity-20"></span>Logistical coordinates (Shipping and Billing)</li>
                                <li className="flex items-center gap-4"><span className="w-1 h-1 bg-black opacity-20"></span>Transactional tokens (Processed via secure third-party vaults)</li>
                                <li className="flex items-center gap-4"><span className="w-1 h-1 bg-black opacity-20"></span>Olfactory preferences and historical acquisitions</li>
                            </ul>
                        </section>

                        <section className="group">
                            <div className="flex items-center gap-4 mb-8">
                                <FileText className="w-4 h-4 opacity-20 group-hover:opacity-100 transition-opacity" />
                                <h2 className="text-[11px] font-black uppercase tracking-[0.3em]">2. Internal Data Utilization</h2>
                            </div>
                            <p className="text-black/60 text-xs leading-relaxed uppercase tracking-widest font-bold mb-6">
                                Collected data is utilized to maintain and elevate our bespoke services, including:
                            </p>
                            <ul className="space-y-4 text-[10px] uppercase font-black tracking-widest text-black/40">
                                <li className="flex items-center gap-4"><span className="w-1 h-1 bg-black opacity-20"></span>Logistical fulfillment of boutique orders</li>
                                <li className="flex items-center gap-4"><span className="w-1 h-1 bg-black opacity-20"></span>Manifest updates and tracking intelligence</li>
                                <li className="flex items-center gap-4"><span className="w-1 h-1 bg-black opacity-20"></span>Concierge responses and tailored assistance</li>
                                <li className="flex items-center gap-4"><span className="w-1 h-1 bg-black opacity-20"></span>Security integrity and fraud prevention</li>
                            </ul>
                        </section>

                        <section className="group">
                            <div className="flex items-center gap-4 mb-8">
                                <Globe className="w-4 h-4 opacity-20 group-hover:opacity-100 transition-opacity" />
                                <h2 className="text-[11px] font-black uppercase tracking-[0.3em]">3. External Dissemination</h2>
                            </div>
                            <p className="text-black/60 text-xs leading-relaxed uppercase tracking-widest font-bold mb-6">
                                We maintain strict data isolation. Data is only shared with essential entities:
                            </p>
                            <ul className="space-y-4 text-[10px] uppercase font-black tracking-widest text-black/40">
                                <li className="flex items-center gap-4"><span className="w-1 h-1 bg-black opacity-20"></span>Strategic logistics partners for delivery</li>
                                <li className="flex items-center gap-4"><span className="w-1 h-1 bg-black opacity-20"></span>Secure encryption vaults for transitions</li>
                                <li className="flex items-center gap-4"><span className="w-1 h-1 bg-black opacity-20"></span>Regulatory authorities under legal mandate</li>
                            </ul>
                        </section>

                        <section className="p-10 border border-black/5 bg-black/[0.02]">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] mb-4">Digital Fragprints (Cookies)</h3>
                            <p className="text-[10px] text-black/40 font-bold uppercase leading-relaxed tracking-widest">
                                We utilize persistent cookies to synthesize your experience, analyze traffic, and refine content. Preferences are managed via your terminal bridge settings.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] mb-8">4. Sovereignty Rights</h2>
                            <p className="text-black/60 text-xs leading-relaxed uppercase tracking-widest font-bold mb-6">
                                You maintain absolute sovereignty over your personal data. Access, modification, or eradication requests can be executed via the "Profile" terminal or through concierge liaison.
                            </p>
                        </section>

                        <div className="border-t border-black/5 pt-12 mt-12 text-center">
                            <p className="text-black/40 italic text-[10px] uppercase tracking-widest font-black">
                                Direct inquiries to the encryption liaison: <a href="mailto:concierge@luxuryperfume.com" className="text-black border-b border-black/20 hover:border-black transition-all">concierge@perfume-store.com</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
