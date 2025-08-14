import React, { useState } from 'react';
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
  const [showAdditionalComment, setShowAdditionalComment] = useState(false);

  const ratings = [
    { value: 'excellent', label: 'Excellent', color: '#10b981' },
    { value: 'good', label: 'Good', color: '#3b82f6' },
    { value: 'satisfactory', label: 'Satisfactory', color: '#f59e0b' },
    { value: 'needsImprovement', label: 'Needs Improvement', color: '#ef4444' }
  ];

  return (
    <div style={{
      border: '2px solid #3b82f6',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '16px',
      backgroundColor: '#eff6ff'
    }}>
      {/* Compact Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px'
      }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#1e40af',
          margin: 0
        }}>
          {section.name || 'Rated Comment'}
        </h3>
        
        {/* Header Options */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <input
              type="checkbox"
              checked={data.showHeader !== false}
              onChange={(e) => updateSectionData(section.id, { showHeader: e.target.checked })}
              style={{
                width: '14px',
                height: '14px',
                cursor: 'pointer'
              }}
            />
            <span style={{
              fontSize: '12px',
              color: '#6b7280',
              fontWeight: '500'
            }}>
              Header
            </span>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <input
              type="checkbox"
              checked={data.exclude || false}
              onChange={(e) => updateSectionData(section.id, { exclude: e.target.checked })}
              style={{
                width: '14px',
                height: '14px',
                cursor: 'pointer'
              }}
            />
            <span style={{
              fontSize: '12px',
              color: '#6b7280',
              fontWeight: '500'
            }}>
              Exclude
            </span>
          </div>
        </div>
      </div>

      {/* Compact Rating Buttons - Single Row */}
      <div style={{
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
        marginBottom: '8px'
      }}>
        {ratings.map((rating) => (
          <button
            key={rating.value}
            onClick={() => updateSectionData(section.id, { rating: rating.value })}
            style={{
              backgroundColor: data.rating === rating.value ? rating.color : 'white',
              color: data.rating === rating.value ? 'white' : rating.color,
              border: `2px solid ${rating.color}`,
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              minWidth: 'auto',
              whiteSpace: 'nowrap'
            }}
          >
            {rating.label}
          </button>
        ))}
      </div>

      {/* Additional Comment Toggle - Under Ratings */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-start',
        marginBottom: showAdditionalComment ? '12px' : '0'
      }}>
        <button
          onClick={() => setShowAdditionalComment(!showAdditionalComment)}
          style={{
            backgroundColor: showAdditionalComment ? '#3b82f6' : '#e5e7eb',
            color: showAdditionalComment ? 'white' : '#6b7280',
            border: 'none',
            borderRadius: '4px',
            padding: '4px 8px',
            fontSize: '12px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          {showAdditionalComment ? '- Comment' : '+ Comment'}
        </button>
      </div>

      {/* Collapsible Additional Comment */}
      {showAdditionalComment && (
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          padding: '8px'
        }}>
          <textarea
            value={data.additionalComment || ''}
            onChange={(e) => updateSectionData(section.id, { additionalComment: e.target.value })}
            placeholder="Additional comment (optional)..."
            style={{
              width: '100%',
              minHeight: '50px',
              padding: '6px',
              border: 'none',
              borderRadius: '4px',
              resize: 'vertical',
              fontSize: '14px',
              outline: 'none'
            }}
          />
        </div>
      )}
    </div>
  );
};

export default RatedCommentSection;