import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Copy,
  ArrowUpRight,
  Clock,
  Sparkles,
  Award
} from 'lucide-react';
import { soundFX } from './SoundFX';

interface ContactSectionProps {
  onShowToast: (msg: string, type?: 'success' | 'info') => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onShowToast }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: 'AI Engineer / Agentic Automation Opportunity',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      onShowToast('Please fill in all required fields.', 'info');
      return;
    }

    soundFX.playClick();
    setIsSubmitting(true);

    setTimeout(() => {
      soundFX.playSuccess();
      setIsSubmitting(false);
      setSubmitted(true);
      onShowToast('Thank you! Your message has been sent directly to Vishnu.', 'success');
      setForm({
        name: '',
        email: '',
        subject: 'AI Engineer / Agentic Automation Opportunity',
        message: ''
      });
    }, 700);
  };

  const copyEmail = () => {
    soundFX.playSuccess();
    navigator.clipboard.writeText('nothingsvishnu@gmail.com');
    onShowToast('Copied nothingsvishnu@gmail.com to clipboard!', 'success');
  };

  const copyPhone = () => {
    soundFX.playSuccess();
    navigator.clipboard.writeText('+916361222162');
    onShowToast('Copied +91-6361222162 to clipboard!', 'success');
  };

  return (
    <section id="contact" className="py-24 sm:py-32 relative overflow-hidden bg-[#f4f4f4]">
      <div className="max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16">
        {/* Giant Mondragon Typography Header */}
        <div className="mb-16 pb-12 border-b border-black/10">
          <div className="inline-flex items-center space-x-2 text-neutral-500 font-mono text-xs font-semibold uppercase tracking-wider mb-4">
            <span>[ 07 / DIRECT COLLABORATION ]</span>
          </div>
          <h2 className="text-6xl sm:text-8xl md:text-9xl font-black text-black tracking-tighter uppercase leading-none">
            Let's Talk.
          </h2>
          <p className="text-neutral-600 text-base sm:text-xl mt-4 max-w-2xl font-normal">
            Available for immediate opportunities in AI Engineering, Agentic AI &amp; Operations Automation, Robotics Hardware, and B2B Manufacturing.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct Info Cards (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-black/10 p-8 shadow-sm space-y-6">
              <div>
                <h3 className="text-xl font-black text-black mb-1">
                  Direct Inquiries &bull; Er. Vishnu R
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Click any channel to copy details directly to your clipboard.
                </p>
              </div>

              <div className="space-y-3">
                {/* Email Channel */}
                <div
                  onClick={copyEmail}
                  className="p-4 rounded-xl border border-black/10 hover:border-black/40 bg-neutral-50/60 hover:bg-neutral-50 flex items-center justify-between cursor-pointer transition-all group"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="p-2.5 rounded-lg bg-black text-white">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-mono text-neutral-500 font-bold">
                        Primary Email
                      </div>
                      <div className="text-sm font-bold text-black font-mono group-hover:underline">
                        nothingsvishnu@gmail.com
                      </div>
                    </div>
                  </div>
                  <Copy className="w-4 h-4 text-neutral-400 group-hover:text-black transition-colors" />
                </div>

                {/* Phone Channel */}
                <div
                  onClick={copyPhone}
                  className="p-4 rounded-xl border border-black/10 hover:border-black/40 bg-neutral-50/60 hover:bg-neutral-50 flex items-center justify-between cursor-pointer transition-all group"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="p-2.5 rounded-lg bg-black text-white">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-mono text-neutral-500 font-bold">
                        Mobile &amp; WhatsApp
                      </div>
                      <div className="text-sm font-bold text-black font-mono group-hover:underline">
                        +91 6361222162
                      </div>
                    </div>
                  </div>
                  <Copy className="w-4 h-4 text-neutral-400 group-hover:text-black transition-colors" />
                </div>

                {/* LinkedIn Channel */}
                <a
                  href="https://linkedin.com/in/vishnu-r-63095b282"
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 rounded-xl border border-black/10 hover:border-black/40 bg-neutral-50/60 hover:bg-neutral-50 flex items-center justify-between cursor-pointer transition-all group"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="p-2.5 rounded-lg bg-black text-white">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-mono text-neutral-500 font-bold">
                        LinkedIn Profile
                      </div>
                      <div className="text-sm font-bold text-black font-mono group-hover:underline">
                        linkedin.com/in/vishnu-r-63095b282
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-black transition-colors" />
                </a>

                {/* Location Channel */}
                <div className="p-4 rounded-xl border border-black/10 bg-neutral-50/60 flex items-center space-x-3.5">
                  <div className="p-2.5 rounded-lg bg-black text-white">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-mono text-neutral-500 font-bold">
                      Location &amp; Mobility
                    </div>
                    <div className="text-xs font-bold text-black">
                      Chintamani, Karnataka 563125 &bull; Active in Bengaluru &amp; Hyderabad (Open to Relocation)
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SLA Response Guarantee Box */}
            <div className="p-5 rounded-2xl bg-white border border-black/10 flex items-start space-x-3.5 shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse mt-1 shrink-0" />
              <div className="text-xs text-neutral-700 leading-relaxed">
                <strong className="text-black font-bold">Immediate Availability: </strong>
                Open for full-time AI Engineer, Agentic Automation, and Robotics roles. Ready for immediate joining and technical interviews.
              </div>
            </div>
          </div>

          {/* Right Column: Sleek Inquiry Form (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-black/10 p-8 sm:p-10 shadow-sm">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-black">
                  Message Dispatched!
                </h3>
                <p className="text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out. Your communication has landed in Vishnu's primary inbox. Expect a prompt response.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2.5 rounded-full bg-black text-white text-xs font-bold hover:bg-neutral-800 transition-all"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-black/5">
                  <h3 className="text-lg font-black text-black">
                    Send Direct Message
                  </h3>
                  <span className="text-xs font-mono text-neutral-400">
                    Direct to nothingsvishnu@gmail.com
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase font-bold text-neutral-600 mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Alex Mercer"
                      className="w-full bg-neutral-50 border border-black/15 rounded-xl px-4 py-3 text-xs text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase font-bold text-neutral-600 mb-1.5">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="e.g. alex@techcompany.com"
                      className="w-full bg-neutral-50 border border-black/15 rounded-xl px-4 py-3 text-xs text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase font-bold text-neutral-600 mb-1.5">
                    Subject / Topic
                  </label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full bg-neutral-50 border border-black/15 rounded-xl px-4 py-3 text-xs text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase font-bold text-neutral-600 mb-1.5">
                    Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell me about your AI initiatives, operations automation requirements, or robotics projects..."
                    className="w-full bg-neutral-50 border border-black/15 rounded-xl px-4 py-3 text-xs text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-full bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Dispatching...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Message to Vishnu</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
