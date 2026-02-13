
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
  },
  {
    id: 'j3',
    title: 'Marketing Specialist',
    company: 'EcoBrand Solutions',
    logo: 'https://picsum.photos/seed/eco/100/100',
    location: 'Austin, TX',
    salary: '$50k - $75k',
    type: 'Contract',
    description: 'Help us promote sustainable brands through innovative social media campaigns.',
    postedAt: '3d ago'
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
      <div className="bg-white min-h-screen p-6 pb-24 animate-in slide-in-from-right duration-300">
        <header className="flex items-center space-x-4 mb-8">
          <button onClick={() => setView('browse')} className="p-2 bg-gray-50 rounded-full">
            <X className="w-6 h-6 text-gray-400" />
          </button>
          <h2 className="text-2xl font-black">Post a Job</h2>
        </header>

        <form onSubmit={handleCreateJob} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Job Title</label>
              <input 
                required
                type="text" 
                placeholder="e.g. Lead Developer"
                className="w-full bg-gray-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-200 text-sm font-medium"
                value={newJob.title}
                onChange={e => setNewJob({...newJob, title: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Company Name</label>
              <input 
                required
                type="text" 
                placeholder="e.g. InstaMarket Inc."
                className="w-full bg-gray-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-200 text-sm font-medium"
                value={newJob.company}
                onChange={e => setNewJob({...newJob, company: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Location</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Remote"
                  className="w-full bg-gray-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-200 text-sm font-medium"
                  value={newJob.location}
                  onChange={e => setNewJob({...newJob, location: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Job Type</label>
                <select 
                  className="w-full bg-gray-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-200 text-sm font-medium appearance-none"
                  value={newJob.type}
                  onChange={e => setNewJob({...newJob, type: e.target.value as any})}
                >
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Remote</option>
                  <option>Contract</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Salary Range</label>
              <input 
                required
                type="text" 
                placeholder="e.g. $80k - $120k"
                className="w-full bg-gray-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-200 text-sm font-medium"
                value={newJob.salary}
                onChange={e => setNewJob({...newJob, salary: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Job Description</label>
              <textarea 
                required
                rows={4}
                placeholder="What are the responsibilities?"
                className="w-full bg-gray-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-200 text-sm resize-none"
                value={newJob.description}
                onChange={e => setNewJob({...newJob, description: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-100"
          >
            POST OPPORTUNITY
          </button>
        </form>
      </div>
    );
  }

  if (view === 'detail' && selectedJob) {
    return (
      <div className="bg-white min-h-screen p-6 pb-24 animate-in slide-in-from-bottom duration-300">
        <header className="flex items-center justify-between mb-8">
          <button onClick={() => setView('browse')} className="p-2 bg-gray-50 rounded-full">
             <ChevronRight className="w-6 h-6 rotate-180" />
          </button>
          <button className="p-2 bg-gray-50 rounded-full">
            <CheckCircle2 className="w-6 h-6 text-blue-500" />
          </button>
        </header>

        <div className="flex flex-col items-center text-center mb-8">
           <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] mb-4 flex items-center justify-center border border-gray-100 shadow-sm overflow-hidden">
             <img src={selectedJob.logo} className="w-full h-full object-cover" alt="" />
           </div>
           <h3 className="text-2xl font-black text-gray-900">{selectedJob.title}</h3>
           <p className="text-blue-600 font-bold">{selectedJob.company}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
           <div className="bg-blue-50/50 p-4 rounded-3xl flex items-center space-x-3">
             <MapPin className="w-5 h-5 text-blue-500" />
             <div className="text-left">
               <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Location</p>
               <p className="text-xs font-bold">{selectedJob.location}</p>
             </div>
           </div>
           <div className="bg-indigo-50/50 p-4 rounded-3xl flex items-center space-x-3">
             <Clock className="w-5 h-5 text-indigo-500" />
             <div className="text-left">
               <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Type</p>
               <p className="text-xs font-bold">{selectedJob.type}</p>
             </div>
           </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-[2.5rem] mb-8">
          <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">About the role</h4>
          <p className="text-sm text-gray-600 leading-relaxed font-medium">
            {selectedJob.description}
            <br /><br />
            We offer competitive benefits, flexible working hours, and a vibrant community of innovators.
          </p>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-gray-100">
           {showApplySuccess ? (
             <div className="w-full bg-green-500 text-white py-4 rounded-3xl font-black text-center animate-in zoom-in-95">
               APPLICATION SENT!
             </div>
           ) : (
             <button 
               onClick={handleApply}
               className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-3xl font-black text-lg shadow-xl shadow-blue-200"
             >
               APPLY FOR THIS ROLE
             </button>
           )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-lg mx-auto bg-[#fafafa] min-h-screen pb-24">
      <header className="flex justify-between items-center mb-6 px-2">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Opportunities</h2>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-0.5">Find your next big move</p>
        </div>
        <button 
          onClick={() => setView('create')}
          className="p-3 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl text-white shadow-lg shadow-blue-100 hover:scale-105 transition-transform"
        >
          <Plus className="w-6 h-6" />
        </button>
      </header>

      {/* Search & Filter */}
      <div className="px-2 space-y-4 mb-8">
        <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 flex items-center space-x-3 shadow-sm">
          <Search className="w-5 h-5 text-gray-300" />
          <input 
            type="text" 
            placeholder="Search roles or companies..." 
            className="bg-transparent border-none outline-none w-full text-sm font-medium"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex space-x-3 overflow-x-auto scrollbar-hide py-1">
          {['All', 'Full-time', 'Part-time', 'Remote', 'Contract'].map(filter => (
            <button 
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`flex-shrink-0 px-5 py-2 rounded-2xl text-xs font-black transition-all ${activeFilter === filter ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-white text-gray-400 border border-gray-100'}`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Job List */}
      <div className="space-y-4 px-2">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-20">
             <Briefcase className="w-12 h-12 text-gray-200 mx-auto mb-4" />
             <p className="text-gray-400 font-bold">No opportunities found</p>
          </div>
        ) : (
          filteredJobs.map(job => (
            <div 
              key={job.id} 
              onClick={() => { setSelectedJob(job); setView('detail'); }}
              className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-start space-x-4 group cursor-pointer transition-all hover:shadow-md hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex-shrink-0 flex items-center justify-center border border-gray-100 overflow-hidden">
                 <img src={job.logo} className="w-full h-full object-cover" alt="" />
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-start mb-1">
                   <h4 className="font-black text-sm text-gray-900 group-hover:text-blue-600 transition-colors">{job.title}</h4>
                   <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{job.postedAt}</span>
                </div>
                <div className="flex items-center space-x-2 text-blue-500 font-bold text-xs mb-3">
                   <Building className="w-3.5 h-3.5" />
                   <span>{job.company}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1.5 text-gray-400">
                    <MapPin className="w-3 h-3" />
                    <span className="text-[10px] font-bold">{job.location}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-gray-400">
                    <DollarSign className="w-3 h-3" />
                    <span className="text-[10px] font-bold">{job.salary}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default JobsTab;
