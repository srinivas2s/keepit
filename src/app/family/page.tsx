'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { UserPlus, Trash2, Mail, User as UserIcon, ShieldCheck, ExternalLink, Users, Calendar, History, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function FamilyPage() {
  const { familyMembers, inviteFamilyMember, removeFamilyMember, products, user } = useApp();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Wife');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName || !inviteEmail) return;
    inviteFamilyMember(inviteName, inviteEmail, inviteRole);
    setInviteName('');
    setInviteEmail('');
    setInviteRole('Wife');
    setShowInviteModal(false);
  };

  // Helper to count products for a member
  const getProductCount = (memberName: string) => {
    return products.filter(p => p.owner_name?.toLowerCase().includes(memberName.toLowerCase())).length;
  };

  // Filter products shared by other family members
  const sharedProducts = products.filter(p => p.owner_name && p.owner_name !== 'You');

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg transition-colors duration-500 pb-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="p-2 bg-primary/10 dark:bg-primary/15 text-primary rounded-xl">
                <Users size={22} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-text dark:text-dark-text tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                Family Hub
              </h1>
            </div>
            <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
              Share warranties, track receipts, and stay protected together.
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href="/history"
              className="flex items-center gap-1.5 px-4 py-2.5 bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-2xl text-xs font-bold text-text-secondary dark:text-dark-text-secondary hover:border-primary/20 transition-all"
            >
              <History size={14} /> Activity Log
            </Link>

            <button
              onClick={() => setShowInviteModal(true)}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-primary text-white rounded-2xl text-xs font-black shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all active:scale-[0.98]"
            >
              <UserPlus size={14} /> Add Member
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Members List Section */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xs font-black text-text-muted dark:text-dark-text-secondary uppercase tracking-widest ml-1 mb-2">
              Family Group Members
            </h2>

            {/* Current User Card */}
            <div className="bg-surface dark:bg-dark-surface rounded-3xl border border-border dark:border-dark-border p-5 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-base shadow-md shadow-primary/15">
                  {user?.name ? getInitials(user.name) : 'ME'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-black text-text dark:text-dark-text text-base leading-tight">
                      {user?.name || 'Srinivas'}
                    </p>
                    <span className="text-[9px] font-black uppercase tracking-wider bg-primary/10 dark:bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                      Owner
                    </span>
                  </div>
                  <p className="text-xs text-text-muted dark:text-dark-text-secondary mt-0.5">
                    {user?.email || 'srinivas@example.com'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-text dark:text-dark-text">
                  {products.filter(p => p.owner_name === 'You' || !p.owner_name).length}
                </p>
                <p className="text-[9px] font-bold text-text-muted dark:text-dark-text-secondary uppercase tracking-wider">
                  Warranties
                </p>
              </div>
            </div>

            {/* Family Members Cards */}
            <AnimatePresence mode="popLayout">
              {familyMembers.map((member) => (
                <motion.div
                  key={member.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-surface dark:bg-dark-surface rounded-3xl border border-border dark:border-dark-border p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-2xl text-white flex items-center justify-center font-black text-base shadow-sm"
                      style={{ backgroundColor: member.avatarColor }}
                    >
                      {getInitials(member.name)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-black text-text dark:text-dark-text text-base leading-tight">
                          {member.name}
                        </p>
                        <span className="text-[9px] font-black uppercase tracking-wider bg-surface-hover dark:bg-dark-surface-hover border border-border dark:border-dark-border text-text-secondary dark:text-dark-text-secondary px-2 py-0.5 rounded-full">
                          {member.role}
                        </span>
                      </div>
                      <p className="text-xs text-text-muted dark:text-dark-text-secondary mt-0.5">
                        {member.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-black text-text dark:text-dark-text">
                        {getProductCount(member.name)}
                      </p>
                      <p className="text-[9px] font-bold text-text-muted dark:text-dark-text-secondary uppercase tracking-wider">
                        Warranties
                      </p>
                    </div>

                    <button
                      onClick={() => setShowDeleteConfirm(member.id)}
                      className="p-2 text-text-muted hover:text-danger hover:bg-danger/10 rounded-xl transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {familyMembers.length === 0 && (
              <div className="text-center py-10 bg-surface dark:bg-dark-surface rounded-[32px] border border-dashed border-border dark:border-dark-border">
                <Users size={32} className="mx-auto text-text-muted mb-3" />
                <p className="text-sm text-text-secondary dark:text-dark-text-secondary font-semibold">
                  No family members added yet.
                </p>
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="mt-3 text-xs font-black text-primary uppercase tracking-wider hover:underline"
                >
                  Invite your family
                </button>
              </div>
            )}
          </div>

          {/* Shared Products Section */}
          <div className="space-y-4">
            <h2 className="text-xs font-black text-text-muted dark:text-dark-text-secondary uppercase tracking-widest ml-1 mb-2">
              Shared Family Warranties
            </h2>

            <div className="space-y-3">
              {sharedProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="block bg-surface dark:bg-dark-surface rounded-2xl border border-border dark:border-dark-border p-4 shadow-sm hover:border-primary/20 hover:-translate-y-0.5 transition-all group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-sm text-text dark:text-dark-text group-hover:text-primary transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-[10px] text-text-muted dark:text-dark-text-secondary mt-0.5">
                        {product.brand} · {product.owner_name}
                      </p>
                    </div>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide badge-${product.status}`}>
                      {product.status}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-text-muted dark:text-dark-text-secondary border-t border-border dark:border-dark-border/40 pt-2 mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar size={10} /> Exp: {new Date(product.expiry_date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                    </span>
                    <span className="text-primary flex items-center gap-0.5 font-bold group-hover:underline">
                      View <ExternalLink size={8} />
                    </span>
                  </div>
                </Link>
              ))}

              {sharedProducts.length === 0 && (
                <div className="text-center py-8 bg-surface dark:bg-dark-surface rounded-[24px] border border-dashed border-border dark:border-dark-border">
                  <p className="text-xs text-text-muted dark:text-dark-text-secondary">
                    No shared products found.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Invite Modal */}
        <AnimatePresence>
          {showInviteModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
            >
              <motion.div
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                className="bg-surface dark:bg-dark-surface rounded-[32px] border border-border dark:border-dark-border p-6 max-w-sm w-full shadow-2xl relative"
              >
                <h3 className="text-lg font-black text-text dark:text-dark-text mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  Invite Family Member
                </h3>
                <p className="text-xs text-text-secondary dark:text-dark-text-secondary mb-5">
                  Let your loved ones access your warranties and list their items here.
                </p>

                <form onSubmit={handleInvite} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider ml-1">Name</label>
                    <div className="relative flex items-center group">
                      <UserIcon size={14} className="absolute left-4 text-text-muted group-focus-within:text-primary" />
                      <input
                        type="text"
                        required
                        value={inviteName}
                        onChange={e => setInviteName(e.target.value)}
                        placeholder="Family Member Name"
                        className="w-full pl-10 pr-4 py-2.5 bg-background dark:bg-dark-bg border border-border dark:border-dark-border rounded-xl text-xs text-text dark:text-dark-text outline-none focus:border-primary font-semibold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider ml-1">Email</label>
                    <div className="relative flex items-center group">
                      <Mail size={14} className="absolute left-4 text-text-muted group-focus-within:text-primary" />
                      <input
                        type="email"
                        required
                        value={inviteEmail}
                        onChange={e => setInviteEmail(e.target.value)}
                        placeholder="email@family.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-background dark:bg-dark-bg border border-border dark:border-dark-border rounded-xl text-xs text-text dark:text-dark-text outline-none focus:border-primary font-semibold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider ml-1">Relationship</label>
                    <select
                      value={inviteRole}
                      onChange={e => setInviteRole(e.target.value)}
                      className="w-full px-4 py-2.5 bg-background dark:bg-dark-bg border border-border dark:border-dark-border rounded-xl text-xs text-text dark:text-dark-text outline-none focus:border-primary font-semibold"
                    >
                      {['Wife', 'Husband', 'Son', 'Daughter', 'Parent', 'Sibling', 'Friend', 'Other'].map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowInviteModal(false)}
                      className="flex-1 py-2.5 bg-surface-hover dark:bg-dark-surface-hover rounded-xl font-bold text-xs text-text dark:text-dark-text"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-primary text-white rounded-xl font-bold text-xs hover:bg-primary-dark transition-colors"
                    >
                      Invite
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
            >
              <motion.div
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                className="bg-surface dark:bg-dark-surface rounded-[32px] border border-border dark:border-dark-border p-6 max-w-sm w-full shadow-2xl"
              >
                <h3 className="text-lg font-black text-text dark:text-dark-text mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  Remove Member?
                </h3>
                <p className="text-xs text-text-secondary dark:text-dark-text-secondary mb-6">
                  This member will no longer have shared access to your warranties, and their warranties will be removed.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 py-2.5 bg-surface-hover dark:bg-dark-surface-hover rounded-xl font-bold text-xs text-text dark:text-dark-text"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      removeFamilyMember(showDeleteConfirm);
                      setShowDeleteConfirm(null);
                    }}
                    className="flex-1 py-2.5 bg-danger text-white rounded-xl font-bold text-xs hover:bg-danger/90 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
