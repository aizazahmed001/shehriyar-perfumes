import React from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Heart, ArrowRight, Linkedin, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-black text-white pt-20 sm:pt-32 pb-12 sm:pb-16 border-t border-white/5">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-16 mb-16 sm:mb-24">
                    {/* Brand Section */}
                    <div className="space-y-8">
                        <Link to="/" className="text-xl sm:text-2xl font-serif font-black tracking-tighter flex items-center">
                            SHERIYAR<span className="font-light ml-1">PERFUME</span>
                        </Link>
                        <p className="text-gray-500 leading-relaxed text-xs uppercase tracking-widest font-bold">
                            Elevating the essence of identity through artisanal fragrances. Experience the peak of olfactory luxury.
                        </p>
                        <div className="flex space-x-6">
                            <a href="https://github.com/" className="text-gray-500 hover:text-white transition-all duration-300">
                                <Github className="w-5 h-5" />
                            </a>
                            <a href="https://www.instagram.com/" className="text-gray-500 hover:text-white transition-all duration-300">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="https://www.linkedin.com/" className="text-gray-500 hover:text-white transition-all duration-300">
                                <Linkedin className="w-5 h-5" />
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
                                <span className="tracking-widest">Dargai, Malakand</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <Phone className="w-4 h-4 opacity-40 shrink-0" />
                                <span className="tracking-widest">+92 3377547848</span>
                                <span className="tracking-widest">+971 568410103</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <Mail className="w-4 h-4 opacity-40 shrink-0" />
                                <span className="tracking-widest">support@sheriyarperfume.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/5 pt-12">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 text-center md:text-left">
                        <p className="text-white/20 text-[10px] uppercase font-black tracking-[0.2em]">
                            © {new Date().getFullYear()} SHERIYAR PERFUME. All rights reserved.
                        </p>
                        <div className="flex items-center gap-8">
                            <span className="text-white/20 text-[10px] uppercase font-black tracking-[0.2em] italic">Crafted for Elegance</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
