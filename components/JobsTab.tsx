
import React, { useState } from 'react';
import { Search, Filter, Briefcase, Plus, X, MapPin, DollarSign, Clock, CheckCircle2, Building, ChevronRight } from 'lucide-react';
import { Job } from '../types';

const MOCK_JOBS: Job[] = [
  {
    id: 'j1',
    title: 'Senior Frontend Engineer',
    company: 'InstaMarket Tech',
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
      <div className="bg-[#121212] min-h-screen p-6 pb-24 animate-in slide-in-from-right duration-300">
        <header className="flex items-center space-x-4 mb-8">
          <button onClick={() => setView('browse')} className="p-2 bg-white/10 rounded-full">
            <X className="w-6 h-6 text-white/40" />
          </button>
          <h2 className="text-2xl font-black text-white">Post a Job</h2>
        </header>

        <form onSubmit={handleCreateJob} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-white/40 uppercase mb-2">Job Title</label>
              <input required type="text" placeholder="e.g. Lead Developer" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-medium text-white" value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} />
            </div>

            <div>
              <label className="block text-xs font-bold text-white/40 uppercase mb-2">Company Name</label>
              <input required type="text" placeholder="e.g. InstaMarket Inc." className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-medium text-white" value={newJob.company} onChange={e => setNewJob({...newJob, company: e.target.value})} />
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-transform">
              POST OPPORTUNITY
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (view === 'detail' && selectedJob) {
    return (
      <div className="bg-[#121212] min-h-screen p-6 pb-24 animate-in slide-in-from-bottom duration-300">
        <header className="flex items-center justify-between mb-8">
          <button onClick={() => setView('browse')} className="p-2 bg-white/10 rounded-full">
             <ChevronRight className="w-6 h-6 rotate-180 text-white" />
          </button>
          <button className="p-2 bg-white/10 rounded-full">
            <CheckCircle2 className="w-6 h-6 text-blue-500" />
          </button>
        </header>

        <div className="flex flex-col items-center text-center mb-8">
           <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] mb-4 flex items-center justify-center border border-white/10 shadow-sm overflow-hidden">
             <img src={selectedJob.logo} className="w-full h-full object-cover" alt="" />
           </div>
           <h3 className="text-2xl font-black text-white tracking-tight">{selectedJob.title}</h3>
           <p className="text-blue-500 font-black uppercase tracking-widest text-[10px] mt-1">{selectedJob.company}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
           <div className="bg-white/5 backdrop-blur-md p-4 rounded-3xl flex items-center space-x-3 border border-white/5">
             <MapPin className="w-5 h-5 text-blue-500" />
             <div className="text-left">
               <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">Location</p>
               <p className="text-xs font-bold text-white">{selectedJob.location}</p>
             </div>
           </div>
           <div className="bg-white/5 backdrop-blur-md p-4 rounded-3xl flex items-center space-x-3 border border-white/5">
             <Clock className="w-5 h-5 text-indigo-500" />
             <div className="text-left">
               <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">Type</p>
               <p className="text-xs font-bold text-white">{selectedJob.type}</p>
             </div>
           </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl p-6 rounded-[2.5rem] mb-8 border border-white/10">
          <h4 className="text-xs font-black text-white/40 uppercase tracking-[0.2em] mb-4">About the role</h4>
          <p className="text-sm text-white/80 leading-relaxed font-medium">
            {selectedJob.description}
            <br /><br />
            We offer competitive benefits, flexible working hours, and a vibrant community of innovators.
          </p>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-6 bg-black/40 backdrop-blur-xl border-t border-white/10">
           <button onClick={handleApply} className="w-full bg-blue-600 text-white py-4 rounded-3xl font-black text-lg shadow-xl active:scale-95 transition-all">
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
          <h2 className="text-2xl font-black text-white">Opportunities</h2>
          <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mt-0.5">Find your next big move</p>
        </div>
        <button onClick={() => setView('create')} className="p-3 bg-white/10 border border-white/10 rounded-2xl text-white shadow-lg active:scale-95 transition-transform">
          <Plus className="w-6 h-6" />
        </button>
      </header>

      <div className="px-2 space-y-4 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 flex items-center space-x-3 backdrop-blur-md">
          <Search className="w-5 h-5 text-white/20" />
          <input type="text" placeholder="Search roles or companies..." className="bg-transparent border-none outline-none w-full text-sm font-medium text-white placeholder-white/20" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
      </div>

      <div className="space-y-4 px-2">
        {filteredJobs.map(job => (
          <div key={job.id} onClick={() => { setSelectedJob(job); setView('detail'); }} className="bg-white/5 backdrop-blur-md p-5 rounded-[2.5rem] shadow-sm border border-white/10 flex items-start space-x-4 group cursor-pointer transition-all hover:bg-white/10">
            <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex-shrink-0 flex items-center justify-center border border-white/10 overflow-hidden">
               <img src={job.logo} className="w-full h-full object-cover" alt="" />
            </div>
            <div className="flex-grow min-w-0">
              <div className="flex justify-between items-start mb-1">
                 <h4 className="font-black text-sm text-white group-hover:text-blue-500 transition-colors">{job.title}</h4>
                 <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">{job.postedAt}</span>
              </div>
              <p className="text-blue-500 font-bold text-xs mb-3 uppercase tracking-widest">{job.company}</p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1.5 text-white/40">
                  <MapPin className="w-3 h-3" />
                  <span className="text-[10px] font-bold">{job.location}</span>
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
