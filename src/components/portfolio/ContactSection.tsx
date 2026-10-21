import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Copy,
  ArrowUpRight,
  ExternalLink,
  MessageSquare,
  AlertCircle
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
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      onShowToast('Please fill in all required fields.', 'info');
      return;
    }

    soundFX.playClick();
    setIsSubmitting(true);
    setStatusNotice(null);

    try {
      // 1. Submit to FormSubmit endpoint forwarding directly to nothingsvishnu@gmail.com
      const res = await fetch('https://formsubmit.co/ajax/nothingsvishnu@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          _subject: `[Portfolio Inquiry] ${form.subject || 'Direct Message'} - from ${form.name}`,
          message: form.message.trim(),
          _template: 'table',
          _captcha: 'false'
        })
      });

      const data = await res.json().catch(() => ({}));

      // Also notify local server if available
      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      }).catch(() => {});

      soundFX.playSuccess();
      setIsSubmitting(false);
      setSubmitted(true);

      if (data && typeof data.message === 'string' && data.message.toLowerCase().includes('activation')) {
        setStatusNotice(
          "First-time activation required: A verification email has been sent to nothingsvishnu@gmail.com. Please click 'Activate Form' once in your inbox to enable automatic forwarding!"
        );
        onShowToast('Action Required: Please check nothingsvishnu@gmail.com to activate form!', 'info');
      } else {
        onShowToast('Your message has been sent directly to Vishnu at nothingsvishnu@gmail.com!', 'success');
      }

      setForm({
        name: '',
        email: '',
        subject: 'AI Engineer / Agentic Automation Opportunity',
        message: ''
      });
    } catch (err) {
      setIsSubmitting(false);
      soundFX.playClick();
      // Graceful fallback to native mail client if API request is blocked by browser adblocker
      onShowToast('Network error: Opening your default email client to send directly...', 'info');
      const subject = encodeURIComponent(`[Portfolio Inquiry] ${form.subject || 'Opportunity'}`);
      const body = encodeURIComponent(
        `Hi Vishnu,\n\nName: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}\n`
      );
      window.location.href = `mailto:nothingsvishnu@gmail.com?subject=${subject}&body=${body}`;
    }
  };

  const openNativeMail = () => {
    soundFX.playClick();
    const subject = encodeURIComponent(
      form.subject ? `[Portfolio] ${form.subject}` : 'AI Engineer / Robotics Collaboration with Vishnu'
    );
    const body = encodeURIComponent(
      form.message
        ? `Hi Vishnu,\n\nName: ${form.name || '[Your Name]'}\nEmail: ${form.email || '[Your Email]'}\n\n${form.message}`
        : 'Hi Vishnu,\n\nI came across your portfolio and would like to connect regarding an AI / Robotics opportunity.'
    );
    window.open(`mailto:nothingsvishnu@gmail.com?subject=${subject}&body=${body}`, '_blank');
  };

  const openWhatsApp = () => {
    soundFX.playClick();
    const text = encodeURIComponent(
      `Hi Vishnu, I saw your portfolio and would like to discuss an opportunity in AI Engineering / Robotics.`
    );
    window.open(`https://wa.me/916361222162?text=${text}`, '_blank');
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
                  Click any channel to copy or initiate direct communication.
                </p>
              </div>

              <div className="space-y-3">
                {/* Email Channel */}
                <div
                  onClick={copyEmail}
                  className="p-4 rounded-xl border border-black/10 hover:border-black/40 bg-neutral-50/60 hover:bg-neutral-50 flex items-center justify-between cursor-pointer transition-all group"
                  title="Click to copy email address"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="p-2.5 rounded-lg bg-black text-white">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-mono text-neutral-500 font-bold">
                        Primary Email (Direct to Inbox)
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
                  title="Click to copy phone number"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="p-2.5 rounded-lg bg-black text-white">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-mono text-neutral-500 font-bold">
                        Mobile &amp; WhatsApp Direct
                      </div>
                      <div className="text-sm font-bold text-black font-mono group-hover:underline">
                        +91 6361222162
                      </div>
                    </div>
                  </div>
                  <Copy className="w-4 h-4 text-neutral-400 group-hover:text-black transition-colors" />
                </div>

                {/* WhatsApp Quick Chat */}
                <div
                  onClick={openWhatsApp}
                  className="p-4 rounded-xl border border-emerald-500/30 hover:border-emerald-600 bg-emerald-50/50 hover:bg-emerald-50 flex items-center justify-between cursor-pointer transition-all group"
                  title="Open instant WhatsApp chat"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="p-2.5 rounded-lg bg-emerald-600 text-white">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-mono text-emerald-800 font-bold">
                        Instant Messaging
                      </div>
                      <div className="text-sm font-bold text-emerald-950 font-mono group-hover:underline">
                        Chat on WhatsApp (+91 6361222162)
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-emerald-600" />
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
                Open for full-time AI Engineer, Agentic Automation, and Robotics roles. Ready for immediate joining and technical interviews. Guaranteed response within 12 hours.
              </div>
            </div>
          </div>

          {/* Right Column: Sleek Inquiry Form (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-black/10 p-8 sm:p-10 shadow-sm">
            {submitted ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-black">
                  Message Dispatched!
                </h3>
                <p className="text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out. Your communication has been dispatched directly to Vishnu's inbox at <strong className="text-black font-mono">nothingsvishnu@gmail.com</strong>.
                </p>

                {statusNotice && (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs text-left max-w-md mx-auto space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>Owner Activation Notice</span>
                    </div>
                    <p>{statusNotice}</p>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setStatusNotice(null);
                    }}
                    className="px-5 py-2.5 rounded-full bg-black text-white text-xs font-bold hover:bg-neutral-800 transition-all"
                  >
                    Send Another Message
                  </button>

                  <button
                    onClick={openNativeMail}
                    className="px-5 py-2.5 rounded-full border border-black/20 text-black text-xs font-bold hover:bg-neutral-100 transition-all inline-flex items-center space-x-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Open in Email App</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-black/5">
                  <div>
                    <h3 className="text-lg font-black text-black">
                      Send Direct Message
                    </h3>
                    <p className="text-xs text-neutral-500">
                      Dispatches straight to Vishnu's Gmail inbox
                    </p>
                  </div>
                  <span className="text-[11px] font-mono text-purple-900 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200/80 font-bold">
                    nothingsvishnu@gmail.com
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

                <div className="space-y-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-full bg-purple-950 hover:bg-black text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all disabled:opacity-50 shadow-md shadow-purple-950/20"
                  >
                    {isSubmitting ? (
                      <span>Dispatching to nothingsvishnu@gmail.com...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Message to Vishnu</span>
                      </>
                    )}
                  </button>

                  {/* Direct Native Email Client & WhatsApp buttons */}
                  <div className="flex items-center justify-between gap-3 pt-1">
                    <button
                      type="button"
                      onClick={openNativeMail}
                      className="flex-1 py-2.5 px-3 rounded-xl border border-black/15 hover:border-black/30 bg-neutral-50 hover:bg-neutral-100 text-[11px] font-semibold text-neutral-700 flex items-center justify-center space-x-1.5 transition-all"
                      title="Open in your default mail app with pre-filled content"
                    >
                      <Mail className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Open in Mail App</span>
                    </button>

                    <button
                      type="button"
                      onClick={openWhatsApp}
                      className="flex-1 py-2.5 px-3 rounded-xl border border-emerald-500/30 hover:border-emerald-600 bg-emerald-50/70 hover:bg-emerald-100 text-[11px] font-semibold text-emerald-900 flex items-center justify-center space-x-1.5 transition-all"
                      title="Send message directly via WhatsApp"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp Direct</span>
                    </button>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <span className="text-[10px] font-mono text-neutral-400">
                    Live inbox delivery to nothingsvishnu@gmail.com &bull; SSL encrypted &bull; Zero spam
                  </span>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
