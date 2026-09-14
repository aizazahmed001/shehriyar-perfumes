import React, { useState } from 'react';
import { Search, Package, CreditCard, RefreshCw, Mail, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';

const HelpCenter = () => {
    const [openFaq, setOpenFaq] = useState(null);

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const faqs = [
        {
            question: "How do I track my order?",
            answer: "Once your order is shipped, you will receive a confirmation email with a tracking number. You can also track your order in the 'Orders' section of your profile."
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and UPI payments for your convenience."
        },
        {
            question: "How can I return an item?",
            answer: "You can initiate a return from your 'Orders' page within 30 days of delivery. Please ensure the item is unused and in its original packaging."
        },
        {
            question: "Do you offer international shipping?",
            answer: "Currently, we ship within India. We are working on expanding our shipping to international locations soon."
        }
    ];

    return (
        <div className="min-h-screen bg-white pt-24 pb-20 font-sans">
            {/* Hero Section */}
            <div className="bg-black text-white py-24 mb-20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                <div className="container mx-auto px-6 text-center relative z-10">
                    <p className="text-[10px] uppercase tracking-[0.5em] font-black text-white/40 mb-4">Support Concierge</p>
                    <h1 className="text-5xl font-serif mb-8 italic">How may we <span className="text-white/60">assist you?</span></h1>
                    <div className="max-w-2xl mx-auto relative group">
                        <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white/20 w-4 h-4 group-focus-within:text-white transition-colors" />
                        <input
                            type="text"
                            placeholder="Enter keywords..."
                            className="w-full pl-16 pr-8 py-5 bg-white/5 border border-white/10 text-white font-medium focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all text-sm tracking-widest uppercase placeholder:text-white/10"
                        />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 max-w-6xl">
                {/* Topic Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-24">
                    {[
                        { icon: Package, title: "Orders & Delivery", desc: "Logistics and tracking", delay: "0" },
                        { icon: CreditCard, title: "Payments & Refunds", desc: "Financial resolutions", delay: "100" },
                        { icon: RefreshCw, title: "Returns & Exchanges", desc: "Policy and procedure", delay: "200" }
                    ].map((topic, i) => (
                        <div key={i} className="group p-10 border border-black/5 hover:border-black transition-all duration-700 cursor-pointer text-center flex flex-col items-center">
                            <div className="w-16 h-16 border border-black/5 flex items-center justify-center mb-8 group-hover:bg-black group-hover:text-white transition-all duration-500">
                                <topic.icon className="w-5 h-5 opacity-40 group-hover:opacity-100" />
                            </div>
                            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] mb-4">{topic.title}</h3>
                            <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest">{topic.desc}</p>
                        </div>
                    ))}
                </div>

                {/* FAQs */}
                <div className="max-w-3xl mx-auto mb-24">
                    <div className="text-center mb-16 space-y-2">
                        <p className="text-[10px] uppercase tracking-[0.4em] font-black text-black/40">Knowledge Base</p>
                        <h2 className="text-4xl font-serif">Frequently Asked <span className="italic">Inquiries</span></h2>
                    </div>
                    <div className="space-y-6">
                        {faqs.map((faq, index) => (
                            <div key={index} className="border-b border-black/5 last:border-0">
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className="w-full py-8 flex items-center justify-between text-left group"
                                >
                                    <span className="text-[11px] font-black uppercase tracking-[0.2em] group-hover:pl-4 transition-all duration-500">{faq.question}</span>
                                    {openFaq === index ? (
                                        <ChevronUp className="w-4 h-4 opacity-20" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4 opacity-20" />
                                    )}
                                </button>
                                {openFaq === index && (
                                    <div className="pb-8 text-black/60 text-xs leading-relaxed uppercase tracking-widest font-bold animate-fadeIn">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Support */}
                <div className="bg-black p-16 text-center shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-serif text-white mb-6 italic">Unresolved Concerns?</h2>
                        <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] mb-12">Our concierge team is at your disposal 24/7</p>
                        <div className="flex flex-col sm:flex-row justify-center gap-6">
                            <button className="flex items-center justify-center gap-4 px-10 py-5 bg-transparent border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all">
                                <Mail className="w-4 h-4" />
                                Email Dispatch
                            </button>
                            <button className="flex items-center justify-center gap-4 px-10 py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/90 transition-all">
                                <MessageCircle className="w-4 h-4" />
                                Digital Concierge
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpCenter;
