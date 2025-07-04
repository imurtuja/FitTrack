import { useState } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const FeedbackModal = ({ open, onClose }) => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      await addDoc(collection(db, 'feedback'), {
        name: form.name,
        email: form.email,
        message: form.message,
        createdAt: serverTimestamp(),
      });
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus('error');
      setError('Something went wrong. Please try again.');
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-fade-in">
      <div className="glass-card bg-[#20232A]/95 border border-[#23272F] rounded-3xl w-full max-w-md mx-auto relative overflow-hidden shadow-2xl animate-fade-in-up p-0">
        <button onClick={onClose} className="absolute top-4 right-4 text-[#B0FFB0] text-3xl font-bold hover:text-[var(--kick-green)] focus:outline-none z-10 transition-colors bg-[#23272F]/80 rounded-full w-10 h-10 flex items-center justify-center shadow-md border border-[#23272F]">&times;</button>
        <div className="p-8 flex flex-col gap-6">
          <h3 className="text-2xl font-extrabold bg-gradient-to-r from-[var(--kick-green)] via-[#B0FFB0] to-[var(--kick-green)] bg-clip-text text-transparent mb-2 text-center">Feedback & Contact</h3>
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#B0FFB0]/30 to-transparent mb-4" />
          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              <span className="text-5xl text-[var(--kick-green)]">✔️</span>
              <div className="text-center text-[var(--kick-green)] font-bold text-lg">Thank you for your feedback!</div>
              <button onClick={onClose} className="mt-2 px-6 py-2 rounded-lg bg-[var(--kick-green)] text-[#181A20] font-bold shadow hover:bg-[#53FC18] transition">Close</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                className="bg-[#23272F] text-[#F3F3F3] rounded-lg p-3 border border-[#23272F] focus:outline-none focus:ring-2 focus:ring-[var(--kick-green)] placeholder-[#B0FFB0]"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={form.email}
                onChange={handleChange}
                className="bg-[#23272F] text-[#F3F3F3] rounded-lg p-3 border border-[#23272F] focus:outline-none focus:ring-2 focus:ring-[var(--kick-green)] placeholder-[#B0FFB0]"
                required
              />
              <textarea
                name="message"
                placeholder="Your Message"
                value={form.message}
                onChange={handleChange}
                className="bg-[#23272F] text-[#F3F3F3] rounded-lg p-3 border border-[#23272F] focus:outline-none focus:ring-2 focus:ring-[var(--kick-green)] placeholder-[#B0FFB0] min-h-[100px]"
                required
              />
              {status === 'error' && <div className="text-red-500 text-sm text-center">{error}</div>}
              <button
                type="submit"
                disabled={status === 'sending'}
                className="bg-gradient-to-r from-[var(--kick-green)] to-[#53FC18] text-[#181A20] font-extrabold rounded-full px-8 py-3 text-lg shadow-xl hover:scale-105 active:scale-95 transition-transform focus:outline-none focus:ring-4 focus:ring-[var(--kick-green)]/40"
              >
                {status === 'sending' ? 'Sending...' : 'Send Feedback'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal; 