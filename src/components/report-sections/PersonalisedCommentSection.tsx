import React from 'react';
import { TemplateSection } from '../../types';

interface PersonalisedCommentSectionProps {
  section: TemplateSection;
  data: any;
  updateSectionData: (sectionId: string, data: any) => void;
}

const PersonalisedCommentSection: React.FC<PersonalisedCommentSectionProps> = ({
  section,
  data,
  updateSectionData
}) => {
  const headings = section.data?.headings || [];
  const instruction = section.data?.instruction || 'Enter personalised information';

  return (
    <div style={{
      border: '2px solid #8b5cf6',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '20px',
      backgroundColor: '#f5f3ff'
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
          color: '#7c3aed',
          margin: 0
        }}>
          {section.name || 'Personalised Comment'}
        </h3>
      </div>

      {/* Instruction */}
      <div style={{
        backgroundColor: '#ede9fe',
        padding: '12px',
        borderRadius: '6px',
        marginBottom: '16px'
      }}>
        <p style={{
          fontSize: '14px',
          color: '#6d28d9',
          fontWeight: '500',
          margin: 0
        }}>
          📝 {instruction}
        </p>
      </div>

      {/* Personalised Information Input */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '500',
          color: '#374151',
          marginBottom: '8px'
        }}>
          Personalised Information:
        </label>
        <input
          type="text"
          value={data.personalisedInfo || ''}
          onChange={(e) => updateSectionData(section.id, { personalisedInfo: e.target.value })}
          placeholder="Enter the specific information for this student..."
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            fontFamily: 'inherit',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {/* Category Selection (if headings exist) */}
      {headings.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '12px'
          }}>
            Category:
          </label>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
            gap: '8px',
            marginBottom: '16px'
          }}>
            {headings.map((heading: string, index: number) => (
              <label key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                padding: '8px 12px',
                borderRadius: '6px',
                backgroundColor: data.selectedHeading === heading ? '#8b5cf6' : '#f3f4f6',
                color: data.selectedHeading === heading ? 'white' : '#374151',
                fontWeight: data.selectedHeading === heading ? '500' : '400',
                transition: 'all 0.2s ease'
              }}>
                <input
                  type="radio"
                  name={`heading-${section.id}`}
                  value={heading}
                  checked={data.selectedHeading === heading}
                  onChange={(e) => updateSectionData(section.id, { selectedHeading: e.target.value })}
                  style={{ margin: 0 }}
                />
                {heading}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Include Section Toggle */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          color: '#6b7280'
        }}>
          <input
            type="checkbox"
            checked={data.includeSection !== false}
            onChange={(e) => updateSectionData(section.id, { includeSection: e.target.checked })}
            style={{ transform: 'scale(1.1)' }}
          />
          <span>Include this section in the report</span>
        </label>
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
          placeholder="Add any additional personalised comments..."
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
          Use [Name] for student's name and [personalised information] for the custom data
        </p>
      </div>
    </div>
  );
};

export default PersonalisedCommentSection;