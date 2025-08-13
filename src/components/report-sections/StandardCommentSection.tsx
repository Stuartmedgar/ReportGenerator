import React from 'react';
import { TemplateSection } from '../../types';

interface StandardCommentSectionProps {
  section: TemplateSection;
  data: any;
  updateSectionData: (sectionId: string, data: any) => void;
}

const StandardCommentSection: React.FC<StandardCommentSectionProps> = ({
  section,
  data,
  updateSectionData
}) => {
  return (
    <div style={{
      border: '2px solid #10b981',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '20px',
      backgroundColor: '#ecfdf5'
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
            color: '#047857',
            margin: '0 0 4px 0'
          }}>
            {section.name || 'Standard Comment'}
          </h3>
          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            margin: 0,
            fontStyle: 'italic'
          }}>
            Standard Comment Section
          </p>
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
          Comment:
        </label>
        <textarea
          value={data.comment || section.data?.content || ''}
          onChange={(e) => updateSectionData(section.id, { comment: e.target.value })}
          placeholder="Enter your comment..."
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            minHeight: '100px',
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
          Use [Name] as a placeholder for the student's first name
        </p>
      </div>
    </div>
  );
};

export default StandardCommentSection;