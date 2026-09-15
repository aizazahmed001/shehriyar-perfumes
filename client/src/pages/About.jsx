import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { ArrowRight, Clock3, Gem, MapPin, MessageCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import './About.css';

const shopPosition = [34.5114, 71.9047];

const About = () => {
    return (
        <main className="about-page min-h-screen bg-white pt-24 font-sans">
            <section className="about-hero relative overflow-hidden bg-black text-white">
                <div className="about-hero-pattern absolute inset-0" aria-hidden="true"></div>
                <div className="container relative z-10 mx-auto px-4 py-24 sm:px-6 sm:py-32 lg:py-40">
                    <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
                        <div className="max-w-4xl">
                            <p className="mb-6 text-[10px] font-black uppercase tracking-[0.5em] text-white/45">The House of Sheriyar</p>
                            <h1 className="max-w-3xl font-serif text-5xl leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
                                Fragrance with a <span className="italic text-white/55">point of view.</span>
                            </h1>
                            <p className="mt-10 max-w-xl text-sm font-medium leading-loose text-white/60 sm:text-base">
                                Sheriyar Perfume brings expressive, lasting fragrances to collectors who believe a scent should feel as personal as a signature.
                            </p>
                            <Link to="/shop" className="mt-10 inline-flex items-center gap-4 border border-white bg-white px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-black transition-colors hover:bg-transparent hover:text-white">
                                Explore the collection <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                        <div className="about-hero-image relative aspect-[4/5] w-full max-w-md justify-self-center overflow-hidden border border-white/15 lg:justify-self-end">
                            <img
                                src="/perfumes/luxury_oud_wood.jpg"
                                alt="Luxury Oud Wood fragrance from the Sheriyar collection"
                                className="h-full w-full object-cover grayscale-[0.2] transition-transform duration-1000 hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent"></div>
                            <p className="absolute bottom-5 left-5 text-[9px] font-black uppercase tracking-[0.35em] text-white/75">Signature Oud / 01</p>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-8 right-6 hidden text-right text-[9px] font-black uppercase tracking-[0.35em] text-white/30 sm:block lg:right-12">
                    <span className="block">Dargai</span>
                    <span className="block">Malakand / Pakistan</span>
                </div>
            </section>

            <section className="container mx-auto px-4 py-20 sm:px-6 sm:py-28 lg:py-36">
                <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-24">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.45em] text-black/35">Our philosophy</p>
                        <h2 className="mt-5 max-w-md font-serif text-4xl leading-tight sm:text-5xl">A considered ritual, from first note to final trail.</h2>
                    </div>
                    <div className="max-w-2xl space-y-6 text-sm font-medium leading-loose text-black/60 sm:text-base">
                        <p>
                            We curate modern perfumery with an appreciation for balance: luminous openings, memorable hearts, and deep dry-downs that stay with you long after the room has changed.
                        </p>
                        <p>
                            Every fragrance in our archive is selected to make discovery feel intimate and uncomplicated. Whether you are choosing a daily signature or a gift with presence, our collection is designed to meet the moment.
                        </p>
                    </div>
                </div>
            </section>

            <section className="border-y border-black/5 bg-[#f7f7f5]">
                <div className="container mx-auto grid gap-px px-4 sm:px-6 md:grid-cols-3">
                    {[
                        { icon: Sparkles, title: 'Curated notes', text: 'Distinctive blends selected for character, balance, and wearability.' },
                        { icon: ShieldCheck, title: 'Authentic selection', text: 'A considered archive made for confident, informed discovery.' },
                        { icon: Gem, title: 'Gift-worthy finish', text: 'Elegant presentation for celebrations, milestones, and everyday gestures.' }
                    ].map((feature) => {
                        const FeatureIcon = feature.icon;
                        return (
                            <div key={feature.title} className="bg-[#f7f7f5] px-2 py-12 sm:px-8 lg:px-12 lg:py-16">
                                <FeatureIcon className="h-5 w-5 text-black/45" />
                                <h3 className="mt-8 text-[11px] font-black uppercase tracking-[0.3em]">{feature.title}</h3>
                                <p className="mt-4 max-w-xs text-xs font-medium leading-loose text-black/50">{feature.text}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            <section className="container mx-auto px-4 py-20 sm:px-6 sm:py-28 lg:py-36">
                <div className="mb-12 max-w-xl">
                    <p className="text-[10px] font-black uppercase tracking-[0.45em] text-black/35">Visit the house</p>
                    <h2 className="mt-5 font-serif text-4xl sm:text-5xl">Find us in <span className="italic">Dargai.</span></h2>
                    <p className="mt-6 text-sm leading-loose text-black/55">Our home base is in Taj Mall Dargai, Malakand. Connect with the team before visiting for collection guidance and availability.</p>
                </div>

                <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
                    <div className="about-map-wrap overflow-hidden border border-black/10">
                        <MapContainer center={shopPosition} zoom={14} scrollWheelZoom={false} className="about-map">
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <CircleMarker center={shopPosition} radius={12} pathOptions={{ color: '#000', fillColor: '#000', fillOpacity: 1 }}>
                                <Popup>
                                    <strong>Sheriyar Perfume</strong><br />Taj Mall Dargai, Malakand
                                </Popup>
                            </CircleMarker>
                        </MapContainer>
                    </div>

                    <div className="flex flex-col justify-between border border-black/10 p-7 sm:p-10">
                        <div className="space-y-9">
                            <div className="flex items-start gap-4">
                                <MapPin className="mt-1 h-5 w-5 shrink-0 text-black/35" />
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.25em]">Dargai studio</p>
                                    <p className="mt-2 text-sm leading-relaxed text-black/55">Taj Mall Dargai, Malakand, Pakistan</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Clock3 className="mt-1 h-5 w-5 shrink-0 text-black/35" />
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.25em]">Customer concierge</p>
                                    <p className="mt-2 text-sm leading-relaxed text-black/55">Daily, 10:00 AM to 8:00 PM</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <MessageCircle className="mt-1 h-5 w-5 shrink-0 text-black/35" />
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.25em]">Direct line</p>
                                    <a href="https://wa.me/971568410103" target="_blank" rel="noreferrer" className="mt-2 block text-sm text-black/55 underline decoration-black/15 underline-offset-4 hover:text-black">WhatsApp concierge</a>
                                </div>
                            </div>
                        </div>
                        <a href="https://www.google.com/maps/search/?api=1&query=34.5114,71.9047" target="_blank" rel="noreferrer" className="mt-12 inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.25em] hover:gap-5 transition-all">
                            Open in Google Maps <ArrowRight className="h-4 w-4" />
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default About;
