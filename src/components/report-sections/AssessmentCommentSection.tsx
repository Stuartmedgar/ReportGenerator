import React from 'react';
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
  return (
    <div style={{
      border: '2px solid #f59e0b',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '20px',
      backgroundColor: '#fffbeb'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <div>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#d97706',
            margin: '0 0 4px 0'
          }}>
            {section.name || 'Assessment Comment'}
          </h3>
          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            margin: 0,
            fontStyle: 'italic'
          }}>
            Assessment Comment Section
          </p>
        </div>
      </div>

      {/* Score Entry Section */}
      <div style={{
        backgroundColor: '#fef3c7',
        padding: '16px',
        borderRadius: '6px',
        marginBottom: '20px'
      }}>
        <h4 style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#92400e',
          marginBottom: '12px'
        }}>
          Assessment Score
        </h4>
        
        {/* Score Type Selection */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px',
            cursor: 'pointer'
          }}>
            <input
              type="radio"
              name={`scoreType-${section.id}`}
              value="outOf"
              checked={data.scoreType === 'outOf' || !data.scoreType}
              onChange={(e) => updateSectionData(section.id, { scoreType: e.target.value })}
            />
            <span style={{ fontSize: '14px', fontWeight: '500' }}>Score out of total</span>
          </label>
          
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer'
          }}>
            <input
              type="radio"
              name={`scoreType-${section.id}`}
              value="percentage"
              checked={data.scoreType === 'percentage'}
              onChange={(e) => updateSectionData(section.id, { scoreType: e.target.value })}
            />
            <span style={{ fontSize: '14px', fontWeight: '500' }}>Percentage</span>
          </label>
        </div>

        {/* Score Input for Out Of */}
        {(data.scoreType === 'outOf' || !data.scoreType) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <input
              type="number"
              value={data.score || ''}
              onChange={(e) => updateSectionData(section.id, { score: e.target.value })}
              placeholder="Score"
              style={{
                width: '80px',
                padding: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
            <span style={{ fontSize: '14px', fontWeight: '500' }}>out of</span>
            <input
              type="number"
              value={data.maxScore || ''}
              onChange={(e) => updateSectionData(section.id, { maxScore: e.target.value })}
              placeholder="Total"
              style={{
                width: '80px',
                padding: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
        )}

        {/* Score Input for Percentage */}
        {data.scoreType === 'percentage' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <input
              type="number"
              value={data.percentage || ''}
              onChange={(e) => updateSectionData(section.id, { percentage: e.target.value })}
              placeholder="Percentage"
              min="0"
              max="100"
              style={{
                width: '100px',
                padding: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
            <span style={{ fontSize: '14px', fontWeight: '500' }}>%</span>
          </div>
        )}
      </div>

      {/* Performance Rating */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '500',
          color: '#374151',
          marginBottom: '12px'
        }}>
          Performance Level:
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
            { value: 'not-completed', label: 'Assessment Not Completed', color: '#6b7280' },
            { value: 'no-comment', label: 'No Comment', color: '#9ca3af' }
          ].map(rating => (
            <label key={rating.value} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              padding: '8px 10px',
              borderRadius: '6px',
              backgroundColor: data.performance === rating.value ? rating.color : '#f3f4f6',
              color: data.performance === rating.value ? 'white' : '#374151',
              fontWeight: data.performance === rating.value ? '500' : '400',
              transition: 'all 0.2s ease'
            }}>
              <input
                type="radio"
                name={`performance-${section.id}`}
                value={rating.value}
                checked={data.performance === rating.value}
                onChange={(e) => updateSectionData(section.id, { performance: e.target.value })}
                style={{ margin: 0 }}
              />
              {rating.label}
            </label>
          ))}
        </div>
      </div>

      {/* Additional Comment */}
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
          placeholder="Add any additional comments about the assessment..."
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
        <p style={{
          fontSize: '12px',
          color: '#6b7280',
          margin: '4px 0 0 0',
          fontStyle: 'italic'
        }}>
          Use [Name] for student's name and [Score] for assessment result
        </p>
      </div>
    </div>
  );
};

export default AssessmentCommentSection;