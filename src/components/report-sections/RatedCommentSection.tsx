import React from 'react';
import { TemplateSection } from '../../types';

interface RatedCommentSectionProps {
  section: TemplateSection;
  data: any;
  updateSectionData: (sectionId: string, data: any) => void;
}

const RatedCommentSection: React.FC<RatedCommentSectionProps> = ({
  section,
  data,
  updateSectionData
}) => {
  return (
    <div style={{
      border: '2px solid #3b82f6',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '20px',
      backgroundColor: '#eff6ff'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#1e40af',
          margin: 0
        }}>
          {section.name || 'Rated Comment'}
        </h3>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '500',
          color: '#374151',
          marginBottom: '12px'
        }}>
          Select Rating:
        </label>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
          gap: '8px',
          marginBottom: '16px'
        }}>
          {[
            { value: 'excellent', label: 'Excellent', color: '#10b981' },
            { value: 'good', label: 'Good', color: '#3b82f6' },
            { value: 'satisfactory', label: 'Satisfactory', color: '#f59e0b' },
            { value: 'needs-improvement', label: 'Needs Improvement', color: '#ef4444' },
            { value: 'no-comment', label: 'No Comment', color: '#6b7280' }
          ].map(rating => (
            <label key={rating.value} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              padding: '8px 12px',
              borderRadius: '6px',
              backgroundColor: data.rating === rating.value ? rating.color : '#f3f4f6',
              color: data.rating === rating.value ? 'white' : '#374151',
              fontWeight: data.rating === rating.value ? '500' : '400',
              transition: 'all 0.2s ease'
            }}>
              <input
                type="radio"
                name={`rating-${section.id}`}
                value={rating.value}
                checked={data.rating === rating.value}
                onChange={(e) => updateSectionData(section.id, { rating: e.target.value })}
                style={{ margin: 0 }}
              />
              {rating.label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '500',
          color: '#374151',
          marginBottom: '8px'
        }}>
          Additional Comment (Optional):
        </label>
        <textarea
          value={data.additionalComment || ''}
          onChange={(e) => updateSectionData(section.id, { additionalComment: e.target.value })}
          placeholder="Add any additional comments..."
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            minHeight: '80px',
            resize: 'vertical',
            fontFamily: 'inherit',
            boxSizing: 'border-box'
          }}
        />
      </div>
    </div>
  );
};

export default RatedCommentSection;