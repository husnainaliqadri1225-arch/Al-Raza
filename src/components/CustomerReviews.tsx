import React, { useState } from 'react';
import { Review } from '../types';
import { Star, CheckCircle, MessageSquarePlus, X } from 'lucide-react';

interface CustomerReviewsProps {
  reviews: Review[];
  onAddReview: (review: Review) => void;
}

export const CustomerReviews: React.FC<CustomerReviewsProps> = ({ reviews, onAddReview }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAuthor, setNewAuthor] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newPerfume, setNewPerfume] = useState('Fougerewood Elixir');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim()) return;

    const review: Review = {
      id: `rev-${Date.now()}`,
      author: newAuthor.trim(),
      location: newLocation.trim() || 'Verified Customer',
      perfumeTitle: newPerfume,
      rating: newRating,
      comment: newComment.trim(),
      verified: true,
      date: 'Just now',
    };

    onAddReview(review);
    setNewAuthor('');
    setNewLocation('');
    setNewComment('');
    setShowAddModal(false);
  };

  return (
    <section id="reviews-section" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Header matching reference image: "Customer Reviews" */}
        <div className="text-center space-y-2 mb-10 sm:mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-gold-gradient font-bold tracking-tight">
            Customer Reviews
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm tracking-wider uppercase">
            Real impressions from discerning fragrance collectors worldwide
          </p>
        </div>

        {/* Reviews Grid matching the rounded cards in the reference photo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="perfume-card-glass rounded-[24px] sm:rounded-[28px] p-6 sm:p-8 flex flex-col justify-between border border-[#23587A]/40 transition-all hover:border-[#D4AF37]/40 shadow-lg relative"
            >
              <div>
                {/* 5 Golden Stars matching reference */}
                <div className="flex items-center gap-1.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < rev.rating
                          ? 'fill-[#D4AF37] text-[#D4AF37] drop-shadow-[0_0_6px_rgba(212,175,55,0.4)]'
                          : 'text-slate-600'
                      }`}
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-slate-200 text-sm sm:text-base leading-relaxed italic font-light mb-6">
                  "{rev.comment}"
                </p>
              </div>

              {/* Reviewer Details */}
              <div className="pt-4 border-t border-[#16415C]/60 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-serif font-semibold text-sm text-slate-100">{rev.author}</span>
                    {rev.verified && (
                      <span title="Verified Buyer" className="inline-flex">
                        <CheckCircle className="w-3.5 h-3.5 text-[#38BDF8]" />
                      </span>
                    )}
                  </div>
                  {rev.location && (
                    <span className="text-xs text-slate-400 font-light">{rev.location}</span>
                  )}
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-[#D4AF37] font-medium tracking-wide block">
                    {rev.perfumeTitle}
                  </span>
                  <span className="text-[10px] text-slate-500">{rev.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Leave Review Button */}
        <div className="mt-8 sm:mt-12 text-center">
          <button
            id="btn-open-add-review"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0A263B] hover:bg-[#0F3652] border border-[#23587A] text-xs sm:text-sm font-medium text-[#F3E5AB] transition-colors shadow-sm"
          >
            <MessageSquarePlus className="w-4 h-4 text-[#D4AF37]" />
            <span>Share Your Experience</span>
          </button>
        </div>

      </div>

      {/* Add Review Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#092233] border border-[#255E84] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-left relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-xl text-gold-gradient font-bold mb-1">
              Write a Fragrance Review
            </h3>
            <p className="text-xs text-slate-400 mb-5">Share your thoughts on Al Raza</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="e.g. Tariq Jamil"
                  className="w-full bg-[#061824] border border-[#1E4D6E] rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Location / City</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. Islamabad, PK"
                    className="w-full bg-[#061824] border border-[#1E4D6E] rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Rating</label>
                  <select
                    value={newRating}
                    onChange={(e) => setNewRating(Number(e.target.value))}
                    className="w-full bg-[#061824] border border-[#1E4D6E] rounded-xl px-3 py-2 text-sm text-[#F3E5AB] focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="5">★★★★★ (5/5)</option>
                    <option value="4">★★★★☆ (4/5)</option>
                    <option value="3">★★★☆☆ (3/5)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Perfume Purchased</label>
                <input
                  type="text"
                  value={newPerfume}
                  onChange={(e) => setNewPerfume(e.target.value)}
                  placeholder="e.g. Fougerewood Elixir"
                  className="w-full bg-[#061824] border border-[#1E4D6E] rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Your Review</label>
                <textarea
                  required
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="How does it smell? Sillage, longevity, compliments..."
                  className="w-full bg-[#061824] border border-[#1E4D6E] rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-[#D4AF37] resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#05131E] font-semibold text-xs shadow-md"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
