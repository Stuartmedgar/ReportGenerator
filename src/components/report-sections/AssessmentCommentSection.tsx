import React, { useState } from 'react';
import { TemplateSection } from '../../types';

interface AssessmentCommentSectionProps {
  section: TemplateSection;
  data: any;
  updateSectionData: (sectionId: string, data: any) => void;
}

const AssessmentCommentSection: React.FC<AssessmentCommentSectionProps> = ({
  section,
  data,
  updateSectionData
}) => {
  const [showAdditionalComment, setShowAdditionalComment] = useState(false);

  const performances = [
    { value: 'excellent', label: 'Excellent', color: '#10b981' },
    { value: 'good', label: 'Good', color: '#3b82f6' },
    { value: 'satisfactory', label: 'Satisfactory', color: '#f59e0b' },
    { value: 'needsImprovement', label: 'Needs Imp.', color: '#ef4444' },
    { value: 'notCompleted', label: 'Not Done', color: '#6b7280' }
  ];

  return (
    <div style={{
      border: '2px solid #f59e0b',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '16px',
      backgroundColor: '#fef3c7'
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
          color: '#d97706',
          margin: 0
        }}>
          {section.name || 'Assessment Comment'}
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

      {/* Compact Score Entry Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '12px',
        flexWrap: 'wrap'
      }}>
        {/* Score Type Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => updateSectionData(section.id, { scoreType: 'percentage' })}
            style={{
              backgroundColor: data.scoreType === 'percentage' ? '#f59e0b' : 'white',
              color: data.scoreType === 'percentage' ? 'white' : '#d97706',
              border: '1px solid #f59e0b',
              borderRadius: '4px',
              padding: '4px 10px',
              fontSize: '12px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Percent
          </button>
          <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>or</span>
          <button
            onClick={() => updateSectionData(section.id, { scoreType: 'outOf' })}
            style={{
              backgroundColor: data.scoreType === 'outOf' || !data.scoreType ? '#f59e0b' : 'white',
              color: data.scoreType === 'outOf' || !data.scoreType ? 'white' : '#d97706',
              border: '1px solid #f59e0b',
              borderRadius: '4px',
              padding: '4px 10px',
              fontSize: '12px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Out of
          </button>
        </div>

        {/* Score Inputs */}
        {data.scoreType === 'percentage' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <input
              type="number"
              value={data.percentage || ''}
              onChange={(e) => updateSectionData(section.id, { percentage: e.target.value })}
              placeholder="85"
              style={{
                width: '50px',
                padding: '4px 6px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '12px'
              }}
            />
            <span style={{ fontSize: '12px', color: '#6b7280' }}>%</span>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <input
              type="number"
              value={data.score || ''}
              onChange={(e) => updateSectionData(section.id, { score: e.target.value })}
              placeholder="42"
              style={{
                width: '40px',
                padding: '4px 6px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '12px'
              }}
            />
            <span style={{ fontSize: '12px', color: '#6b7280' }}>/</span>
            <input
              type="number"
              value={data.maxScore || section.data?.maxScore || ''}
              onChange={(e) => updateSectionData(section.id, { maxScore: e.target.value })}
              placeholder="50"
              style={{
                width: '40px',
                padding: '4px 6px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '12px'
              }}
            />
          </div>
        )}
      </div>

      {/* Compact Performance Buttons */}
      <div style={{
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
        marginBottom: '8px'
      }}>
        {performances.map((performance) => (
          <button
            key={performance.value}
            onClick={() => updateSectionData(section.id, { performance: performance.value })}
            style={{
              backgroundColor: data.performance === performance.value ? performance.color : 'white',
              color: data.performance === performance.value ? 'white' : performance.color,
              border: `2px solid ${performance.color}`,
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              minWidth: 'auto',
              whiteSpace: 'nowrap'
            }}
          >
            {performance.label}
          </button>
        ))}
      </div>

      {/* Additional Comment Toggle - Under Performance Buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-start',
        marginBottom: showAdditionalComment ? '12px' : '0'
      }}>
        <button
          onClick={() => setShowAdditionalComment(!showAdditionalComment)}
          style={{
            backgroundColor: showAdditionalComment ? '#f59e0b' : '#e5e7eb',
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

export default AssessmentCommentSection;