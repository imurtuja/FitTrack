import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../App';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { FaPlus, FaTrash, FaEdit, FaCalendar, FaFileExport, FaFileImport, FaDownload, FaFilePdf, FaFileCsv, FaFileCode, FaBars, FaDumbbell, FaSave, FaTimes } from 'react-icons/fa';
import Skeleton from '../components/layout/Skeleton';
import { Helmet } from 'react-helmet-async';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const daysOfWeek = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

// Custom confirmation modal (local, styled like FeedbackModal)
function ConfirmModal({ open, title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel' }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-fade-in">
      <div className="glass-card bg-[#20232A]/95 border border-[#23272F] rounded-3xl w-full max-w-md mx-auto relative overflow-hidden shadow-2xl animate-fade-in-up p-0">
        <div className="p-8 flex flex-col gap-6">
          <h3 className="text-2xl font-extrabold bg-gradient-to-r from-[var(--kick-green)] via-[#B0FFB0] to-[var(--kick-green)] bg-clip-text text-transparent mb-2 text-center">{title}</h3>
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#B0FFB0]/30 to-transparent mb-4" />
          <div className="text-center text-[#B0FFB0] mb-4">{message}</div>
          <div className="flex gap-4 justify-center">
            <button onClick={onCancel} className="px-6 py-2 rounded-lg bg-[#23272F] text-[#B0FFB0] font-bold shadow hover:bg-[#23272F]/80 transition">{cancelText}</button>
            <button onClick={onConfirm} className="px-6 py-2 rounded-lg bg-[var(--kick-green)] text-[#181A20] font-bold shadow hover:bg-[#53FC18] transition">{confirmText}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// CSV export helper
function routineToCSV(routine) {
  let csv = 'Day,Exercise,Sets,Reps,Note\n';
  for (const day of daysOfWeek) {
    const note = (routine[day]?.note || '').replace(/\n/g, ' ');
    if (routine[day]?.exercises?.length) {
      for (const ex of routine[day].exercises) {
        csv += `${day},${ex.name},${ex.sets},${ex.reps},${note}\n`;
      }
    } else {
      csv += `${day},,,,${note}\n`;
    }
  }
  return csv;
}

// PDF export helper
function routineToPDF(routine) {
  const doc = new jsPDF();
  // Header with logo and app name
  const logoSvg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 512' width='32' height='32' fill='#53FC18'><path d='M104 96c13.3 0 24 10.7 24 24V392c0 13.3-10.7 24-24 24s-24-10.7-24-24V120c0-13.3 10.7-24 24-24zm432 0c13.3 0 24 10.7 24 24V392c0 13.3-10.7 24-24 24s-24-10.7-24-24V120c0-13.3 10.7-24 24-24zM176 80c17.7 0 32 14.3 32 32V400c0 17.7-14.3 32-32 32s-32-14.3-32-32V112c0-17.7 14.3-32 32-32zm288 0c17.7 0 32 14.3 32 32V400c0 17.7-14.3 32-32 32s-32-14.3-32-32V112c0-17.7 14.3-32 32-32zM240 224h160v64H240V224z'/></svg>`;
  // Add logo (as SVG string, converted to PNG base64)
  // For simplicity, skip logo if conversion is not trivial in browser
  doc.setFontSize(22);
  doc.setTextColor('#53FC18');
  doc.text('Fitmint', 18, 18);
  doc.setFontSize(14);
  doc.setTextColor('#23272F');
  doc.text('Workout Routine', 18, 28);
  let y = 38;
  daysOfWeek.forEach((day, idx) => {
    doc.setFontSize(16);
    doc.setTextColor('#53FC18');
    doc.text(day, 18, y);
    y += 6;
    // Table for exercises
    const exercises = routine[day]?.exercises || [];
    if (exercises.length) {
      autoTable(doc, {
        startY: y,
        head: [['Exercise', 'Sets', 'Reps']],
        body: exercises.map(ex => [ex.name, ex.sets, ex.reps]),
        theme: 'grid',
        headStyles: { fillColor: [83, 252, 24], textColor: '#181A20', fontStyle: 'bold' },
        bodyStyles: { fillColor: [240, 255, 240], textColor: '#23272F' },
        styles: { fontSize: 11, cellPadding: 2 },
        margin: { left: 18, right: 18 },
      });
      y = doc.lastAutoTable.finalY + 4;
    } else {
      doc.setFontSize(12);
      doc.setTextColor('#23272F');
      doc.text('- No exercises', 22, y);
      y += 7;
    }
    // Notes styled
    if (routine[day]?.note) {
      doc.setFontSize(11);
      doc.setTextColor('#B0FFB0');
      doc.setDrawColor('#53FC18');
      doc.rect(18, y - 3, 174, 10, 'S');
      doc.text(`Note: ${routine[day].note}`, 20, y + 4);
      y += 15;
    }
    y += 3;
    if (y > 250 && idx < daysOfWeek.length - 1) {
      doc.setFontSize(10);
      doc.setTextColor('#B0FFB0');
      doc.text(`Page ${doc.internal.getNumberOfPages()}`, 105, 290, { align: 'center' });
      doc.addPage();
      y = 38;
    }
  });
  // Footer with page number
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor('#B0FFB0');
    doc.text(`Page ${i} of ${pageCount} | Fitmint`, 105, 290, { align: 'center' });
  }
  doc.save('fitmint-workout-routine.pdf');
}

// Two FABs: Add Workout and Actions (with animated circular menu)
function ActionsFabMenu({ onImport, onExport, onExportCSV, onExportPDF, onTemplate, onTemplateCSV, onTemplatePDF, onTemplateJSON }) {
  const [open, setOpen] = useState(false);
  const [submenu, setSubmenu] = useState(null); // 'export' or 'template'
  return (
    <div className="fixed z-50 flex flex-col items-end gap-4" style={{ bottom: '110px', right: '24px' }}>
      {/* Circular menu when open */}
      {open && (
        <div className="relative flex flex-col items-end gap-4 animate-fade-in">
          {/* Close (X) button */}
          <button
            className="w-14 h-14 rounded-full bg-[#23272F] text-[#53FC18] flex items-center justify-center text-3xl shadow-xl border-2 border-[#23272F] hover:bg-[#181A20] transition-all rotate-0"
            onClick={() => { setOpen(false); setSubmenu(null); }}
            aria-label="Close Actions"
            style={{ transform: 'rotate(0deg)' }}
          >
            ×
          </button>
          {/* Download Template */}
          <div className="relative">
            <button
              className="w-14 h-14 rounded-full bg-gradient-to-r from-[#B0FFB0] to-[#53FC18] text-[#181A20] flex items-center justify-center text-2xl shadow-xl border-2 border-[#23272F] hover:scale-110 transition-all"
              onClick={() => setSubmenu(submenu === 'template' ? null : 'template')}
              aria-label="Download Template"
            >
              <FaDownload />
            </button>
            {submenu === 'template' && (
              <div className="absolute right-20 top-1/2 -translate-y-1/2 flex flex-col gap-2 bg-[#23272F] rounded-xl p-3 shadow-xl animate-fade-in">
                <button onClick={onTemplatePDF} className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#53FC18] font-bold hover:bg-[#181A20] text-base"><FaFilePdf /> PDF</button>
                <button onClick={onTemplateCSV} className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#53FC18] font-bold hover:bg-[#181A20] text-base"><FaFileCsv /> CSV</button>
                <button onClick={onTemplateJSON} className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#53FC18] font-bold hover:bg-[#181A20] text-base"><FaFileCode /> JSON</button>
              </div>
            )}
          </div>
          {/* Export */}
          <div className="relative">
            <button
              className="w-14 h-14 rounded-full bg-gradient-to-r from-[#53FC18] to-[#B0FFB0] text-[#181A20] flex items-center justify-center text-2xl shadow-xl border-2 border-[#23272F] hover:scale-110 transition-all"
              onClick={() => setSubmenu(submenu === 'export' ? null : 'export')}
              aria-label="Export"
            >
              <FaFileExport />
            </button>
            {submenu === 'export' && (
              <div className="absolute right-20 top-1/2 -translate-y-1/2 flex flex-col gap-2 bg-[#23272F] rounded-xl p-3 shadow-xl animate-fade-in">
                <button onClick={onExportPDF} className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#53FC18] font-bold hover:bg-[#181A20] text-base"><FaFilePdf /> PDF</button>
                <button onClick={onExportCSV} className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#53FC18] font-bold hover:bg-[#181A20] text-base"><FaFileCsv /> CSV</button>
                <button onClick={onExport} className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#53FC18] font-bold hover:bg-[#181A20] text-base"><FaFileCode /> JSON</button>
              </div>
            )}
          </div>
          {/* Import */}
          <button
            className="w-14 h-14 rounded-full bg-gradient-to-r from-[#53FC18] to-[#B0FFB0] text-[#181A20] flex items-center justify-center text-2xl shadow-xl border-2 border-[#23272F] hover:scale-110 transition-all"
            onClick={onImport}
            aria-label="Import"
          >
            <FaFileImport />
          </button>
        </div>
      )}
      {/* Main Actions FAB (menu icon) */}
      <button
        className="w-16 h-16 rounded-full bg-gradient-to-r from-[#23272F] to-[#181A20] text-[#53FC18] flex items-center justify-center text-4xl shadow-2xl border-4 border-[#23272F] hover:scale-110 active:scale-95 transition-all"
        onClick={() => setOpen(v => !v)}
        aria-label="Open Actions"
      >
        <FaBars />
      </button>
    </div>
  );
}

export default function MyRoutine() {
  const { user } = useAuth();
  const [selectedDay, setSelectedDay] = useState(daysOfWeek[0]);
  const [routine, setRoutine] = useState({});
  const [exercise, setExercise] = useState({ name: '', sets: '', reps: '' });
  const [note, setNote] = useState('');
  const [editingIdx, setEditingIdx] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef();
  const [modal, setModal] = useState({ open: false, action: null, message: '', onConfirm: null });
  const [editingNote, setEditingNote] = useState(false);
  const [noteDraft, setNoteDraft] = useState(note);
  const [deleteIdx, setDeleteIdx] = useState(null);
  const [undoData, setUndoData] = useState(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef();

  // Load full 7-day routine from Firestore
  useEffect(() => {
    if (!user) return;
    const fetchRoutine = async () => {
      setLoading(true);
      const ref = doc(db, 'users', user.uid, 'routine', 'plan');
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setRoutine(data);
        setNote(data[selectedDay]?.note || '');
      } else {
        // Initialize empty plan for all days
        const emptyPlan = daysOfWeek.reduce((acc, day) => {
          acc[day] = { exercises: [], note: '' };
          return acc;
        }, {});
        setRoutine(emptyPlan);
        setNote('');
      }
      setLoading(false);
    };
    fetchRoutine();
  }, [user, selectedDay]);

  useEffect(() => {
    setNote(routine[selectedDay]?.note || '');
    // Progress calculation (placeholder: all exercises incomplete)
    const total = routine[selectedDay]?.exercises?.length || 0;
    setProgress(total === 0 ? 0 : 0); // Replace with real logic if you track completed
  }, [selectedDay, routine]);

  // Save full routine to Firestore
  const saveRoutine = async (newRoutine) => {
    if (!user) return;
    const ref = doc(db, 'users', user.uid, 'routine', 'plan');
    await setDoc(ref, newRoutine, { merge: true });
  };

  const openModal = (editIdx = null) => {
    if (editIdx !== null) {
      setExercise(routine[selectedDay]?.exercises[editIdx]);
      setEditingIdx(editIdx);
    } else {
      setExercise({ name: '', sets: '', reps: '' });
      setEditingIdx(null);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setExercise({ name: '', sets: '', reps: '' });
    setEditingIdx(null);
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    if (!exercise.name.trim() || !exercise.sets || !exercise.reps) return;
    let updatedExercises;
    if (editingIdx !== null) {
      updatedExercises = routine[selectedDay].exercises.map((ex, i) => i === editingIdx ? { name: exercise.name, sets: exercise.sets, reps: exercise.reps } : ex);
    } else {
      updatedExercises = [...(routine[selectedDay]?.exercises || []), { name: exercise.name, sets: exercise.sets, reps: exercise.reps }];
    }
    const updatedDay = { ...routine[selectedDay], exercises: updatedExercises };
    const newRoutine = { ...routine, [selectedDay]: updatedDay };
    setRoutine(newRoutine);
    await saveRoutine(newRoutine);
    closeModal();
  };

  const handleDeleteExercise = async (idx) => {
    setDeleteIdx(idx);
  };

  const confirmDeleteExercise = async () => {
    const idx = deleteIdx;
    setDeleteIdx(null);
    const exercises = routine[selectedDay].exercises;
    const deleted = exercises[idx];
    const updatedExercises = exercises.filter((_, i) => i !== idx);
    const updatedDay = { ...routine[selectedDay], exercises: updatedExercises };
    const newRoutine = { ...routine, [selectedDay]: updatedDay };
    setRoutine(newRoutine);
    await saveRoutine(newRoutine);
    setUndoData({ idx, exercise: deleted });
    toast(<span>Workout deleted. <button onClick={handleUndo} className="underline text-[var(--kick-green)] ml-2">Undo</button></span>, { autoClose: 5000 });
  };

  const cancelDeleteExercise = () => setDeleteIdx(null);

  // Notes edit
  const handleNoteEdit = () => {
    setNoteDraft(note);
    setEditingNote(true);
  };

  const handleNoteSave = async () => {
    if (!noteDraft.trim()) return;
    setEditingNote(false);
    setNote(noteDraft);
    // Save to Firestore
    if (user) {
      const ref = doc(db, 'users', user.uid, 'routine', 'plan');
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        data[selectedDay] = { ...data[selectedDay], note: noteDraft };
        await setDoc(ref, data, { merge: true });
      }
    }
  };

  const handleNoteCancel = () => {
    setEditingNote(false);
    setNoteDraft(note);
  };

  // Undo delete
  const handleUndo = async () => {
    if (!undoData) return;
    const { idx, exercise } = undoData;
    const exercises = [...(routine[selectedDay]?.exercises || [])];
    exercises.splice(idx, 0, exercise);
    const updatedDay = { ...routine[selectedDay], exercises };
    const newRoutine = { ...routine, [selectedDay]: updatedDay };
    setRoutine(newRoutine);
    await saveRoutine(newRoutine);
    setUndoData(null);
    toast.success('Undo successful!');
  };

  // Template for download
  const templateRoutine = daysOfWeek.reduce((acc, day) => {
    acc[day] = { exercises: [], note: '' };
    return acc;
  }, {});

  // Update handleTemplateDownload to support format
  const handleTemplateDownload = (format = 'json') => {
    if (format === 'csv') {
      const csv = routineToCSV(templateRoutine);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'fitmint-workout-template.csv';
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'pdf') {
      routineToPDF(templateRoutine);
    } else {
      const dataStr = JSON.stringify(templateRoutine, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'fitmint-workout-template.json';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // Export as CSV
  const handleExportCSV = () => {
    setModal({
      open: true,
      action: 'export-csv',
      message: 'Export your current workout routine as CSV?',
      onConfirm: () => {
        const csv = routineToCSV(routine);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'fitmint-workout-routine.csv';
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Workout routine exported as CSV!');
        setModal({ open: false });
      }
    });
  };

  // Export as PDF
  const handleExportPDF = () => {
    setModal({
      open: true,
      action: 'export-pdf',
      message: 'Export your current workout routine as PDF?',
      onConfirm: () => {
        routineToPDF(routine);
        toast.success('Workout routine exported as PDF!');
        setModal({ open: false });
      }
    });
  };

  // Export as JSON
  const handleExport = () => {
    setModal({
      open: true,
      action: 'export-json',
      message: 'Export your current workout routine as JSON?',
      onConfirm: () => {
        const dataStr = JSON.stringify(routine, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'fitmint-workout-routine.json';
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Workout routine exported as JSON!');
        setModal({ open: false });
      }
    });
  };

  // Import routine from JSON with confirmation and merge option
  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const imported = JSON.parse(text);
      // Basic validation: check days and structure
      const valid = daysOfWeek.every(day => imported[day] && Array.isArray(imported[day].exercises) && typeof imported[day].note === 'string');
      if (!valid) throw new Error('Invalid file structure. Please use the provided template.');
      setModal({
        open: true,
        action: 'import',
        message: 'Do you want to merge the imported routine with your current one? (Merge = combine, Overwrite = replace)',
        onConfirm: async (merge = true) => {
          let newRoutine;
          if (merge) {
            // Merge: combine exercises and notes for each day
            newRoutine = { ...routine };
            daysOfWeek.forEach(day => {
              newRoutine[day] = {
                exercises: Array.isArray(routine[day]?.exercises) ? [...routine[day].exercises] : [],
                note: routine[day]?.note || ''
              };
              imported[day].exercises.forEach(ex => {
                if (!newRoutine[day].exercises.some(e => e.name === ex.name && e.sets === ex.sets && e.reps === ex.reps)) {
                  newRoutine[day].exercises.push(ex);
                }
              });
              if (imported[day].note && imported[day].note !== newRoutine[day].note) {
                newRoutine[day].note += (newRoutine[day].note ? '\n' : '') + imported[day].note;
              }
            });
          } else {
            // Overwrite
            newRoutine = imported;
          }
          setRoutine(newRoutine);
          await saveRoutine(newRoutine);
          toast.success('Workout routine imported successfully!');
          setModal({ open: false });
        }
      });
    } catch (err) {
      toast.error('Failed to import: ' + err.message);
    }
    // Reset file input
    e.target.value = '';
  };

  return (
    <div className="min-h-screen px-2 pt-24 pb-24 flex flex-col items-center ">
      <Helmet>
        <title>My Routine – Fitmint by Murtuja</title>
        <meta name="description" content="Plan and manage your weekly workout routine with Fitmint by Murtuja. Fitness tracker for your daily progress." />
        <meta name="keywords" content="Fitmint, fitness tracker, workout routine, Murtuja, health, plan, schedule" />
        <meta property="og:title" content="My Routine – Fitmint by Murtuja" />
        <meta property="og:description" content="Plan and manage your weekly workout routine with Fitmint by Murtuja. Fitness tracker for your daily progress." />
        <meta property="og:image" content="/dmbbell.png" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fitmint.vercel.app/my-routine" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="My Routine – Fitmint by Murtuja" />
        <meta name="twitter:description" content="Plan and manage your weekly workout routine with Fitmint by Murtuja. Fitness tracker for your daily progress." />
        <meta name="twitter:image" content="/dmbbell.png" />
      </Helmet>
      {/* Dashboard-style hero header block */}
      <div className="w-full max-w-5xl flex flex-col items-center justify-center mb-8 animate-fade-in-up">
       {/* <div className="h-1 w-40 bg-gradient-to-r from-[var(--kick-green)] to-[#B0FFB0] rounded-full mb-4" /> */}
        <div className="flex flex-wrap gap-2 md:gap-3 gap-y-2 md:gap-y-0 justify-center">
          {daysOfWeek.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`w-28 md:w-32 px-2 py-2 rounded-full font-semibold transition-all focus:outline-none text-base border-2 border-transparent whitespace-nowrap
                ${selectedDay === day
                  ? 'bg-[var(--kick-green)] text-[#181A20] scale-110 border-[var(--kick-green)] shadow-lg animate-day-select'
                  : 'bg-[#23272F] text-[#B0FFB0] hover:bg-[#23272F]/80 hover:scale-105'}
              `}
            >
              {day}
            </button>
          ))}
        </div>
      </div>
      {/* Main card styled like Dashboard */}
      <div className="w-full max-w-5xl rounded-3xl glass-card border border-[#23272F] p-0 shadow-2xl animate-dashboard-card relative overflow-hidden" style={{background: 'linear-gradient(135deg, #20232A 80%, #53FC18 100%)'}}>
        {/* Accent bar at top of card */}
        <div className="h-2 w-full bg-gradient-to-r from-[var(--kick-green)] via-[#B0FFB0] to-[#53FC18] mb-2" />
        <div className="p-4 md:p-8 flex flex-col gap-4 md:gap-6">
          {/* Notes for day styled like Dashboard */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <FaEdit className="text-xl text-[var(--kick-green)]" />
              <span className="text-xl font-bold text-[var(--kick-green)]">Notes for {selectedDay}</span>
            </div>
            <div className="h-1 w-32 bg-gradient-to-r from-[var(--kick-green)] to-[#B0FFB0] rounded-full mb-2" />
            {editingNote ? (
              <div className="flex items-center gap-2 w-full">
                <input
                  className={`w-full glass-card bg-[#23272F]/80 text-[#B0FFB0] rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[var(--kick-green)] min-h-[40px] border-2 ${!noteDraft.trim() ? 'border-red-500' : 'border-[var(--kick-green)]'} placeholder-[#B0FFB0] font-medium shadow-inner text-lg`}
                  value={noteDraft}
                  onChange={e => setNoteDraft(e.target.value)}
                  autoFocus
                />
                <button onClick={handleNoteSave} className="p-3 rounded-full bg-[var(--kick-green)] text-[#181A20] hover:bg-[#B0FFB0] transition shadow" aria-label="Save Note"><FaSave /></button>
                <button onClick={handleNoteCancel} className="p-3 rounded-full bg-[#23272F] text-[#B0FFB0] hover:bg-[#181A20] transition shadow" aria-label="Cancel Edit"><FaTimes /></button>
              </div>
            ) : (
              <div className="w-full glass-card bg-[#23272F]/80 text-[#B0FFB0] rounded-xl p-4 min-h-[40px] font-medium shadow-inner text-lg flex items-center justify-between">
                <span>{note || `Add notes or details for this day...`}</span>
                <button onClick={handleNoteEdit} className="ml-4 p-2 rounded-full bg-[#23272F] text-[var(--kick-green)] hover:bg-[#181A20] transition shadow" aria-label="Edit Note"><FaEdit /></button>
              </div>
            )}
          </div>
          {/* Section title for day */}
          <div className="flex items-center gap-2 mb-4 justify-between">
            <div className="flex items-center gap-2">
              <FaCalendar className="text-2xl text-[var(--kick-green)]" />
              <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--kick-green)] tracking-tight">{selectedDay} Workouts</h2>
            </div>
            <button
              onClick={() => openModal()}
              className="bg-gradient-to-r from-[var(--kick-green)] to-[#53FC18] text-[#181A20] font-extrabold rounded-full shadow-xl p-0 w-12 h-12 flex items-center justify-center text-3xl hover:scale-110 active:scale-95 transition-transform focus:outline-none focus:ring-4 focus:ring-[var(--kick-green)]/40"
              aria-label="Add Workout"
              style={{ boxShadow: '0 4px 16px 0 rgba(83,252,24,0.18)' }}
            >
              <span className="sr-only">Add Workout</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
          </div>
          {/* Section divider */}
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#B0FFB0]/30 to-transparent my-2 rounded-full" />
          {/* Workout list styled like Dashboard checklist */}
          <ul className="space-y-2 md:space-y-3 mb-1 md:mb-2">
            {(routine[selectedDay]?.exercises || []).length === 0 ? (
              <li className="flex flex-col items-center py-12 animate-fade-in">
                <span className="text-6xl mb-4">💪</span>
                <span className="text-lg text-[#B0FFB0] mb-6 text-center">No workouts added for {selectedDay}. Tap below to add your first workout.</span>
                <button
                  onClick={() => openModal()}
                  className="mt-2 bg-gradient-to-r from-[var(--kick-green)] to-[#53FC18] text-[#181A20] font-extrabold rounded-full px-10 py-4 text-xl shadow-xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-transform"
                  aria-label="Add Workout"
                >
                  <FaPlus className="text-2xl" /> Add Workout
                </button>
              </li>
            ) : (
              routine[selectedDay].exercises.map((ex, idx) => (
                <li key={idx} className="flex items-center justify-between glass-card bg-[#181A20]/90 border border-[#23272F] rounded-2xl p-2 md:p-3 group transition-all shadow-lg hover:bg-[#23272F]/95 animate-checklist-item">
                  <div className="flex items-center gap-3 w-full">
                    <FaDumbbell className="text-lg text-[var(--kick-green)]" />
                    <div className="flex flex-col justify-center w-full">
                      <span className="font-extrabold text-base md:text-lg transition-all text-[#F3F3F3] group-hover:text-[var(--kick-green)]">{ex.name}</span>
                      <span className="ml-0 md:ml-2 text-sm md:text-base text-[#B0FFB0]">{ex.sets} sets × {ex.reps} reps</span>
                    </div>
                  </div>
                  <div className="flex gap-1 md:gap-2">
                    <button onClick={() => openModal(idx)} className="p-2 rounded hover:bg-[#23272F]/60 transition-colors hover:scale-110" title="Edit"><FaEdit className="text-[var(--kick-green)]" /></button>
                    <button onClick={() => handleDeleteExercise(idx)} className="p-2 rounded hover:bg-[#23272F]/60 transition-colors hover:scale-110" title="Delete"><FaTrash className="text-red-500" /></button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
      {/* Delete confirmation dialog */}
      {deleteIdx !== null && (
        <ConfirmModal
          open={true}
          title="Delete Workout"
          message="Are you sure you want to delete this workout? This action cannot be undone."
          onConfirm={confirmDeleteExercise}
          onCancel={cancelDeleteExercise}
          confirmText="Delete"
          cancelText="Cancel"
        />
      )}
      {/* Actions FAB menu (bottom right) */}
      <ActionsFabMenu
        onImport={() => fileInputRef.current.click()}
        onExport={handleExport}
        onExportCSV={handleExportCSV}
        onExportPDF={handleExportPDF}
        onTemplate={handleTemplateDownload}
        onTemplateCSV={() => handleTemplateDownload('csv')}
        onTemplatePDF={() => handleTemplateDownload('pdf')}
        onTemplateJSON={() => handleTemplateDownload('json')}
      />
      <input
        type="file"
        accept="application/json"
        ref={fileInputRef}
        onChange={handleImport}
        style={{ display: 'none' }}
      />
      <ConfirmModal
        open={modal.open}
        title={modal.action === 'import' ? 'Import Workouts' : 'Export Workouts'}
        message={modal.message}
        onCancel={() => setModal({ open: false })}
        onConfirm={modal.action === 'import' ? () => modal.onConfirm(true) : modal.onConfirm}
        confirmText={modal.action === 'import' ? 'Merge' : 'Confirm'}
        cancelText={modal.action === 'import' ? 'Overwrite' : 'Cancel'}
      />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />

      {/* Add/Edit Workout Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-fade-in"
          aria-modal="true"
          role="dialog"
          tabIndex={-1}
          onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
          onKeyDown={e => { if (e.key === 'Escape') closeModal(); }}
        >
          <div
            className="glass-card bg-[#23272A]/90 border border-[#23272F] rounded-3xl w-full max-w-md mx-auto relative overflow-hidden shadow-2xl animate-modal-pop p-0 backdrop-blur-xl"
            role="document"
            tabIndex={0}
            onKeyDown={e => { if (e.key === 'Escape') closeModal(); }}
          >
            {/* Close (X) button */}
            <button
              className="absolute top-4 right-4 text-3xl text-[#B0FFB0] hover:text-[var(--kick-green)] transition-colors focus:outline-none"
              onClick={closeModal}
              aria-label="Close modal"
              type="button"
            >
              ×
            </button>
            <form onSubmit={handleAddOrUpdate} className="p-10 pt-16 flex flex-col gap-8">
              <div className="flex flex-col items-center gap-2 mb-2">
                <img src="/dmbbell.png" alt="Dumbbell" className="w-10 h-10 mb-1" />
                <h3 className="text-2xl font-extrabold bg-gradient-to-r from-[var(--kick-green)] via-[#B0FFB0] to-[var(--kick-green)] bg-clip-text text-transparent text-center drop-shadow">{editingIdx !== null ? 'Edit Workout' : 'Add Workout'}</h3>
              </div>
              <hr className="border-[#23272F] my-2" />
              <div className="flex flex-col gap-4">
                <label className="font-bold text-[#B0FFB0]" htmlFor="exercise-name">Exercise Name</label>
                <input
                  id="exercise-name"
                  type="text"
                  value={exercise.name}
                  onChange={e => setExercise({ ...exercise, name: e.target.value })}
                  className="glass-card bg-[#23272F]/80 text-[#B0FFB0] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--kick-green)] border-2 border-[#53FC18] font-medium text-lg shadow transition-all w-full placeholder:opacity-60 placeholder-[#B0FFB0] focus:shadow-[0_0_0_3px_rgba(83,252,24,0.3)]"
                  placeholder="e.g. Push Ups"
                  required
                  aria-label="Exercise Name"
                />
                <span className="text-[#B0FFB0]/60 text-sm pl-1">e.g. Push Ups</span>
              </div>
              <div className="flex gap-4 w-full">
                <div className="flex-1 flex flex-col gap-2">
                  <label className="font-bold text-[#B0FFB0]" htmlFor="sets">Sets</label>
                  <input
                    id="sets"
                    type="number"
                    min="1"
                    value={exercise.sets}
                    onChange={e => setExercise({ ...exercise, sets: e.target.value })}
                    className="glass-card bg-[#23272F]/80 text-[#B0FFB0] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--kick-green)] border-2 border-[#53FC18] font-medium text-lg shadow transition-all w-full placeholder:opacity-60 placeholder-[#B0FFB0] focus:shadow-[0_0_0_3px_rgba(83,252,24,0.3)]"
                    placeholder="3"
                    required
                    aria-label="Sets"
                  />
                  <span className="text-[#B0FFB0]/60 text-sm pl-1">Number of sets</span>
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <label className="font-bold text-[#B0FFB0]" htmlFor="reps">Reps</label>
                  <input
                    id="reps"
                    type="number"
                    min="1"
                    value={exercise.reps}
                    onChange={e => setExercise({ ...exercise, reps: e.target.value })}
                    className="glass-card bg-[#23272F]/80 text-[#B0FFB0] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--kick-green)] border-2 border-[#53FC18] font-medium text-lg shadow transition-all w-full placeholder:opacity-60 placeholder-[#B0FFB0] focus:shadow-[0_0_0_3px_rgba(83,252,24,0.3)]"
                    placeholder="12"
                    required
                    aria-label="Reps"
                  />
                  <span className="text-[#B0FFB0]/60 text-sm pl-1">Number of reps</span>
                </div>
              </div>
              <div className="flex gap-4 justify-center mt-4">
                <button type="button" onClick={closeModal} className="px-8 py-3 rounded-lg bg-[#23272F] text-[#B0FFB0] font-bold shadow hover:bg-[#23272F]/80 transition text-lg hover:scale-105 active:scale-95 focus:shadow-[0_0_0_3px_rgba(83,252,24,0.3)]" aria-label="Cancel">Cancel</button>
                <button type="submit" className="px-8 py-3 rounded-lg bg-[var(--kick-green)] text-[#181A20] font-bold shadow hover:bg-[#53FC18] transition text-lg hover:scale-105 active:scale-95 focus:shadow-[0_0_0_3px_rgba(83,252,24,0.3)]" aria-label={editingIdx !== null ? 'Update Workout' : 'Add Workout'}>{editingIdx !== null ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}