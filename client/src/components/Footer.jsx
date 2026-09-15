import React from 'react';
import { Instagram, Mail, Phone, MapPin} from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-black text-white pt-20 sm:pt-32 pb-12 sm:pb-16 border-t border-white/5">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-16 mb-16 sm:mb-24">
                    {/* Brand Section */}
                    <div className="space-y-8">
                        <Link to="/" className="text-xl sm:text-2xl font-serif font-black tracking-tighter flex items-center">
                            SHERYAR<span className="font-light ml-1">PERFUME</span>
                        </Link>
                        <p className="text-gray-500 leading-relaxed text-xs uppercase tracking-widest font-bold">
                            Elevating the essence of identity through artisanal fragrances. Experience the peak of olfactory luxury.
                        </p>
                        <div className="flex items-center space-x-6">
                            <a href="https://www.instagram.com/shehryar_perfume?stkn=MTZlMmV3dzc0NTgxag==" className="text-gray-500 hover:text-white transition-all duration-300">
                                <Instagram className="w-5 h-5" aria-label="Instagram" />
                            </a>
                            <a href="https://www.tiktok.com/@shehryarperfum?_r=1&_t=ZS-99k8aEjeV7N" className="text-gray-500 hover:text-white transition-all duration-300" aria-label="TikTok">
                                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
                                    <path d="M15.5 3c.4 2.2 1.7 3.7 3.8 4.1v3.1c-1.5-.1-2.8-.6-3.8-1.4v6.4c0 4.1-2.8 6.8-6.6 6.8-3.5 0-5.9-2.4-5.9-5.6 0-3.5 2.8-5.9 6.7-5.9.3 0 .6 0 .9.1v3.2c-.3-.1-.6-.1-.9-.1-1.7 0-2.9 1-2.9 2.6 0 1.3.9 2.5 2.3 2.5 1.6 0 2.7-1.2 2.7-3.7V3h3.7Z" />
                                </svg>
                            </a>
                           
                        </div>
                    </div>

                    {/* Quick Access */}
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-white/40">Collections</h4>
                        <ul className="space-y-4 text-xs font-bold uppercase tracking-wider">
                            <li>
                                <Link to="/" className="text-white/60 hover:text-white transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/shop" className="text-white/60 hover:text-white transition-colors">
                                    Shop Now
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-white/60 hover:text-white transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/cart" className="text-white/60 hover:text-white transition-colors">
                                    My Cart
                                </Link>
                            </li>
                            <li>
                                <Link to="/orders" className="text-white/60 hover:text-white transition-colors">
                                    Order History
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-white/40">Customer Service</h4>
                        <ul className="space-y-4 text-xs font-bold uppercase tracking-wider">
                            <li><Link to="/help-center" className="text-white/60 hover:text-white transition-colors">Help Center</Link></li>
                            <li><Link to="/shipping-returns" className="text-white/60 hover:text-white transition-colors">Shipping & Returns</Link></li>
                            <li><Link to="/privacy-policy" className="text-white/60 hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/terms-conditions" className="text-white/60 hover:text-white transition-colors">Terms & Conditions</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-white/40">Contact</h4>
                        <ul className="space-y-6 text-xs font-bold uppercase tracking-wider text-white/60">
                            <li className="flex items-start gap-4">
                                <MapPin className="w-4 h-4 opacity-40 shrink-0" />
                                <span className="tracking-widest">Taj Mall Dargai, Malakand</span>
                                 <p>/</p>
                                 <span className="tracking-widest">AL AIN SANIYA DUBAI</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <Phone className="w-4 h-4 opacity-40 shrink-0" />
                                <span className="tracking-widest">+92 3377547848 </span>
                                <p>/</p>
                                <span className="tracking-widest">+971 568410103</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <Mail className="w-4 h-4 opacity-40 shrink-0" />
                                <span className="tracking-widest">support@sheryarperfume.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/5 pt-12">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 text-center md:text-left">
                        <p className="text-white/20 text-[10px] uppercase font-black tracking-[0.2em]">
                            © {new Date().getFullYear()} SHERYAR PERFUME. All rights reserved.
                        </p>
                        <div className="flex items-center gap-8">
                            <span className="text-white/20 text-[10px] uppercase font-black tracking-[0.2em] italic">Crafted for Elegance</span>
                        </div>
                    </div>
                </div>
            </div>

            <a
                href="https://wa.me/971568410103"
                target="_blank"
                rel="noreferrer"
                aria-label="Chat with us on WhatsApp"
                title="Chat with us on WhatsApp"
                className="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-transform duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
            >
                <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current" aria-hidden="true">
                    <path d="M12 2.2a9.7 9.7 0 0 0-8.4 14.6L2.1 21.8l5.2-1.4A9.8 9.8 0 1 0 12 2.2Zm0 17.8a8 8 0 0 1-4.1-1.1l-.3-.2-3.1.8.8-3-.2-.3A8 8 0 1 1 12 20Zm4.4-5.9c-.2-.1-1.3-.7-1.5-.8-.2-.1-.4-.1-.6.1l-.7.9c-.1.1-.3.2-.5.1a6.5 6.5 0 0 1-1.9-1.2 7.3 7.3 0 0 1-1.3-1.6c-.1-.2 0-.3.1-.5l.4-.5.2-.4c.1-.1 0-.3 0-.4l-.7-1.7c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3.9 2.4c.1.2 1.6 2.5 3.9 3.5 2.3 1 2.3.7 2.7.7.4 0 1.3-.5 1.5-1 .2-.5.2-.9.1-1Z" />
                </svg>
            </a>
        </footer>
    );
};

export default Footer;
