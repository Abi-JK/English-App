import React, { useState } from 'react';
import { FileText, Download, Briefcase, GraduationCap, Code, Mail, Phone, MapPin, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Resume = () => {
  const { addXp } = useAppContext();
  const [resumeData, setResumeData] = useState({
    name: 'Ramesh Kumar',
    title: 'Junior Software Engineer',
    email: 'ramesh.kumar@email.com',
    phone: '+91 98765 43210',
    location: 'Chennai, Tamil Nadu, India',
    summary: 'Proactive and detail-oriented Software Engineer with a passion for web development and cloud technologies. Experienced in building responsive interfaces and optimizing databases to support enterprise scale.',
    experience: [
      { id: 1, role: 'Web Developer Intern', company: 'TechSolutions Pvt Ltd', period: '2025 - Present', description: 'Developed responsive client dashboards using React. Collaborated with designers to implement custom workflows.' }
    ],
    education: [
      { id: 1, degree: 'B.E. Computer Science & Engineering', institution: 'Anna University', period: '2021 - 2025' }
    ],
    skills: ['React', 'JavaScript', 'Node.js', 'SQL', 'English Communication', 'Git']
  });

  const [newSkill, setNewSkill] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState('editor'); // 'editor', 'analysis'

  const handleInputChange = (field, value) => {
    setResumeData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (type, id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      [type]: prev[type].map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const addArrayItem = (type) => {
    const newItem = type === 'experience'
      ? { id: Date.now(), role: 'New Role', company: 'Company Name', period: '2025 - Present', description: 'Describe your achievements and duties...' }
      : { id: Date.now(), degree: 'Degree Name', institution: 'Institution Name', period: '2021 - 2025' };

    setResumeData(prev => ({ ...prev, [type]: [...prev[type], newItem] }));
  };

  const removeArrayItem = (type, id) => {
    setResumeData(prev => ({ ...prev, [type]: prev[type].filter(item => item.id !== id) }));
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !resumeData.skills.includes(newSkill.trim())) {
      setResumeData(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setResumeData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skillToRemove) }));
  };

  const analyzeResume = () => {
    let score = 100;
    const suggestions = [];
    const strongVerbs = ['developed', 'collaborated', 'implemented', 'optimized', 'led', 'designed', 'spearheaded', 'managed', 'created', 'built', 'streamlined'];
    const weakPhrases = ['responsible for', 'helped', 'tried to', 'assisted in', 'handled'];

    const fullText = (
      resumeData.summary + ' ' + 
      resumeData.experience.map(e => e.role + ' ' + e.description).join(' ')
    ).toLowerCase();

    // Check action verbs
    const foundStrongVerbs = strongVerbs.filter(verb => fullText.includes(verb));
    if (foundStrongVerbs.length < 3) {
      score -= 20;
      suggestions.push("Add more powerful action verbs (e.g. 'spearheaded', 'optimized', 'streamlined') instead of describing basic tasks.");
    }

    // Check weak phrasing
    const foundWeakPhrases = weakPhrases.filter(weak => fullText.includes(weak));
    if (foundWeakPhrases.length > 0) {
      score -= 15;
      suggestions.push(`Avoid passive/weak phrases like: "${foundWeakPhrases.join(', ')}". Replace them with action verbs showing active ownership.`);
    }

    // Check skill list length
    if (resumeData.skills.length < 5) {
      score -= 10;
      suggestions.push("Your skills list is a bit short. Add at least 5 tech or communication competencies.");
    }

    // Check summary length
    if (resumeData.summary.length < 80) {
      score -= 15;
      suggestions.push("The Professional Summary is too brief. Provide a 2-3 sentence overview highlighting your core strengths.");
    }

    if (suggestions.length === 0) {
      suggestions.push("Excellent work! Your resume uses active verbs, professional framing, and concise bullet points.");
    }

    setAnalysis({
      score: Math.max(20, score),
      suggestions,
      strongVerbsCount: foundStrongVerbs.length,
      weakPhrasesCount: foundWeakPhrases.length
    });

    setActiveTab('analysis');
    addXp(50);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="resume-page" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '28px', margin: 0 }}>Resume Builder & Analyzer</h1>
          <p className="text-muted">Draft a professional CV and run a communication critique to match MNC standards.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-secondary" onClick={analyzeResume}>
            🔍 Run Critique (+50 XP)
          </button>
          <button className="btn-primary" onClick={handlePrint}>
            <Download size={18} /> Print / Export PDF
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: 'var(--surface-color)', padding: '6px', borderRadius: '12px', width: 'fit-content' }}>
        <button
          onClick={() => setActiveTab('editor')}
          style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: activeTab === 'editor' ? 'var(--primary-color)' : 'transparent', color: activeTab === 'editor' ? 'white' : 'var(--text-muted)', fontWeight: '600', cursor: 'pointer' }}
        >
          ✏️ Edit Details
        </button>
        <button
          onClick={() => analysis ? setActiveTab('analysis') : analyzeResume()}
          style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: activeTab === 'analysis' ? 'var(--primary-color)' : 'transparent', color: activeTab === 'analysis' ? 'white' : 'var(--text-muted)', fontWeight: '600', cursor: 'pointer' }}
        >
          📊 Communication Score {analysis && `(${analysis.score}/100)`}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '28px' }}>
        
        {/* LEFT PANEL: Editor or Critique */}
        <div style={{ display: activeTab === 'editor' ? 'block' : 'none' }}>
          <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3>Personal details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Full Name</label>
                <input type="text" value={resumeData.name} onChange={(e) => handleInputChange('name', e.target.value)} style={{ width: '100%', padding: '10px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'white' }} />
              </div>
              <div>
                <label style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Job Title</label>
                <input type="text" value={resumeData.title} onChange={(e) => handleInputChange('title', e.target.value)} style={{ width: '100%', padding: '10px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'white' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Email</label>
                <input type="email" value={resumeData.email} onChange={(e) => handleInputChange('email', e.target.value)} style={{ width: '100%', padding: '10px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'white' }} />
              </div>
              <div>
                <label style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Phone</label>
                <input type="text" value={resumeData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} style={{ width: '100%', padding: '10px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'white' }} />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Location</label>
              <input type="text" value={resumeData.location} onChange={(e) => handleInputChange('location', e.target.value)} style={{ width: '100%', padding: '10px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'white' }} />
            </div>

            <div>
              <label style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Professional Summary</label>
              <textarea value={resumeData.summary} onChange={(e) => handleInputChange('summary', e.target.value)} style={{ width: '100%', height: '100px', padding: '10px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'white', resize: 'vertical' }} />
            </div>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>Work Experience</h3>
              <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => addArrayItem('experience')}>
                <Plus size={14} /> Add Role
              </button>
            </div>
            {resumeData.experience.map(exp => (
              <div key={exp.id} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input type="text" placeholder="Role Title" value={exp.role} onChange={(e) => handleArrayChange('experience', exp.id, 'role', e.target.value)} style={{ flex: 1, padding: '8px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'white' }} />
                  <input type="text" placeholder="Company" value={exp.company} onChange={(e) => handleArrayChange('experience', exp.id, 'company', e.target.value)} style={{ flex: 1, padding: '8px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'white' }} />
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <input type="text" placeholder="Period (e.g. 2024 - Present)" value={exp.period} onChange={(e) => handleArrayChange('experience', exp.id, 'period', e.target.value)} style={{ flex: 1, padding: '8px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'white' }} />
                  <button onClick={() => removeArrayItem('experience', exp.id)} style={{ padding: '8px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid #ef444430', borderRadius: '6px', cursor: 'pointer' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
                <textarea placeholder="Job description, projects, achievements..." value={exp.description} onChange={(e) => handleArrayChange('experience', exp.id, 'description', e.target.value)} style={{ width: '100%', height: '80px', padding: '8px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'white', resize: 'vertical' }} />
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>Education</h3>
              <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => addArrayItem('education')}>
                <Plus size={14} /> Add Degree
              </button>
            </div>
            {resumeData.education.map(edu => (
              <div key={edu.id} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input type="text" placeholder="Degree / Course" value={edu.degree} onChange={(e) => handleArrayChange('education', edu.id, 'degree', e.target.value)} style={{ flex: 1, padding: '8px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'white' }} />
                  <input type="text" placeholder="Institution" value={edu.institution} onChange={(e) => handleArrayChange('education', edu.id, 'institution', e.target.value)} style={{ flex: 1, padding: '8px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'white' }} />
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <input type="text" placeholder="Period" value={edu.period} onChange={(e) => handleArrayChange('education', edu.id, 'period', e.target.value)} style={{ flex: 1, padding: '8px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'white' }} />
                  <button onClick={() => removeArrayItem('education', edu.id)} style={{ padding: '8px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid #ef444430', borderRadius: '6px', cursor: 'pointer' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ marginBottom: '12px' }}>Skills</h3>
            <form onSubmit={handleAddSkill} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <input type="text" placeholder="Add a skill (e.g. communication, Java)" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} style={{ flex: 1, padding: '10px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'white' }} />
              <button type="submit" className="btn-primary" style={{ padding: '10px 16px' }}>Add</button>
            </form>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {resumeData.skills.map(skill => (
                <span key={skill} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0, 150, 136, 0.12)', color: 'var(--primary-color)', padding: '5px 12px', borderRadius: '16px', fontSize: '13px', fontWeight: '500' }}>
                  {skill}
                  <button type="button" onClick={() => handleRemoveSkill(skill)} style={{ border: 'none', background: 'transparent', color: 'var(--primary-color)', cursor: 'pointer', fontSize: '10px', display: 'flex', alignItems: 'center' }}>✕</button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* LEFT PANEL: Critique Mode */}
        {activeTab === 'analysis' && analysis && (
          <div>
            <div className="card" style={{ padding: '28px', borderLeft: `5px solid ${analysis.score >= 80 ? 'var(--success-color)' : 'var(--accent-color)'}` }}>
              <h3 style={{ marginBottom: '20px' }}>📊 Verbal Communication Critique</h3>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.02)', padding: '16px 28px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '42px', fontWeight: '800', color: analysis.score >= 80 ? 'var(--success-color)' : 'var(--accent-color)' }}>
                    {analysis.score}<span style={{ fontSize: '18px', fontWeight: 'normal', color: 'var(--text-muted)' }}>/100</span>
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>SpeakUp Grade</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '14px', color: 'var(--text-main)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <CheckCircle2 size={16} color="var(--success-color)" /> Action Verbs Tracked: <strong>{analysis.strongVerbsCount}</strong>
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-main)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {analysis.weakPhrasesCount > 0 ? (
                      <AlertCircle size={16} color="var(--danger-color)" />
                    ) : (
                      <CheckCircle2 size={16} color="var(--success-color)" />
                    )}
                    Passive / Weak Phrases: <strong>{analysis.weakPhrasesCount}</strong>
                  </div>
                </div>
              </div>

              <h4 style={{ color: 'var(--primary-color)', marginBottom: '12px' }}>Improvement Suggestions:</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {analysis.suggestions.map((sug, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', fontSize: '14px', background: 'rgba(255,255,255,0.01)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <AlertCircle size={18} color="var(--accent-color)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ color: 'var(--text-main)', lineHeight: '1.5' }}>{sug}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '28px', padding: '14px', background: 'rgba(0,150,136,0.08)', borderRadius: '8px', borderLeft: '3px solid var(--primary-color)', fontSize: '13px', color: 'var(--text-muted)' }}>
                <strong>💡 Quick Tip (ஆலோசனை):</strong> MNC HR recruiters look for action verbs that clearly quantify achievements. Instead of saying "I was responsible for coding", write "Engineered and deployed core client features."
              </div>
            </div>
          </div>
        )}

        {/* RIGHT PANEL: Live Resume Preview */}
        <div style={{ flex: 1 }} className="resume-preview-panel">
          <div className="card" style={{ padding: '36px', background: 'white', color: '#1e293b', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', position: 'sticky', top: '20px' }}>
            
            {/* Header */}
            <div style={{ borderBottom: '2px solid #009688', paddingBottom: '16px', marginBottom: '20px' }}>
              <h1 style={{ color: '#009688', fontSize: '28px', margin: '0 0 4px 0', fontWeight: '800', letterSpacing: '-0.5px' }}>{resumeData.name || 'Your Name'}</h1>
              <h3 style={{ color: '#64748b', fontSize: '16px', margin: '0 0 12px 0', fontWeight: '600' }}>{resumeData.title || 'Professional Title'}</h3>
              
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', color: '#475569', fontSize: '13px' }}>
                {resumeData.email && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Mail size={14} color="#009688" /> {resumeData.email}
                  </span>
                )}
                {resumeData.phone && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={14} color="#009688" /> {resumeData.phone}
                  </span>
                )}
                {resumeData.location && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} color="#009688" /> {resumeData.location}
                  </span>
                )}
              </div>
            </div>

            {/* Summary */}
            {resumeData.summary && (
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '14px', color: '#009688', borderBottom: '1.5px solid #e2e8f0', paddingBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '700' }}>Professional Summary</h3>
                <p style={{ fontSize: '13px', color: '#334155', lineHeight: '1.7', marginTop: '8px' }}>{resumeData.summary}</p>
              </div>
            )}

            {/* Experience */}
            {resumeData.experience.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '14px', color: '#009688', borderBottom: '1.5px solid #e2e8f0', paddingBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '700' }}>Professional Experience</h3>
                <div style={{ marginTop: '8px' }}>
                  {resumeData.experience.map(exp => (
                    <div key={exp.id} style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                        <strong style={{ fontSize: '13px', color: '#0f172a' }}>{exp.role}</strong>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>{exp.period}</span>
                      </div>
                      <div style={{ color: '#009688', fontSize: '12px', fontWeight: '600', margin: '2px 0 6px 0' }}>{exp.company}</div>
                      <p style={{ fontSize: '12.5px', color: '#334155', lineHeight: '1.6', whiteSpace: 'pre-line' }}>{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {resumeData.education.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '14px', color: '#009688', borderBottom: '1.5px solid #e2e8f0', paddingBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '700' }}>Education</h3>
                <div style={{ marginTop: '8px' }}>
                  {resumeData.education.map(edu => (
                    <div key={edu.id} style={{ marginBottom: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                        <strong style={{ fontSize: '13px', color: '#0f172a' }}>{edu.degree}</strong>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>{edu.period}</span>
                      </div>
                      <div style={{ color: '#475569', fontSize: '12px' }}>{edu.institution}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {resumeData.skills.length > 0 && (
              <div>
                <h3 style={{ fontSize: '14px', color: '#009688', borderBottom: '1.5px solid #e2e8f0', paddingBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '700' }}>Skills</h3>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                  {resumeData.skills.map(skill => (
                    <span key={skill} style={{ border: '1px solid #cbd5e1', color: '#475569', background: '#f8fafc', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default Resume;
