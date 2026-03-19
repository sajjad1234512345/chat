
import React, { useState } from 'react';
import { Search, Filter, Briefcase, Plus, X, MapPin, DollarSign, Clock, CheckCircle2, Building, ChevronRight } from 'lucide-react';
import { Job } from '../types';

const MOCK_JOBS: Job[] = [
  {
    id: 'j1',
    title: 'Senior Frontend Engineer',
    company: 'Games Tech',
    logo: 'https://picsum.photos/seed/techlogo/100/100',
    location: 'Remote',
    salary: '$120k - $160k',
    type: 'Full-time',
    description: 'We are looking for a creative frontend engineer to help build the future of social commerce.',
    postedAt: '2h ago'
  },
  {
    id: 'j2',
    title: 'Product Designer',
    company: 'CreativeFlow',
    logo: 'https://picsum.photos/seed/design/100/100',
    location: 'San Francisco, CA',
    salary: '$90k - $130k',
    type: 'Full-time',
    description: 'Join our award-winning design team to craft beautiful user experiences.',
    postedAt: '1d ago'
  }
];

const JobsTab: React.FC = () => {
  const [view, setView] = useState<'browse' | 'create' | 'detail'>('browse');
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showApplySuccess, setShowApplySuccess] = useState(false);

  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    type: 'Full-time' as Job['type'],
    description: ''
  });

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         job.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || job.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    const job: Job = {
      id: `job-${Date.now()}`,
      ...newJob,
      logo: `https://picsum.photos/seed/${newJob.company}/100/100`,
      postedAt: 'Just now'
    };
    setJobs([job, ...jobs]);
    setView('browse');
    setNewJob({ title: '', company: '', location: '', salary: '', type: 'Full-time', description: '' });
  };

  const handleApply = () => {
    setShowApplySuccess(true);
    setTimeout(() => {
      setShowApplySuccess(false);
      setView('browse');
    }, 2000);
  };

  if (view === 'create') {
    return (
      <div className="bg-base-bg min-h-screen p-6 pb-24 animate-in slide-in-from-right duration-300">
        <header className="flex items-center space-x-4 mb-8">
          <button onClick={() => setView('browse')} className="btn-icon">
            <X className="w-6 h-6 text-text-primary" />
          </button>
          <h2 className="text-display text-text-primary">Post a Job</h2>
        </header>

        <form onSubmit={handleCreateJob} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-label text-text-muted mb-2">Job Title</label>
              <input required type="text" placeholder="e.g. Lead Developer" className="w-full input-field" value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} />
            </div>

            <div>
              <label className="block text-label text-text-muted mb-2">Company Name</label>
              <input required type="text" placeholder="e.g. Games Inc." className="w-full input-field" value={newJob.company} onChange={e => setNewJob({...newJob, company: e.target.value})} />
            </div>

            <button type="submit" className="w-full btn-primary">
              POST OPPORTUNITY
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (view === 'detail' && selectedJob) {
    return (
      <div className="bg-base-bg min-h-screen p-6 pb-24 animate-in slide-in-from-bottom duration-300">
        <header className="flex items-center justify-between mb-8">
          <button onClick={() => setView('browse')} className="btn-icon">
             <ChevronRight className="w-6 h-6 rotate-180 text-text-primary" />
          </button>
          <button className="btn-icon">
            <CheckCircle2 className="w-6 h-6 text-accent-secondary" />
          </button>
        </header>

        <div className="flex flex-col items-center text-center mb-8">
           <div className="w-24 h-24 glass-level-1 rounded-[2.5rem] mb-4 flex items-center justify-center overflow-hidden">
             <img src={selectedJob.logo} className="w-full h-full object-cover" alt="" />
           </div>
           <h3 className="text-display text-text-primary tracking-tight">{selectedJob.title}</h3>
           <p className="text-accent-secondary text-label mt-1">{selectedJob.company}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
           <div className="glass-level-1 p-4 rounded-3xl flex items-center space-x-3">
             <MapPin className="w-5 h-5 text-accent-secondary" />
             <div className="text-left">
               <p className="text-label text-text-muted">Location</p>
               <p className="text-body-small font-bold text-text-primary">{selectedJob.location}</p>
             </div>
           </div>
           <div className="glass-level-1 p-4 rounded-3xl flex items-center space-x-3">
             <Clock className="w-5 h-5 text-accent-secondary" />
             <div className="text-left">
               <p className="text-label text-text-muted">Type</p>
               <p className="text-body-small font-bold text-text-primary">{selectedJob.type}</p>
             </div>
           </div>
        </div>

        <div className="glass-level-2 p-6 rounded-[2.5rem] mb-8">
          <h4 className="text-label text-text-muted mb-4">About the role</h4>
          <p className="text-body-default text-text-secondary leading-relaxed">
            {selectedJob.description}
            <br /><br />
            We offer competitive benefits, flexible working hours, and a vibrant community of innovators.
          </p>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-6 glass-level-3 border-t border-border-default">
           <button onClick={handleApply} className="w-full btn-primary">
             {showApplySuccess ? 'APPLICATION SENT!' : 'APPLY FOR THIS ROLE'}
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-lg mx-auto bg-transparent min-h-screen pb-24">
      <header className="flex justify-between items-center mb-6 px-2">
        <div>
          <h2 className="text-display text-text-primary">Opportunities</h2>
          <p className="text-label text-text-muted mt-0.5">Find your next big move</p>
        </div>
        <button onClick={() => setView('create')} className="btn-icon">
          <Plus className="w-6 h-6 text-text-primary" />
        </button>
      </header>

      <div className="px-2 space-y-4 mb-8">
        <div className="glass-level-1 rounded-2xl px-4 py-3 flex items-center space-x-3">
          <Search className="w-5 h-5 text-text-muted" />
          <input type="text" placeholder="Search roles or companies..." className="bg-transparent border-none outline-none w-full text-body-default text-text-primary placeholder-text-muted" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
      </div>

      <div className="space-y-4 px-2">
        {filteredJobs.map(job => (
          <div key={job.id} onClick={() => { setSelectedJob(job); setView('detail'); }} className="glass-level-1 p-5 rounded-[2.5rem] flex items-start space-x-4 group cursor-pointer transition-all hover:bg-white/10">
            <div className="w-14 h-14 bg-surface-1 rounded-2xl flex-shrink-0 flex items-center justify-center border border-border-default overflow-hidden">
               <img src={job.logo} className="w-full h-full object-cover" alt="" />
            </div>
            <div className="flex-grow min-w-0">
              <div className="flex justify-between items-start mb-1">
                 <h4 className="text-h3 text-text-primary group-hover:text-accent-secondary transition-colors">{job.title}</h4>
                 <span className="text-caption">{job.postedAt}</span>
              </div>
              <p className="text-accent-secondary text-label mb-3">{job.company}</p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1.5 text-text-muted">
                  <MapPin className="w-3 h-3" />
                  <span className="text-caption">{job.location}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobsTab;
