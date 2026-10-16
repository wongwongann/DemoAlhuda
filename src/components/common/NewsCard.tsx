import React from 'react';
import { NewsItem, UnitType } from '../../types';
interface NewsCardProps { news: NewsItem; onClick?: (news: NewsItem) => void; featured?: boolean; }
export const getUnitBadge = (unit: UnitType) => {
  switch (unit) {
    case 'smp': return { label: 'SMP Al-Huda', bg: 'bg-blue-900 text-blue-50 border-blue-800', dot: 'bg-blue-200' };
    case 'pondok': return { label: 'Pondok Pesantren', bg: 'bg-amber-900 text-amber-50 border-amber-800', dot: 'bg-amber-200' };
    default: return { label: 'Yayasan Al-Huda', bg: 'bg-emerald-900 text-emerald-50 border-emerald-800', dot: 'bg-emerald-200' };
  }
};
export const NewsCard: React.FC<NewsCardProps> = ({ news, onClick, featured = false }) => (
  <article id={`news-${featured ? 'featured' : 'card'}-${news.id}`} className={`news-article ${featured ? 'news-article-featured' : ''}`}>
    <div className="news-photo"><img src={news.imageUrl} alt="" loading="lazy" referrerPolicy="no-referrer" /></div>
    <div className="news-article-copy"><div className="news-meta"><span>{getUnitBadge(news.unit).label}</span><span>{news.category}</span></div><h3><button onClick={() => onClick?.(news)}>{news.title}</button></h3><p>{news.excerpt}</p><time dateTime={news.publishDate}>{new Date(news.publishDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</time></div>
  </article>
);
